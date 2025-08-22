import os
import json
import logging
from typing import Any

from dotenv import load_dotenv
import google.generativeai as genai
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.concurrency import run_in_threadpool
from pydantic import BaseModel

# --- Project modules ---
from .data.prompts.diseases_list import diseases_list, paitent_list
from .data.prompts.system_prompts import persona_data
from .data.prompts.prompt_details import (
    get_prompt,
    get_prompt_for_student_report,
    get_prompt_for_summary,
)
from .models.user import DiseaseRequest, UserQuery, StudentReportRequest

# ---------------------------------------------------------------------
# Bootstrap
# ---------------------------------------------------------------------
load_dotenv()
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("api")

GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")
if not GOOGLE_API_KEY:
    logger.warning("GOOGLE_API_KEY is not set. Gemini calls will fail.")

# Configure Gemini
genai.configure(api_key=GOOGLE_API_KEY)
GEMINI_MODEL_NAME = os.getenv("GEMINI_MODEL", "gemini-1.5-flash")
gemini_model = genai.GenerativeModel(GEMINI_MODEL_NAME)

app = FastAPI()
message_history = []  # simple in-memory log

# CORS
ALLOW_ORIGINS = os.getenv("ALLOW_ORIGINS", "*").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOW_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------
async def gemini_complete(prompt: str, max_tokens: int | None = None, temperature: float = 0.1) -> str:
    """Call Gemini synchronously in a thread to avoid blocking the event loop."""
    def _call() -> Any:
        cfg = genai.GenerationConfig(temperature=temperature)
        if max_tokens is not None:
            cfg.max_output_tokens = max_tokens
        return gemini_model.generate_content(prompt, generation_config=cfg)

    response = await run_in_threadpool(_call)
    text = getattr(response, "text", None)
    if not text and hasattr(response, "candidates") and response.candidates:
        text = response.candidates[0].content.parts[0].text
    return (text or "").strip()

# ---------------------------------------------------------------------
# REST Endpoints
# ---------------------------------------------------------------------
@app.get("/health")
async def health():
    """
    Simple endpoint to check if the backend is running.
    """
    return {"status": "ok"}


@app.get("/diseases_list")
async def get_diseases_list():
    return {"list": diseases_list}

@app.get("/paitent_list")
async def get_paitent_list():
    return {"list": paitent_list}

@app.post("/patients_by_disease")
async def get_patients_by_disease(request: DiseaseRequest):
    filtered_patients = [p for p in paitent_list if p["disease_id"] == request.disease_id]
    if not filtered_patients:
        return JSONResponse(status_code=404, content={"message": f"No patients found for disease ID '{request.disease_id}'"})
    return {"patients": filtered_patients}

@app.post("/chat")
async def chat_with_patient(user_query: UserQuery):
    if not user_query.patient_name or not user_query.condition:
        return JSONResponse(content={"error": "Missing patient_name or condition in request."}, status_code=400)

    condition_data = persona_data.get(user_query.condition)
    if not condition_data:
        return JSONResponse(content={"error": f"Condition '{user_query.condition}' not found."}, status_code=404)

    patient_list = condition_data.get("patients", [])
    patient = next((p for p in patient_list if p["name"].lower() == user_query.patient_name.lower()), None)
    if not patient:
        return JSONResponse(content={"error": f"Patient '{user_query.patient_name}' not found under condition '{user_query.condition}'."}, status_code=404)

    symptoms_str = ", ".join(condition_data.get("symptoms", []))
    full_prompt = get_prompt(patient, user_query, symptoms_str)

    try:
        response = await gemini_complete(full_prompt, max_tokens=100, temperature=0.1)
        message_history.append({"patient": response, "doctor": user_query.message})
        logger.info("LLM response: %s", response)
        return JSONResponse(content={"response": response}, status_code=200)
    except Exception as e:
        logger.exception("Gemini error")
        return JSONResponse(content={"error": str(e)}, status_code=500)

@app.post("/generate_student_report")
async def generate_student_report(user_query: StudentReportRequest):
    try:
        patient = user_query.patient
        conversation_json = user_query.conversation_json
        if not patient.name or not patient.condition:
            return JSONResponse(content={"error": "Missing patient name or condition."}, status_code=400)

        symptoms_str = "Not specified"
        prompt = get_prompt_for_student_report(patient, symptoms_str, conversation_json)
        response = await gemini_complete(prompt, temperature=0.1)
        return JSONResponse(content={"response": response}, status_code=200)
    except Exception as e:
        logger.exception("Report generation failed")
        return JSONResponse(content={"error": str(e)}, status_code=500)

@app.post("/generate_summary")
async def generate_summary(user_query: StudentReportRequest):
    try:
        patient = user_query.patient
        conversation_json = user_query.conversation_json
        if not patient.name or not patient.condition:
            return JSONResponse(content={"error": "Missing patient name or condition."}, status_code=400)

        prompt = get_prompt_for_summary(patient, conversation_json)
        response = await gemini_complete(prompt, temperature=0.1)
        return JSONResponse(content={"response": response}, status_code=200)
    except Exception as e:
        logger.exception("Summary generation failed")
        return JSONResponse(content={"error": str(e)}, status_code=500)
