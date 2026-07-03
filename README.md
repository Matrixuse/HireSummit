# 🚀 HireSummit AI

An AI-powered interview preparation platform that helps job seekers prepare smarter by generating personalized interview questions and creating ATS-friendly resumes.

## 📌 Overview

HireSummit AI bridges the gap between job applications and interview preparation.

Simply provide:
- 📄 Your Resume
- 💼 Job Description
- 📝 Self Description

The platform analyzes your profile using AI and generates:

- 🎯 Personalized Technical Interview Questions
- 💬 Behavioral Interview Questions
- 📄 ATS-Optimized Resume
- ⬇️ Downloadable Resume

---

## ✨ Features

### 🤖 AI Interview Question Generator

Generate customized interview questions based on:

- Job Description
- Resume
- Self Introduction

Questions include:

- Technical Questions
- Behavioral Questions
- Role-specific Questions

---

### 📄 ATS-Friendly Resume Generator

Create a professional resume optimized for Applicant Tracking Systems (ATS).

Features include:

- AI-enhanced formatting
- ATS-friendly structure
- Keyword optimization
- Downloadable PDF resume

---

### 🎯 Personalized Preparation

Instead of generic interview questions, HireSummit AI tailors every question according to your:

- Skills
- Experience
- Projects
- Target Role
- Job Description

---

## 🛠 Tech Stack

### Frontend

- React.js
- Vite
- CSS

### Backend

- Node.js
- Express.js

### Database

- MongoDB

### AI

- Google Gemini API (or your AI provider)

### Other Tools

- JWT Authentication
- PDF Generation
- REST APIs

---

## 📷 Workflow

```text
User
 │
 ├── Upload Resume
 ├── Paste Job Description
 └── Write Self Description
          │
          ▼
      AI Processing
          │
 ├── Resume Analysis
 ├── JD Analysis
 ├── Skill Matching
 └── Profile Understanding
          │
          ▼
Generated Output
 ├── Technical Questions
 ├── Behavioral Questions
 └── ATS Resume
```

---

## 🚀 Installation

Clone the repository

```bash
git clone https://github.com/yourusername/hiresummit-ai.git
```

Go to project folder

```bash
cd hiresummit-ai
```

### Backend

```bash
cd Backend
npm install
npm run dev
```

### Frontend

```bash
cd Frontend
npm install
npm run dev
```

---

## ⚙️ Environment Variables

Create a `.env` file inside the Backend directory.

```env
PORT=5000

MONGODB_URI=your_mongodb_connection

JWT_SECRET=your_secret

GEMINI_API_KEY=your_api_key
```

---

## 💡 Future Improvements

- Mock AI Interviews
- Voice-based Interviews
- Interview Scorecard
- Resume Suggestions
- Cover Letter Generator
- Company-specific Interview Questions
- HR Feedback Simulation
- LinkedIn Profile Analyzer

---

## 📸 Screenshots

Add screenshots here.

```
Home Page

Interview Questions

ATS Resume

Dashboard
```

---

## 🤝 Contributing

Contributions are welcome!

1. Fork the repository

2. Create a new branch

```bash
git checkout -b feature-name
```

3. Commit your changes

```bash
git commit -m "Added new feature"
```

4. Push to GitHub

```bash
git push origin feature-name
```

5. Open a Pull Request

---

## ⭐ Support

If you found this project helpful, please consider giving it a ⭐ on GitHub.

---

## 📜 License

This project is licensed under the MIT License.
