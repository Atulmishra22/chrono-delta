# ⏱️ TimeFlow — Precision Time & Schedule Intelligence

> **TimeFlow** is an authoritative, data-dense time management platform designed for developers, engineers, and project leads. Instead of merely tracking todo lists, TimeFlow calculates live mathematical variance between **elapsed time** and **actual work completed** to pinpoint deadline risks before they compound.

---

## 🎯 The Core Philosophy

Most productivity apps ask:
> *"What tasks do you have to do?"*

**TimeFlow asks:**
> *"Is your work velocity keeping up with how much time has passed?"*

$$\text{Time Elapsed \%} = \frac{\text{Current Time} - \text{Start Date}}{\text{End Date} - \text{Start Date}} \times 100$$

$$\text{Schedule Delta} = \text{Work Completed \%} - \text{Time Elapsed \%}$$

- **$\ge +10\%$**: 🟢 **Ahead of Schedule**
- **$-10\%$ to $+10\%$**: 🟢 **On Track**
- **$\le -10\%$**: 🔴 **Behind Schedule (Critical Variance Alert)**

---

## ✨ Features

- **Live T-Minus Countdown**: Real-time second-by-second countdown powered by client-side intervals with **zero Firebase read costs**.
- **Dual Progress Visualizers**: Precision 10% tick mark progress bars comparing Expected Time Elapsed vs Actual Work Done.
- **Active Radar**: Full-spectrum project table tracking status, next milestones, and real-time velocity deltas.
- **Execution Pipeline**: Inline-editable task table with status indicators, progress sliders, and delayed task highlighting.
- **Pomodoro Focus Ring**: Integrated countdown timer block for deep work sessions.
- **4-Step Onboarding Wizard**: Quick-start flow to configure target constraints and initial milestones.
- **Chronos Precision Design System**: Technical, authoritative palette (Command Indigo, Performance Emerald, Alert Amber, Error Red) with Inter and JetBrains Mono typography.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router & Turbopack)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Backend & Auth**: [Firebase](https://firebase.google.com/) (Google Authentication & Cloud Firestore)
- **State Management**: [Zustand](https://github.com/pmndrs/zustand)
- **Date Utilities**: [date-fns](https://date-fns.org/)
- **Typography & Icons**: Google Fonts (`Inter`, `JetBrains Mono`) & Google Material Symbols

---

## 🚀 Getting Started

### 1. Clone the repository
```bash
git clone git@github.com:Atulmishra22/timeFlow.git
cd timeFlow
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Create a `.env.local` file in the root directory:
```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📁 Project Architecture

```
src/
├── app/
│   ├── page.tsx                     # Landing Page (HUD preview & protocol sequence)
│   ├── layout.tsx                   # Root Layout (Fonts, Metadata, AuthProvider)
│   ├── login/page.tsx               # Authentication & Demo Operator access
│   ├── onboarding/page.tsx          # 4-Step Setup Wizard
│   └── app/
│       ├── layout.tsx               # Protected Command Center shell & fixed sidebar
│       ├── dashboard/page.tsx       # Main Focus HUD, KPI Cards, Pomodoro & Active Radar
│       ├── projects/
│       │   ├── page.tsx             # Projects Directory & Filters
│       │   ├── new/page.tsx         # Create Objective form
│       │   └── [projectId]/page.tsx # Project Details, T-Minus & Execution Pipeline
│       └── settings/page.tsx        # Profile, Timezone & Session Controls
├── components/
│   ├── countdown/                   # JetBrains Mono T-Minus Countdown timer
│   ├── dashboard/                   # KPI Cards, Main Focus HUD, Pomodoro & Radar table
│   ├── layout/                      # Sidebar, Header, AppLayout
│   ├── progress/                    # ProgressBar (10% ticks) & Schedule Status badges
│   ├── projects/                    # ProjectCard & ProjectForm
│   └── tasks/                       # TaskTable & TaskRow with inline editing
├── contexts/                        # AuthContext (Google OAuth & local fallback)
├── hooks/                           # useCountdown, useProjects, useProject, useTasks
├── lib/                             # calculations.ts, firebase.ts, auth.ts, firestore.ts
├── stores/                          # Zustand UI state store
└── types/                           # User, Project, Task TypeScript definitions
```

---

## 📄 License

MIT &copy; [Atul Mishra](https://github.com/Atulmishra22)