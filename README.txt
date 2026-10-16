================================================================================
                    AI STUDY ASSISTANT USING AGENTIC AI
================================================================================
A Complete Autonomous Academic Study Assistant Web Application
Built for College Project Submission, Research Demos & Online Multi-User Sharing

--------------------------------------------------------------------------------
1. QUICK START (NO TERMINAL OR COMPLEX CONFIGURATION REQUIRED!)
--------------------------------------------------------------------------------
To start the application locally:
  1. Simply double-click:
     "AI Study Assistant.exe"
     (Or double-click "Start AI Study Assistant.bat")

  2. The application will automatically:
     - Verify Python and dependencies
     - Launch the local FastAPI backend server in the background
     - Automatically open your default web browser to:
       http://localhost:8000

--------------------------------------------------------------------------------
2. SHARING WITH FRIENDS & REMOTE ACCESS
--------------------------------------------------------------------------------
Option A (Offline / Standalone Distribution):
  Send this entire project folder or ZIP archive to your friend.
  They only need to extract it and double-click "Start AI Study Assistant.bat"
  or "AI Study Assistant.exe". All dependencies will be set up automatically!

Option B (Instant Remote Web Access):
  When running on your computer, your project is accessible live worldwide
  via the public Cloudflare tunnel link without needing to install anything!

--------------------------------------------------------------------------------
3. DEMO LOGIN CREDENTIALS
--------------------------------------------------------------------------------
A pre-seeded student account is already created for instant testing:
  - Email:    student@college.edu
  - Password: student123
  - Student:  Abhirami (B.Tech Computer Science)

On the login page, you can also click:
  "1-Click Examiner Demo Login (Abhirami)"
to automatically fill credentials and log in instantly!

You can also register any new student account using the Registration page.

--------------------------------------------------------------------------------
4. KEY FEATURES DEMONSTRATING AGENTIC AI
--------------------------------------------------------------------------------
The project demonstrates the complete Agentic AI loop:
  Student Goal -> Understand -> Plan -> Act -> Evaluate -> Remedial Action

1. Universal Multi-Subject AI Tutor:
   Supports STEM, Medical, Law, Commerce, Humanities, and Competitive Exams
   (JEE, NEET, UPSC, GRE, SAT) across 12+ languages with step-by-step clarity.

2. Adaptive Remedial Quiz Generator:
   Generates multiple-choice tests dynamically. The AI detects mistakes and
   automatically creates targeted remedial quizzes for weak topics.

3. Milestone Study Planner:
   Input your exam date and syllabus topics. The agent computes your pacing
   and creates a daily milestone roadmap with progress tracking.

4. Study Materials (Document OCR & Notes Hub):
   Upload PDF, TXT, DOCX, PPTX, or textbook photos (Tesseract OCR). Instantly
   generate Summaries, Exam Topics, and grounded quizzes.

5. Progress & Analytics Dashboard:
   Weekly study activity graph, subject mastery progress bars, and weak topic detection.

6. Achievements & Badges:
   Automatically unlocks 8 badges based on quiz performance and study streaks.

--------------------------------------------------------------------------------
5. PROJECT DIRECTORY STRUCTURE
--------------------------------------------------------------------------------
AI Study Assistant/
|-- AI Study Assistant.exe       <- Native Windows one-click launcher
|-- Start AI Study Assistant.bat <- Automated batch launcher
|-- README.txt                   <- Project guide & presentation overview
|-- requirements.txt             <- Python dependencies list
|-- backend/                     <- FastAPI Backend Services
|   |-- main.py                  <- REST API endpoints & static server
|   |-- database.py              <- SQLite schema, seeds & helper queries
|   |-- ai_service.py            <- Gemini integration & Agentic loop
|   |-- document_parser.py       <- Universal PDF, DOCX, PPTX, OCR parser
|   `-- models.py                <- Pydantic validation schemas
|-- frontend/                    <- Clean, modern, responsive UI
|   |-- index.html               <- Modern landing page (Universal v2.5)
|   |-- login.html               <- Student authentication & 1-click demo login
|   |-- register.html            <- Account registration
|   |-- dashboard.html           <- Dynamic metrics, agentic workflow & recs
|   |-- ai-tutor.html            <- Multi-subject universal academic tutor
|   |-- study-planner.html       <- Daily milestone schedule & countdown
|   |-- ai-quiz.html             <- AI MCQ generator & adaptive remediation
|   |-- study-materials.html     <- Upload dropzone, OCR & document RAG
|   |-- progress.html            <- Analytics, weekly chart & weak topic tree
|   |-- achievements.html        <- Automated badges showcase
|   |-- settings.html            <- Profile & Gemini API key management
|   |-- style.css                <- Modern responsive design system
|   |-- css/                     <- Module stylesheets
|   `-- js/                      <- Module controllers & dynamic API client
|-- database/                    <- Persistent SQLite database
|   `-- study_assistant.db
`-- uploads/                     <- Storage for uploaded course notes

--------------------------------------------------------------------------------
6. TECHNICAL STACK
--------------------------------------------------------------------------------
- Frontend: HTML5, Vanilla CSS3 (glassmorphic modern theme), JavaScript (ES6)
- Backend: Python 3.10+, FastAPI, Uvicorn
- Database: SQLite (Persistent tables with relational schema)
- AI Model: Google Gemini API (2.5 Flash / 2.0 Flash / 1.5 Flash)
- Document Processing: PyPDF, PDFPlumber, Python-DOCX, Python-PPTX, Tesseract OCR
================================================================================
