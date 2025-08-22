from pydantic import BaseModel
from typing import List, Union, Literal

# Define a Pydantic model for the request body
class DiseaseRequest(BaseModel):
    disease_id: int

class LLMRequest(BaseModel):
    text: str
    # data: list

class UserQuery(BaseModel):
    message: str
    patient_name: str
    condition: str

class PatientInfo(BaseModel):
    name: str
    age: int
    gender: str
    condition: str

class DoctorTurn(BaseModel):
    doctor: str


class PatientTurn(BaseModel):
    patient: str


ConversationTurn = Union[DoctorTurn, PatientTurn]


class StudentReportRequest(BaseModel):
    patient: PatientInfo
    conversation_json: List[ConversationTurn]

