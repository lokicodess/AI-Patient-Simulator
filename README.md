# 🧠 AI Patient Simulator – Full Stack Application

This project is a full-stack **AI Mental Health Simulation Platform**.  
It allows **medical students** to interact with a simulated patient through **audio and text**, using an LLM (Gemini), Whisper for audio-to-text, and React.js as the frontend.

---

## 📁 Project Structure

```
/backend     - FastAPI-based backend with Whisper, Gemini
/frontend    - React.js-based frontend with WebSocket
```

---

## 🚀 Features

- 🎤 Audio recording and transcription using react-speech-recognition
- 🧠 AI responses using Gemini (Google Generative AI)
- 🔊 react-text-to-speech playback (male/female voices)
- 🔁 Real-time WebSocket communication
- 📄 Patient context and sentiment-aware evaluation
- 📊 Report generation with visual charts
- 📄 Conversation summarization

---

## 🧪 Tech Stack

### 🛠 Backend – FastAPI (Python 3.10.12)

**Main Libraries:**

- `fastapi`, `uvicorn`, `pydantic` – API setup
- `openai-whisper`, `torch`, `pydub`, `ffmpeg-python` – Audio processing
- `google-generativeai` – GenAI 
- `python-dotenv`, `websockets`, `passlib` – Env, sockets

### 💻 Frontend – React.js (React 19 + Bootstrap 5)

**Main Libraries:**

- `react`, `react-dom`, `react-use-websocket` – Core + WebSocket
- `axios` – API communication
- `react-speech-recognition`, `react-text-to-speech` – STT + TTS
- `bootstrap` – UI styling

---

## ⚙️ Backend Setup (Python)

### ✅ Prerequisites

- Python 3.10.12 installed
- `ffmpeg` installed on system and accessible via PATH
- `uv` or `pip` for package management

### 🔧 Installation

```bash
cd backend
python uv
source venv/bin/activate  # Windows: venv\Scripts\activate
uv pip install -r pyproject.toml
```

If you're using `.env`:

```
GOOGLE_API_KEY=your_gemini_api_key
```

### ▶️ Run the Server

```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

---

## ⚙️ Frontend Setup (React)

### ✅ Prerequisites

- Node.js (v18+ recommended)
- `npm` or `yarn`

### 🔧 Installation

```bash
cd frontend
npm install
```

### ▶️ Run the App

```bash
npm start
```

Frontend runs at: `http://localhost:3000`  
Backend runs at: `http://localhost:8000`

---

## 🔄 WebSocket Integration

- Frontend connects to FastAPI backend at `/ws`
- Enables real-time streaming of AI responses

---

## 📁 Folder Structure Highlights

### Backend

```
/backend
    ├── app
        ├── data
        ├── models/
        ├── routers/
        ├── schemas/
        ├── main.py
    ├── .env
    ├── .python-version
    ├── pyproject.toml
    ├── README.md
```

### Frontend

```
/frontend
  ├── src/
  │   ├── components/
  │   ├── context/
  │   ├── hooks/
  │   ├── css/
  │   ├── hooks/
  │   ├── App.css
  │   ├── App.js
  │   ├── App.test.js
  │   ├── Config.js
  │   ├── index.css
  │   ├── index.js
  │   ├── logo.svg
  │   ├── reportWebVitals.js
  │   └── setupTests.js
  ├── public/
  ├── package.json
  ├── README.md
  └── .env
```

---

## 📄 Example `.env` Files

### Backend `.env`

```
GOOGLE_API_KEY=your_api_key
PINECONE_API_KEY=your_api_key
PINECONE_ENVIRONMENT=us-west1-gcp
```

### Frontend `.env`

```
REACT_APP_API_BASE_URL=http://localhost:8000
```

---

## 📤 Future Add-ons

- 🔐 User login and admin dashboard
- 📦 Export reports as PDF
- 📊 Live charts with Chart.js or Recharts
- 💾 Cloud storage for video/audio data

---

     
