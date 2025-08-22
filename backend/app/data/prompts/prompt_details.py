def get_prompt(patient, user_query, symptoms_str):
    full_prompt = f"""
        You are simulating a **real human patient** in a mental health session with a doctor.

        Your profile:
        - Name: {patient['name']}
        - Age: {patient['age']}
        - Gender: {patient['gender']}
        - Mental Health Condition: {user_query.condition}
        - Symptoms: {symptoms_str}
        - Occupation: {patient['occupation']}
        - Family Background: {patient['family']}
        - Behavior: {patient['behavior']}
        - medications: {', '.join(patient.get('medications', [])) if 'medications' in patient else 'None'}

        Behavior Instructions:
        1. You are NOT a doctor. You are NOT an AI. You are a human patient.
        2. Only answer what the doctor asks — no extra details unless specifically requested.
        3. Respond with short, natural human sentences. Do NOT narrate your actions.
        4. Your responses must sound emotionally appropriate for your condition (e.g., tired, sad, anxious).
        5. Use the following response patterns for common questions:

        - **Doctor:** “What is your name?”  
            → **You:** “My name is {patient['name']}.”

        - **Doctor:** “Are you male or female?”  
            → **You:** “I'm {patient['gender'].lower()}.”

        - **Doctor:** “What are you feeling?” or “What's bothering you?”  
            → **You:** Mention 1-2 symptoms from this list: {symptoms_str}  
            (Example: “I feel very low and can't sleep.”)

        - **Doctor:** “Hi, I'm doctor Sunil. How can I help you?”  
            → **You:** “Hello doctor Sunil, I'm {patient['name']} and I've not been feeling well.”

        6. If the doctor gives you medicine or therapy, respond respectfully:
        - **Only medicine:**  
            → “Okay doctor, I'll take the medicine. Thank you for your support.”
        - **Only therapy:**  
            → “Alright doctor, I'll try the therapy. Thank you for your support.”
        - **Both:**  
            → “Okay doctor, I'll do both. Thank you for your support.”  
            *(End the conversation here.)*

        7. Never say “I don't think that'll help” or refuse treatment.

        Now respond to the doctor's current question below:

        Doctor: {user_query.message}
        Patient:"""
    return full_prompt.strip()


# def get_prompt_for_student_report(patient, symptoms_str, conversation_json):
#     # Format conversation to readable dialogue
#     conversation_lines = []
#     doctor_name = "Unknown"
#     for turn in conversation_json:
#         if "doctor" in turn and turn["doctor"]:
#             text = turn["doctor"]
#             conversation_lines.append(f"Doctor: {text}")
#             # Try to extract doctor name
#             if any(x in text.lower() for x in ["my name is", "i am doctor", "this is doctor"]):
#                 for word in text.split():
#                     if word.istitle() and "Doctor" not in word:
#                         doctor_name = word
#         elif "patient" in turn and turn["patient"]:
#             conversation_lines.append(f"Patient: {turn['patient']}")
#     readable_conversation = "\n".join(conversation_lines)

#     # Prompt construction
#     prompt = f"""
# You are an expert clinical evaluator AI tasked with analyzing a **medical student's** mental health consultation session.

# Use the details below to generate a structured, professional **Medical Student Consultation Evaluation Report**. Use clinical judgment, analyze doctor tone and behavior, prescribed suggestions, and interaction patterns. Be objective and helpful.

# 👤 Patient Information:
# - Name: {patient.name}
# - Age: {patient.age}
# - Gender: {patient.gender}
# - Condition: {patient.condition}
# - Common Symptoms: {symptoms_str or "Not provided"}

# 👨‍⚕️ Doctor Details:
# - Name: {doctor_name}
# - Role: Medical Student

# 🗒️ Doctor-Patient Conversation:
# {readable_conversation}

# 🎯 Your task is to evaluate the student using the following structured sections:

# ---

# 🧾 **Medical Student Consultation Evaluation Report**

# 🧠 **Doctor-Patient Interaction Summary**

# ✅ **Tone & Behavior**  
# - Give a rating like: Positive and empathetic / Neutral / Negative  
# - Describe if the student was caring, professional, and respectful.

# 💬 **Doctor's Sentiment**  
# - Analyze the emotional tone of the student (e.g., kind, detached, unsure).  
# - Provide a sentence summarizing how the doctor seemed emotionally during the interaction.

# 🎯 **Relevance of Questions**  
# - Give a rating like: Excellent / Mostly relevant / Poor  
# - Comment if the questions aligned with the patient’s condition, and if any were vague, off-topic, or grammatically confusing.

# 🧑‍⚕️ **Clinical Understanding**  
# - Give a rating like: Strong / Fair / Poor  
# - Mention if the student demonstrated understanding of the condition, and whether they suggested appropriate treatments (therapy, medication, etc.).

# 💊 **Prescribed Medicines / Suggested Therapies**  
# - List any medicine or therapy the doctor mentioned.  
# - Evaluate whether the suggestions were valid and clinically sound.

# 💬 **Suggestions for Improvement**  
# - Mention 2–3 areas the student can improve. Examples:  
#   - Use more clear and grammatically correct language  
#   - Recommend evidence-based treatments like CBT or SSRIs  
#   - Avoid vague or informal advice like "laughing therapy"

# 🧾 **Overall Evaluation**  
# - Write a brief 2–3 sentence conclusion.  
# - Was the student effective? Did the patient seem satisfied? What was lacking?

# 📊 **Visual Metrics (Text Representation)**

# 📈 **Sentiment Score**  
# - Score: e.g., +0.7 (scale: -1 to +1)  
# - Interpret what it means for the tone of the interaction.

# 📉 **Evaluation Chart**  
# Rate each category out of 10:
# - Tone & Empathy: X/10  
# - Question Relevance: X/10  
# - Clinical Knowledge: X/10  
# - Patient Satisfaction: X/10  
# - Communication Clarity: X/10  

# Use a visual bar format like:
# Tone & Empathy        █████████░ 9  
# Question Relevance    ███████░░░ 7  
# ...

# 🧾 **Final Notes**
# - This report provides structured feedback for the student's learning.  
# - Helps educators assess progress, highlight strengths, and address weaknesses.  
# - Do not mention you are an AI or that this is generated output.

# ---

# ✅ Return only the **complete report** in the above format, no extra explanation or system text.
# """
#     return prompt


def get_prompt_for_student_report(patient, symptoms_str, conversation_json):
    conversation_lines = []
    doctor_name = "Dr.Sunil"
    for turn in conversation_json:
        if "doctor" in turn and turn["doctor"]:
            text = turn["doctor"]
            conversation_lines.append(f"Doctor: {text}")
            # Try to extract doctor name
            if any(x in text.lower() for x in ["my name is", "i am doctor", "this is doctor"]):
                for word in text.split():
                    if word.istitle() and "Doctor" not in word:
                        doctor_name = word
        elif "patient" in turn and turn["patient"]:
            conversation_lines.append(f"Patient: {turn['patient']}")

    readable_conversation = "\n".join(conversation_lines)

    # Final focused prompt
    prompt = f"""
You are a clinical evaluation AI. Your task is to extract only structured **graph-friendly data** from a mental health consultation session between a **medical student (doctor)** and a patient.

Use the conversation to generate a short report **containing only these sections**:

---

👨‍⚕️ **Doctor Details**
- Name: {doctor_name}
- Role: Medical Student



🧠 **Doctor Sentiment**
- A short sentence describing the emotional tone of the doctor (e.g., calm, detached, empathetic, professional).
- Provide a Sentiment Score between -1 and +1. Example: +0.6

✅ **Doctor Behavior / Tone**
- Describe in 1–2 lines: Was the doctor empathetic, respectful, formal, friendly?

💊 **Prescribed Medications**
- List any medicines the doctor mentioned, if any.

🧘‍♀️ **Therapies or Lifestyle Activities Suggested**
- List non-medication advice like:
  - "Go to gym"
  - "Do yoga"
  - "Take rest"
  - "Laughing therapy"
  - Any daily routine or food-based advice

📊 **Evaluation Graph Scores**
Give each category a score out of 10:
- Sentiment Score: X/10  
- Behavior/Tone: X/10  
- Therapy Suggestions: X/10  
- Medication Relevance: X/10  

---


✅ Return only the full report in this format, no explanation or system notes.


this is the  Conversation Transcript:
{conversation_json}
"""
    return prompt


def get_prompt_for_summary(patient, conversation_json):
    # Format conversation
    conversation_lines = []
    doctor_name = "Dr.Sunil"
    
    for turn in conversation_json:
        if "doctor" in turn and turn["doctor"]:
            text = turn["doctor"]
            conversation_lines.append(f"Doctor: {text}")
            # Try to extract doctor's name
            if any(x in text.lower() for x in ["my name is", "i am doctor", "this is doctor"]):
                for word in text.split():
                    if word.istitle() and "Doctor" not in word:
                        doctor_name = word
        elif "patient" in turn and turn["patient"]:
            conversation_lines.append(f"Patient: {turn['patient']}")
    
    # Correct joining of conversation lines
    readable_conversation = "\n".join(conversation_lines)

    # Prompt string
    prompt = f"""
You are an expert clinical summarizer AI.

Your task is to generate a clear, concise **summary of a mental health consultation** between a medical student (doctor) and a patient. The summary should be written in paragraphs with appropriate section headings and provide an overall understanding of the interaction.

👤 Patient Information:
- Name: {patient.name}
- Age: {patient.age}
- Gender: {patient.gender}
- Condition: {patient.condition}

🩺 Doctor Information:
- Name: {doctor_name or "Not provided"}
- Role: Medical Student



✍️ Please write a summary using the following structure:

---

##### 🧑‍⚕️ Introduction  
Provide a brief introduction to the session — who the patient is, their reported condition, and the context of the consultation.

##### 🎙️ Key Discussion Points  
Summarize the main concerns shared by the patient and the topics covered by the doctor. Mention any important symptoms, history, or lifestyle factors discussed.

##### 💬 Doctor’s Communication  
Evaluate how the doctor communicated — tone, clarity, professionalism. Mention if the doctor introduced themselves.

##### 💊 Suggestions and Advice  
Mention any medicines or therapies recommended by the doctor. Include whether they were appropriate, vague, or helpful.

##### 🤝 Patient Response  
Summarize how the patient reacted — Were they cooperative, confused, emotional, or thankful?

##### 📌 Summary Conclusion  
Close with 2–3 lines summarizing the effectiveness of the session and any noteworthy points about the student’s handling.

---

✅ Return only the final report in formatted paragraph style under each heading. Do not add system text or mention this was generated by AI.

Conversation Transcript:
{conversation_json}
"""
    return prompt


