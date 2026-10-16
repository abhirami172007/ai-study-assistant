# 🎓 AI Study Assistant using Agentic AI

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy?repo=https://github.com/abhirami172007/ai-study-assistant)
[![Python 3.10+](https://img.shields.io/badge/python-3.10+-blue.svg)](https://www.python.org/downloads/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.110.0-009688.svg)](https://fastapi.tiangolo.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

An Autonomous Academic Study Assistant Web Application built with Agentic AI, Multi-Model Failover Architecture, Adaptive Quizzing, and OCR Document Processing.

---

## 🌟 Core Features

1. **Autonomous Multi-Model Failover Engine**:
   - High-availability AI pipeline with automatic fallback across Google Gemini models (gemini-2.5-flash ➔ gemini-2.0-flash ➔ gemini-1.5-flash ➔ Academic Fallback Engine).
   - Guarantees 100% uptime with zero downtime during peak usage or quota limits.

2. **Adaptive Quiz & Dynamic Assessment**:
   - Generates interactive, topic-targeted MCQ quizzes with difficulty scaling.
   - Real-time scoring with instant step-by-step explanations and mathematical formulas.

3. **Weak-Topic Diagnosis & Precision Revision Drills**:
   - Automatically tracks student error patterns in SQLite.
   - Generates customized diagnostic revision drills targeting specific weak areas.

4. **Multi-Format Document Ingestion & OCR**:
   - Upload PDF, Word (.docx), PowerPoint (.pptx), and handwritten/printed images (.png, .jpg).
   - Tesseract OCR extracts text from book photos and handwritten study notes with automated AI summarization.

---

## 🚀 Live Cloud Deployment (1-Click)

Click the button below to deploy this project live on Render with 24/7 permanent uptime:

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy?repo=https://github.com/abhirami172007/ai-study-assistant)

---

## 💻 Running Locally

1. **Clone the repository:**
   `ash
   git clone https://github.com/abhirami172007/ai-study-assistant.git
   cd ai-study-assistant
   `

2. **Install dependencies:**
   `ash
   pip install -r requirements.txt
   `

3. **Run the application:**
   `ash
   python run.py
   `
   Or double-click Start AI Study Assistant.bat on Windows.
   The browser will automatically open to http://localhost:8000.

---

## 👤 Demo Login Credentials
- **Student Email:** student@college.edu
- **Password:** student123
- *(Or use the 1-Click Examiner Demo Login on the login screen)*

---

## 👩‍💻 Author
**S Abhirami**  
B.Tech Computer Science & Engineering
