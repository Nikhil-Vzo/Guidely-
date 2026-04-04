<div align="center">
  <img src="https://raw.githubusercontent.com/Nikhil-Vzo/Guidely-/main/public/logo.png" alt="Guidely Logo" width="120" />
  <h1>Guidely</h1>
  <p><strong>AI-powered career guidance for every Indian student, even offline.</strong></p>
  <p>Clear, structured guidance for Class 10–12 students and parents — aptitude quiz, visual career maps, college directory, smart timeline, and scholarships. Built for India, works without internet.</p>
</div>

<br/>

<div align="center">
  <img src="https://img.shields.io/badge/Built_at-SIH_2025-orange?style=for-the-badge" alt="SIH 2025" />
  <img src="https://img.shields.io/badge/React_18-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
  <img src="https://img.shields.io/badge/Redux_Toolkit-764ABC?style=for-the-badge&logo=redux&logoColor=white" alt="Redux" />
  <img src="https://img.shields.io/badge/PWA-5A0FC8?style=for-the-badge&logo=pwa&logoColor=white" alt="PWA" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind" />
  <img src="https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white" alt="Supabase" />
</div>

---

**📄 [View Full Project Idea & Explanation Presentation (Guidely.pdf)](./Guidely.pdf)**

## 🎯 What Problem Does Guidely Solve?

Indian students finishing Class 10 face one of the most consequential decisions of their lives — choosing a stream — with almost no structured guidance. Parents are often equally confused. Career counsellors are scarce, expensive, or unavailable in rural and semi-urban areas.

Worse: most existing resources assume stable internet. For a student in rural Chhattisgarh on 2G, a career guidance app that fails offline is as useless as no app at all.

**Guidely solves this by being:**
- 📲 **Installable** — add to home screen like a native app (PWA)
- ✈️ **Offline-first** — quiz questions, career maps, and resources load from local cache the moment the phone goes offline
- 🧠 **Intelligent** — the aptitude quiz scores your personality across 4 streams using a weighted Likert scale and generates a personalized career report
- 🇮🇳 **India-first** — every career, exam, college, and scholarship is relevant to the Indian education system (CBSE, CGPSC, JEE, NEET, UPSC, etc.)

---

## ✨ Features

| Feature | Description |
|---|---|
| 🎓 **Aptitude Quiz** | 15-question weighted Likert scale quiz scoring you across Science, Commerce, Arts & Vocational. Saves results to Redux + IndexedDB + Supabase. |
| 🗺️ **Career Maps** | Visually rich glassmorphic bento-box explorer — switch streams to see degrees, careers + salary ranges, govt exam targets, entrepreneurship ideas. |
| 🏫 **College Directory** | 30+ top colleges across Chhattisgarh and India with interactive Leaflet maps. |
| ⏳ **Timeline** | Admin-managed exam & admission deadlines fetched from Supabase, cached offline. |
| 📚 **Resources & Scholarships** | Curated directory of NCERT, NSP, DIKSHA, Skill India, Khan Academy, and more. |
| 🔐 **Auth + Profiles** | Supabase auth with persistent sessions, avatar uploads, and email confirmation flow. |
| ✈️ **Offline Mode** | Service Worker (Workbox) pre-caches app shell. IndexedDB stores quiz questions + results. Works fully offline after first visit. |
| 📲 **PWA Installable** | Manifest + prompt for "Add to Home Screen" on Android/iOS. Orange offline banner appears when disconnected. |
| 🔴 **Redux Global State** | Redux Toolkit manages quiz state, user auth, and online/offline status across the entire app. |

---

## 🛠️ Tech Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 18, TypeScript, Vite |
| **State Management** | Redux Toolkit, React-Redux |
| **Styling & UI** | Tailwind CSS, Shadcn UI, Framer Motion, Lucide Icons |
| **Maps** | Leaflet + React-Leaflet |
| **Backend & Database** | Supabase (Auth, Postgres, Storage) |
| **Offline / PWA** | vite-plugin-pwa, Workbox, IndexedDB |
| **Deployment** | Vercel / Netlify (Frontend), Render (Backup API) |

---

## 🗂️ Architecture Overview

```
client/
├── store/
│   ├── index.ts               # Root Redux store + typed hooks
│   └── slices/
│       ├── quizSlice.ts       # Quiz questions, answers, result
│       ├── offlineSlice.ts    # isOnline, isSWReady, canInstall
│       └── userSlice.ts       # Supabase user session
├── lib/
│   ├── idb.ts                 # IndexedDB helpers for offline storage
│   └── supabase.ts            # Supabase client
├── pages/
│   ├── Quiz.tsx               # Network-first → IDB fallback for questions
│   ├── CareerMap.tsx          # Reads top_stream from Redux result
│   └── ...
└── components/layout/
    └── OfflineBanner.tsx      # PWA install prompt + offline status
```

### Offline Data Flow

```
User visits app (online)
  └─► Supabase fetch quiz_questions
        └─► Success → Cache to IndexedDB + update Redux
          
User goes offline
  └─► Quiz.tsx detects isOnline=false in Redux
        └─► Falls back to IndexedDB cache
              └─► Loads questions locally → answers → saves result to IDB
```

---

## 🚀 Getting Started

### Prerequisites
Node.js 18+ and npm/pnpm installed. A [Supabase](https://supabase.com) project with Auth and a `profiles` table.

### Installation

```bash
# 1. Clone the repo
git clone https://github.com/Nikhil-Vzo/Guidely-.git
cd Guidely-

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env
# Fill in VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY

# 4. Run dev server
npm run dev
```

### Environment Variables

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Building for Production

```bash
npm run build
# Output: dist/spa/ (frontend) + dist/server/ (API)
```

---

## 🔒 License

Built for **Smart India Hackathon (SIH) 2025** by team **Code_moses**.  
Open for educational and portfolio use.
