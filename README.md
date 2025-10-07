# 🧠 ResumeTailor – AI Resume & Cover Letter Tailoring App

> **An intelligent web app that analyzes your resume and job posting to generate a custom fit analysis, personalized cover letter, and resume optimization plan — all powered by OpenAI GPT-4o.**

---

## 🚀 Overview

**ResumeTailor** streamlines the job application process by using AI to tailor resumes and cover letters for specific roles.  
Simply upload your resume (PDF or text), paste the job posting, and let the system generate:

- 🧠 Job Analysis  
- 📝 Tailored Cover Letter  
- 📄 Resume Improvement Plan  
- 🧾 Additional Qualifications

All in one clean, responsive web app.

---

## 🧩 Tech Stack

| Layer | Technology | Purpose |
|-------|-------------|----------|
| **Frontend** | React (TypeScript, Vite) | Responsive user interface |
| **Styling** | TailwindCSS + Shadcn UI | Modern UI components and theming |
| **Markdown Rendering** | `react-markdown`, `remark-gfm`, `rehype-raw` | Formats AI responses beautifully |
| **PDF Export** | `jspdf` | Download text-based, selectable PDFs |
| **HTTP Client** | `axios` | Secure communication with backend |
| **Backend** | Spring Boot 3.3.4 (Java 21) | REST API for AI integration |
| **AI API** | OpenAI GPT-4o-mini | Generates tailored content |
| **File Parser** | Apache Tika | Extracts text from uploaded PDFs |
| **Build Tool** | Maven | Java dependency management |
| **Runtime** | Node.js (Frontend), Corretto JDK 21 (Backend) | Execution environments |

---

## 🧠 Architecture Overview
[ React Frontend (Vite + TypeScript) ]

▼

[ Spring Boot Backend ]

├── TailorController.java

├── ChatGptService.java

├── PdfExtractorService.java

├── GlobalExceptionHandler.java

└── WebClientConfig.java

▼

[ OpenAI GPT-4o API ]


---

## 🎨 Frontend Features

| Feature | Description |
|----------|--------------|
| 📤 **Resume Upload** | Upload PDF or paste text directly |
| 💼 **Job Description Input** | Paste the entire job posting |
| 🌀 **Loading Spinner** | Animated indicator during processing |
| 📋 **Copy Buttons** | Copy content from each output tab |
| 💾 **LocalStorage Persistence** | Keeps input data after page reload |
| 📄 **PDF Export (text-based)** | Download AI-generated content as selectable PDFs |
| 🧠 **Smart Formatting** | Automatically bolds ALL-CAPS headings (SKILLS, EXPERIENCE, etc.) |
| 📱 **Responsive Design** | Dual-card layout that adapts to all screens |
| 🌈 **Azure Radiance Theme** | Elegant dark theme built with Tailwind variables |

---

## 🧩 Backend Features

| Component | Role |
|------------|------|
| **TailorController** | Handles `/api/tailor/text` and `/api/tailor/file` endpoints |
| **ChatGptService** | Validates inputs, builds prompts, calls OpenAI, and parses responses |
| **PdfExtractorService** | Converts uploaded PDFs to raw text using Apache Tika |
| **WebClientConfig** | Optimized WebClient with timeouts, retries, and keep-alive |
| **GlobalExceptionHandler** | Returns clean JSON messages for all errors |
| **Retry Logic** | Auto-retries transient OpenAI network errors |
| **Input Validation** | Limits text to 8000 characters per field |

---

## 🧾 Output Tabs

| Tab | Content |
|-----|----------|
| 🧠 **Job Analysis** | Extracted skills and role expectations |
| 📝 **Cover Letter** | Personalized, ready-to-use letter |
| 📄 **Resume Tailoring** | Key adjustments to match job posting |
| 🧾 **Additional Qualifications** | Suggestions to boost competitiveness |

---

## 💡 Error Handling & Stability

| Scenario | Status | Response Example |
|-----------|---------|------------------|
| Network timeout / OpenAI down | 503 | `{ "error": "AI service temporarily unavailable. Please retry." }` |
| Invalid input | 400 | `{ "error": "Invalid input: Resume text cannot be empty." }` |
| File too large | 413 | `{ "error": "File too large. Maximum allowed size is 10 MB." }` |
| General server error | 500 | `{ "error": "Server error occurred. Please try again later." }` |

---

## ⚙️ Developer Setup

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/yourusername/ResumeTailor.git
cd ResumeTailor
```````
2️⃣ Frontend Setup
```bash
cd ResumeTailorFrontend
npm install
npm run dev
```````
3️⃣ Backend Setup
```bash
cd ResumeTailorBackend
mvn spring-boot:run
```````
4️⃣ Environment Variables
```bash
openai:
  api:
    key: YOUR_OPENAI_API_KEY
  model: gpt-4o-mini
```````
🧭 System Flow
  - User uploads resume (PDF/text) and pastes job description
  - Frontend sends a multipart request → /api/tailor/file or /api/tailor/text
  - Backend builds AI prompt and calls OpenAI GPT-4o-mini
  - Response parsed into 4 structured sections
  - Frontend displays formatted Markdown with Copy + PDF export options

🌟 UX Enhancements
  - ✅ Azure Radiance Dark Theme
  - ✅ Smooth animations + hover effects
  - ✅ Scrollable cards with consistent height
  - ✅ Tooltip hints for icons
  - ✅ Markdown formatting for clean readability
  - ✅ Persistent state between reloads
  - ✅ Clean JSON error feedback

🧰 Dev Tools Used
  - IntelliJ IDEA Ultimate – Spring Boot dev
  - VS Code / WebStorm – React + Tailwind dev
  - Postman / Opan Api Swagger – API testing
  - Maven + npm – Build automation
  - Vite – Lightning-fast frontend dev server

🏁 Project Status
  - ✅ Backend complete
  - ✅ Frontend complete
  - ✅ Full integration verified
  - ✅ Optional enhancements implemented
  - ✅ End-to-end stable build

🧑‍💻 Author: Anas Sadek
> **Computer Programming Student – Algonquin College, Canada
> Developer • Designer • Problem Solver
> 📸 Interests: software engineering, data systems, AI applications, creative design, and astrophotography.**




📜 License
  - This project is open-source and available under the MIT License.
