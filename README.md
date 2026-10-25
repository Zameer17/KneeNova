<div align="center">

<!-- 🏥 ANIMATED HEADER -->
<img src="https://capsule-render.vercel.app/api?type=waving&color=0:091428,25:1769aa,50:0284c7,75:14b8a6,100:10b981&height=220&section=header&text=🏥%20KneeNova%20Medical%20AI&fontSize=38&fontColor=ffffff&fontAlignY=38&desc=AI-Powered%20Knee%20MRI%20Abnormality%20Detection%20%26%20Interactive%20DICOM%20Workspace&descAlignY=58&descSize=15&animation=fadeIn" />

<br/>

<!-- TYPING ANIMATION -->
[![Typing SVG](https://readme-typing-svg.demolab.com?font=Fira+Code&weight=600&size=20&pause=1000&color=14B8A6&center=true&vCenter=true&width=780&lines=🏥+Automated+Knee+MRI+Abnormality+Detection;⚡+12+Pathology+Multi-Label+Deep+Learning+Inference;🔬+Interactive+Web-Based+DICOM+Volume+Visualizer;📑+Instant+Structured+Diagnostic+Clinical+Reports;🛡️+Secure+Practitioner+Workspace+%7C+Netlify+%2B+Render+Ready!)](https://git.io/typing-svg)

<br/>

<!-- BADGES -->
![PyTorch](https://img.shields.io/badge/PyTorch-EE4C2C?style=for-the-badge&logo=pytorch&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white)
![React 19](https://img.shields.io/badge/React%2019-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Python](https://img.shields.io/badge/Python%203.11+-3776AB?style=for-the-badge&logo=python&logoColor=white)
![DICOM](https://img.shields.io/badge/DICOM-Medical%20Imaging-0284c7?style=for-the-badge&logo=hospital&logoColor=white)
![Netlify](https://img.shields.io/badge/Netlify-00C7B7?style=for-the-badge&logo=netlify&logoColor=white)
![Render](https://img.shields.io/badge/Render-46E3B7?style=for-the-badge&logo=render&logoColor=black)

<br/>

![Status](https://img.shields.io/badge/Status-Live%20%26%20Production%20Ready-10b981?style=flat-square)
![Type](https://img.shields.io/badge/Type-Clinical%20AI%20Platform-0284c7?style=flat-square&labelColor=091428)
![Model](https://img.shields.io/badge/Model-EfficientNet--B0%20(timm)-14b8a6?style=flat-square&labelColor=091428)
[![GitHub Repo](https://img.shields.io/badge/GitHub-Repository-181717?style=flat-square&logo=github)](https://github.com/Zameer17/KneeNova)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Zameer%20Shaikh-0077B5?style=flat-square&logo=linkedin)](https://www.linkedin.com/in/zameer-shaikh-1a9482345)

</div>

---

<img src="https://user-images.githubusercontent.com/73097560/115834477-dbab4500-a447-11eb-908a-139a6edaec5c.gif">

## 🏥 What is KneeNova?

> **KneeNova** is an end-to-end, medical-grade diagnostic workspace designed for radiologists, orthopedic surgeons, sports clinicians, and medical researchers. It pairs a **high-performance web-based DICOM volume viewer** with a **specialized multi-slice PyTorch deep learning model** (`EfficientNet-B0`), detecting and scoring **12 distinct knee joint pathologies** simultaneously from raw MRI series.

```python
# KneeNova End-to-End Diagnostic Pipeline
raw_dicom_zip
  → 📦 series_extraction      # parse DICOM metadata, validate modalities
  → 🔍 volume_sampling        # extract 8 representative slices per series
  → ⚙️  image_preprocessing    # CLAHE, intensity norm, resize to [1, 8, 3, 224, 224]
  → 🧠 deep_learning_model    # KneeNovaFinal (timm EfficientNet-B0 feature extractor)
  → 📊 multi_label_scoring    # Sigmoid calibrated probability scores across 12 pathologies
  → 📑 structured_report      # Printable & exportable clinical consultation summary ✅
```

<img src="https://user-images.githubusercontent.com/73097560/115834477-dbab4500-a447-11eb-908a-139a6edaec5c.gif">

---

## 🎯 12 Detectable Pathologies

KneeNova classifies abnormalities across five critical knee joint compartments:

<div align="center">

| 🏷️ Compartment | 🩺 Abnormality / Condition | 🔍 Clinical Significance |
|:---|:---|:---|
| **Ligament Tears** | ⚡ **ACL Tear** | Complete or partial Anterior Cruciate Ligament disruption |
| | ⚡ **MCL Tear** | Medial Collateral Ligament sprain, laxity, or tear |
| **Meniscal Tears** | 🩺 **Medial Meniscus** | Radial, horizontal, or complex posterior horn tear |
| | 🩺 **Lateral Meniscus** | Lateral cartilage fissure, flap, or tear |
| **Osteoarthritis** | 🦵 **Medial OA** | Joint space narrowing & osteophytes in medial compartment |
| | 🦵 **Lateral OA** | Cartilage wear & degeneration in lateral compartment |
| | 🦵 **Patellofemoral OA** | Subchondral sclerosis & trochlear cartilage loss |
| **Fluid Collections** | 💧 **Joint Effusion** | Excessive synovial fluid collection within capsule |
| | 💧 **Synovitis** | Inflammatory hypertrophy of the synovial membrane |
| | 💧 **Baker's Cyst** | Popliteal synovial fluid distension behind joint |
| **Bone Trauma** | 💥 **Bone Contusion** | Subchondral trabecular microfracture / bone marrow edema |
| | 💥 **Fracture** | Cortical disruption or occult osteochondral fracture |

</div>

<img src="https://user-images.githubusercontent.com/73097560/115834477-dbab4500-a447-11eb-908a-139a6edaec5c.gif">

---

## ✨ Key Platform Features

<div align="center">

| 🚀 Feature | 💡 Capabilities & Highlights |
|:---|:---|
| **🔬 Interactive DICOM Viewer** | In-browser slice scroll, window/level contrast adjustment, zoom & pan, multi-series switcher without external desktop software. |
| **🧠 Deep Learning Engine** | Multi-slice 3D spatial pooling on `EfficientNet-B0`, outputting calibrated percentage confidence scores. |
| **🔐 Secure Practitioner Portal** | PBKDF2-SHA256 password hashing, SQLite session management, role selection, and instant 1-click Demo Mode. |
| **📑 Comprehensive Reports** | Exportable diagnostic summaries formatted for orthopedic consultation, patient referral, and EHR archives. |
| **☁️ Production-Grade Cloud** | Netlify SPA frontend configuration (`netlify.toml`) + Render Python API container specification (`render.yaml`). |

</div>

<img src="https://user-images.githubusercontent.com/73097560/115834477-dbab4500-a447-11eb-908a-139a6edaec5c.gif">

---

## 📁 Repository Structure

```
KneeNova/
│
├── 📁 backend/                        ← FastAPI + PyTorch Backend Service
│     ├── 📁 models/                   ← Pre-trained model weights (kneenova_final_best.pth)
│     ├── 📄 app.py                    ← FastAPI endpoints, DICOM pipeline, inference routes
│     ├── 📄 auth.py                   ← User registration, PBKDF2 auth & session tokens
│     └── 📄 requirements.txt          ← Python dependencies (FastAPI, PyTorch, timm, etc.)
│
├── 📁 src/                            ← React 19 + Vite Frontend SPA
│     ├── 📁 components/               ← Navbar, Footer, Buttons, Splash branding
│     ├── 📁 pages/                    ← Login, Signup, Home, Upload, MRIViewer, Results, Reports
│     ├── 📁 services/                 ← api.js (Dynamic API client, timeout handling & auth storage)
│     └── 📁 styles/                   ← Responsive medical UI themes & styling
│
├── 📁 public/                         ← Static assets, icons, logos & _redirects
├── 📄 netlify.toml                    ← Netlify SPA build configuration
├── 📄 render.yaml                     ← Render Web Service blueprint configuration
├── 📄 package.json                    ← Frontend dependencies & scripts
└── 📄 README.md                       ← Interactive Project Documentation
```

<img src="https://user-images.githubusercontent.com/73097560/115834477-dbab4500-a447-11eb-908a-139a6edaec5c.gif">

---

## 🛠️ Technology Stack

<p align="center">
  <img src="https://img.shields.io/badge/PyTorch-EE4C2C?style=for-the-badge&logo=pytorch&logoColor=white" />
  <img src="https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white" />
  <img src="https://img.shields.io/badge/React%2019-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" />
  <img src="https://img.shields.io/badge/Vite%208-646CFF?style=for-the-badge&logo=vite&logoColor=white" />
  <img src="https://img.shields.io/badge/Timm-EfficientNet-0284c7?style=for-the-badge&logo=python&logoColor=white" />
  <img src="https://img.shields.io/badge/OpenCV-Headless-5C3EE8?style=for-the-badge&logo=opencv&logoColor=white" />
  <img src="https://img.shields.io/badge/Pydicom-Medical%20IO-14b8a6?style=for-the-badge&logo=python&logoColor=white" />
  <img src="https://img.shields.io/badge/SQLite-Local%20DB-003B57?style=for-the-badge&logo=sqlite&logoColor=white" />
  <img src="https://img.shields.io/badge/Framer%20Motion-Animations-0055FF?style=for-the-badge&logo=framer&logoColor=white" />
  <img src="https://img.shields.io/badge/Lucide%20Icons-Medical%20UI-F56565?style=for-the-badge&logo=lucide&logoColor=white" />
</p>

<img src="https://user-images.githubusercontent.com/73097560/115834477-dbab4500-a447-11eb-908a-139a6edaec5c.gif">

---

## 🚀 Live Deployment Guide

KneeNova is engineered for zero-config multi-cloud deployment:

### 1️⃣ Deploy Backend on [Render](https://render.com)
1. In the **Render Dashboard**, select **New +** → **Web Service**.
2. Connect `https://github.com/Zameer17/KneeNova.git`.
3. Configure the service:
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
4. Add Environment Variable: `PYTHON_VERSION` = `3.11.9`.
5. Copy your live backend URL (e.g. `https://kneenova-backend.onrender.com`).

---

### 2️⃣ Deploy Frontend on [Netlify](https://netlify.com)
1. In **Netlify**, click **Add new site** → **Import an existing project** → Pick `KneeNova`.
2. Netlify auto-reads `netlify.toml` (Build: `npm run build`, Publish: `dist`).
3. Add Environment Variable:
   - **Key**: `VITE_API_BASE_URL`
   - **Value**: `https://your-backend-name.onrender.com` *(from Render step above)*
4. Click **Deploy KneeNova** — your medical portal is live with free SSL & global CDN!

<img src="https://user-images.githubusercontent.com/73097560/115834477-dbab4500-a447-11eb-908a-139a6edaec5c.gif">

---

## 💻 Local Setup & Development

### 1. Backend (FastAPI API)
```powershell
cd backend
python -m venv .venv
.\.venv\Scripts\activate
pip install -r requirements.txt
uvicorn app:app --host 127.0.0.1 --port 8000 --reload
```
* **API Documentation**: [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)

### 2. Frontend (React 19 + Vite)
```powershell
npm install
npm run dev
```
* **Web Application**: [http://localhost:5173](http://localhost:5173)

---

## 🌐 Connect with Me

<div align="center">

[![LinkedIn](https://img.shields.io/badge/LinkedIn-Zameer%20Shaikh-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/zameer-shaikh-1a9482345)
[![GitHub](https://img.shields.io/badge/GitHub-Zameer17-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/Zameer17)

<br/>

> *"Precision medicine begins where human expertise meets computational intelligence."* 🔬⚡

<br/>

<img src="https://capsule-render.vercel.app/api?type=waving&color=0:10b981,25:14b8a6,50:0284c7,75:1769aa,100:091428&height=120&section=footer&animation=fadeIn" />

</div>
