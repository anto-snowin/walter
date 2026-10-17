# Walter AI — Local Setup & Development Guide

This guide covers running Walter AI locally on Windows using PowerShell.

---

## 1. Prerequisites

- **Python 3.12+**
- **Node.js v20+** and **npm**
- **uv** (recommended for ultra-fast Python environment management)

---

## 2. Backend Setup

```powershell
cd d:\walter\backend

# 1. Create Python 3.12 virtual environment & install requirements
uv venv
uv pip install -r requirements.txt

# 2. Run backend test suite
uv run pytest

# 3. Start development server on port 8000
uv run uvicorn app.main:app --reload --port 8000
```

Verify backend health at: `http://localhost:8000/health`

---

## 3. Frontend Setup

```powershell
cd d:\walter\frontend

# 1. Install dependencies
npm install

# 2. Start Next.js development server
npm run dev
```

Open `http://localhost:3000` to interact with Walter.

---

## 4. Testing Without Third-Party Credentials

Walter is engineered with a **zero-cost developer mode**:
1. Open `http://localhost:3000/dashboard/simulator`.
2. Click **Start Simulated Call**.
3. Converse with Walter via typed text or presets.
4. Hang up to view the synthesized summary, urgency score, and extracted action items saved to your local call archive.
