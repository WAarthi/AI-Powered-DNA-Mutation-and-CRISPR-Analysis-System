# 🧬 AI-Powered DNA Mutation & CRISPR Analysis System

A web-based intelligent genomics platform designed to analyze DNA sequences, detect potential mutations, and identify CRISPR-Cas9 target sites with risk scoring.  
This project combines Artificial Intelligence, Bioinformatics, and Molecular Biology to support researchers, clinicians, and genomics students.

---

## 🌐 Live Website  
My application is deployed here:

👉 **https://deploy-project--wagmareaarthi.replit.app**

You can upload DNA sequences (FASTA/TXT), run mutation detection, view CRISPR target predictions, and download a report.

---

## 🚀 Features

### 🔬 **1. DNA Mutation Detection**
- Upload **FASTA or TXT** DNA files  
- Paste DNA sequences directly  
- AI-powered sequence classification  
- “Normal” vs “Mutated” prediction  
- Mutation probability score  
- Attention-based nucleotide importance (heatmap visualization)

---

### 🧬 **2. CRISPR Target Site Prediction**
- Automatic detection of PAM (NGG) sites  
- Generates gRNA sequences  
- Computes off-target risk score  
- GC content calculation  
- Tags each site as **Low**, **Medium**, or **High Risk**  
- Results displayed in a clean table format

---

### 🩺 **3. Dual Report Mode**
- **Doctor View:** Technical explanations, attention maps, genomic reasoning  
- **Simple View:** Easy-to-understand explanations for general users  

---

### 📄 **4. PDF Report Generator**
Download a complete DNA health report including:
- Mutation analysis  
- CRISPR target summary  
- Risk distribution  
- Interpretation notes  
- Date, sequence ID, GC%, and quality indicators  

---

### 🎨 **5. Modern Web Interface**
- Clean layout  
- Dark mode / Light mode  
- File upload system  
- Real-time results  
- Professional UI suitable for academics and clinics  

---

## 🧠 Tech Stack

| Component | Technology |
|----------|------------|
| Frontend | HTML, CSS |
| Backend | Flask (Python) |
| AI Model | LSTM + Attention (TensorFlow/Keras) *(optional in fallback)* |
| DNA Parsing | Biopython, Regular Expressions |
| CRISPR Logic | Pattern Matching + GC/Risk Heuristics |
| Visualization | Heatmaps, Tables, Dynamic UI |
| Hosting | Replit |

---

## 📁 Folder Structure



AI-Powered-DNA-Mutation-and-CRISPR-Analysis-System/
│
├── app.py # Main Flask backend
├── requirements.txt # Python dependencies
├── models/ # (Optional) ML models
├── templates/ # HTML templates
├── static/ # CSS files, JS, assets
├── datasets/ # Example DNA samples
└── README.md # Project documentation


---

## 🧪 Sample DNA Input (FASTA)



Example_DNA_Sequence
ATGCGTACGTTAGCTAGCTACGATCGTACGCTTAGCCTAGGCTAACGTAGCTAGCTAGTACGATCGATGCTAGCTAGCGTACGTAGCTAGCTTACGATCGATGCTAGCTAGCTGATCGTACGCTAGCTAACGTAGCTAGCTAGCTGATCGATCGTACGCTAGCTA


---

## ▶️ Run Locally (Optional)

### 1️⃣ Clone repo  


git clone https://github.com/WAarthi/AI-Powered-DNA-Mutation-and-CRISPR-Analysis-System

cd AI-Powered-DNA-Mutation-and-CRISPR-Analysis-System


### 2️⃣ Install dependencies  


pip install -r requirements.txt


### 3️⃣ Run Flask app  


python app.py


App will start at:


http://localhost:5000


---

## ☁️ Deploy on Replit (Current Deployment)

My app is deployed using Replit’s hosting system.

Steps if redeploying:

1. Go to https://replit.com  
2. Create a new Repl  
3. Import from GitHub  
4. Click **Run**  
5. Your live link updates automatically

---

## ⚠️ Disclaimer
This tool is for **research and educational purposes only**.  
It is **NOT** intended for clinical diagnostics, medical decision-making, or genetic counseling.

---

## 👩‍💻 Developer  
**Aarthi Wagmare**  
B.Tech CSE  
AI & Bioinformatics Enthusiast  

If you find this project helpful, please ⭐ star the repository!
