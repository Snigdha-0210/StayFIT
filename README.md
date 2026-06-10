# StayFIT — Predictive Wellness OS 🧠⚡

An intelligent, data-driven wellness and recovery application that predicts your physical readiness using advanced biometrics and an integrated AI coaching matrix. Built for high performers to optimize rest, recovery, and hypertrophy.

![StayFIT UI](https://via.placeholder.com/1200x600?text=StayFIT+Predictive+Wellness+OS)

### 🎥 [Watch the StayFIT Demo Video Here!](https://drive.google.com/file/d/1zNG4hNtANxavU48cag9ndjWZLL-hfee6/view?usp=sharing)
### 📊 [View the Presentation Deck Here!](https://drive.google.com/file/d/1TUkMtQ-pWm3HsadLQm1zZ9KUa8Wmy0ac/view?usp=sharing)

## ✨ Features

- **Neural Sync:** Daily check-ins to capture sleep, energy, stress, and workout intensity.
- **Predictive Forecast:** 1-day, 3-day, and 7-day algorithmic recovery trajectories based on your past biometric trends.
- **AI Neural Assistant:** A fully integrated multi-model LLM coaching matrix (Groq/Llama 3, OpenAI, Gemini) that analyzes your real-time stats and delivers tailored physical and mental recommendations.
- **Gamification & XP:** Earn XP and unlock badges (Recovery Master, Zen Master, Flow State Operator) by maintaining optimal wellness streaks.
- **Secure Architecture:** Robust React frontend with an isolated Express/Node.js backend proxy to completely secure LLM API keys.
- **Real-time Persistence:** Firebase Auth and Firestore integration to sync your metrics history securely across sessions.

## 🚀 Tech Stack

- **Frontend:** React 19, Vite, Tailwind CSS (Glassmorphism UI), Framer Motion, Recharts
- **Backend:** Node.js, Express, CORS
- **Database / Auth:** Firebase (Firestore & Anonymous Auth)
- **Intelligence Matrix:** Groq API (Llama 3.1 8B), OpenAI API (GPT-4o-mini), Gemini API (1.5 Flash)

## 🛠️ Installation & Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/Snigdha-0210/StayFIT.git
   cd StayFIT
   ```

2. **Frontend Setup**
   ```bash
   cd stay_fit_front
   npm install
   ```
   *Create a `.env.local` file based on `.env.example` and add your Firebase credentials.*

3. **Backend Setup (Secure Proxy)**
   ```bash
   cd ../stay_fit_backend
   npm install
   ```
   *Create a `.env` file and add your AI API keys (`GROQ_API_KEY`, `OPENAI_API_KEY`, `GEMINI_API_KEY`).*

4. **Run the Application**
   - Start the Backend: `cd stay_fit_backend && npm run start`
   - Start the Frontend: `cd stay_fit_front && npm run dev`

## 🛡️ License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---
*Built to redefine human optimization.*
