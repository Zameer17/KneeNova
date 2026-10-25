# KneeNova - AI-Powered Knee MRI Abnormality Detection

KneeNova is a medical imaging web platform that combines a **React (Vite)** frontend DICOM viewer with a **FastAPI + PyTorch** deep learning backend. It automatically detects and classifies multi-label knee abnormalities (ACL, MCL, Meniscus tears, Osteoarthritis, Effusion, Fractures, and more) directly from MRI study volumes.

---

## 🚀 Live Deployment Guide

The project is structured to be deployed across two complementary platforms:
- **Backend API**: Hosted on [Render](https://render.com) (Python + PyTorch API)
- **Frontend App**: Hosted on [Netlify](https://netlify.com) (Vite React SPA)

---

### Part 1: Deploy Backend to Render

1. Log into [Render](https://dashboard.render.com).
2. Click **New +** → **Web Service**.
3. Connect your GitHub repository: `https://github.com/Zameer17/KneeNova.git`.
4. Configure the Web Service settings:
   - **Name**: `kneenova-backend`
   - **Region**: Oregon or closest to you
   - **Root Directory**: `backend`
   - **Runtime**: `Python 3`
   - **Build Command**:
     ```bash
     pip install --no-cache-dir torch torchvision --index-url https://download.pytorch.org/whl/cpu && pip install --no-cache-dir -r requirements.txt
     ```
   - **Start Command**:
     ```bash
     uvicorn app:app --host 0.0.0.0 --port $PORT
     ```
   - **Instance Type**: Free or Starter
5. Under **Advanced** → **Environment Variables**:
   - `PYTHON_VERSION`: `3.11.9`
6. Click **Deploy Web Service**.
7. Once deployed, copy your Render service URL (e.g. `https://kneenova-backend.onrender.com`).

> *Note: Alternatively, you can use Render's **Blueprints** by selecting the included `render.yaml` file.*

---

### Part 2: Deploy Frontend to Netlify

1. Log into [Netlify](https://app.netlify.com).
2. Click **Add new site** → **Import an existing project**.
3. Select **GitHub** and authorize your `KneeNova` repository.
4. Netlify will auto-detect the configuration from `netlify.toml`:
   - **Base directory**: *(Leave blank - root)*
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
5. Click **Add environment variables**:
   - **Key**: `VITE_API_BASE_URL`
   - **Value**: `https://your-backend-name.onrender.com` *(Paste your Render URL from Part 1)*
6. Click **Deploy KneeNova**.

Your live frontend will now be online with global CDN caching and automatic HTTPS!

---

## 💻 Local Development

### 1. Backend (FastAPI)
```powershell
cd backend
python -m venv .venv
.\.venv\Scripts\activate
pip install -r requirements.txt
uvicorn app:app --host 127.0.0.1 --port 8000 --reload
```
API Documentation will be live at: `http://127.0.0.1:8000/docs`

### 2. Frontend (React + Vite)
```powershell
npm install
npm run dev
```
Application will be live at: `http://localhost:5173`
