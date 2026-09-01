# CampusVault — Institutional Student Portal & Academic Intelligence Dashboard

A modern, responsive, and humanized college student portal designed to empower university students with real-time academic analytics, attendance tracking, GPA projection, course deadline management, and digital campus credentials.

---

##  Overview

**CampusVault** replaces clunky legacy ERP systems with a fast, intuitive, single-page application built for modern higher education. It delivers a personalized, human-centered dashboard experience that gives students total visibility into their degree progression, attendance health thresholds, upcoming coursework, faculty circulars, and institutional achievements.

---

##  Key Features

### 1.  Holistic Student Overview & Daily Check-in
- **Dynamic Time-Aware Greetings**: Personalized greeting based on local time with context-aware academic reminders.
- **Daily Focus & Vibe Selector**: Interactive wellness check-in to tag daily study mindsets with encouraging tips.
- **KPI Highlight Cards**: Real-time snapshots of overall attendance percentage, cumulative CGPA, batch ranking, active recognitions, and pending tasks.
- **Interactive Visual Analytics**: Interactive Recharts trends for monthly attendance rhythm and semester-by-semester SGPA trajectories.

### 2.  Attendance Engine & Safe Bunk Calculator
- **Threshold Watchdog**: Continuous monitoring against the mandatory 75% institutional attendance requirement.
- **Bunk Buffer Algorithm**: Calculates the exact number of future lectures a student can safely miss while remaining $\ge 75\%$.
- **Recovery Deficit Calculator**: Computes the exact consecutive classes needed to recover from low attendance back to eligibility.
- **Interactive What-If Simulation**: Dynamic slider to test future attendance scenarios and project percentage changes in real time.

### 3.  Academic Gradebook & GPA Planner
- **Semester Transcripts**: Detailed breakdown of theory, laboratory, and elective courses with credit weightings, letter grades, and grade points.
- **Interactive SGPA Calculator**: Dynamic course simulator allowing students to project prospective semester grade point averages.
- **Target CGPA Goal Planner**: Calculates required future semester performance to reach target graduation milestones.

### 4.  Digital Student ID Pass
- **Institutional Identity Card**: Responsive, flip-enabled digital ID card featuring student photo, verifiable QR code, bar code, academic credentials, and blood group.
- **Barcode & NFC Simulation**: Built-in visual barcode and campus gate scanner simulation.

### 5.  Student Registration & Dynamic Registry
- **Institutional Enrollment Form**: Allows adding new student records with custom roll numbers, branch selection, semester tracks, and avatar presets.
- **Live Registry Directory**: Multi-student switcher enabling administrators and students to toggle live dashboard state across distinct student profiles.
- **Automatic Academic Bundling**: Generates individualized transcripts, attendance ledgers, deadlines, and notifications upon registration.

### 6.  Honors, Achievements & Certificate Verification
- **Trophy & Credential Vault**: Showcase hackathon wins, published research papers, certifications, and academic scholarships.
- **Interactive Certificate Viewer**: View institutional verification badges, issue dates, credential IDs, and issuer details.
- **Add Credential Modal**: Form to append new extracurricular achievements dynamically.

### 7.  Deadlines, Quizzes & Event Schedule
- **Actionable Task List**: Track upcoming assignment submissions, lab evaluations, mid-term examinations, and cultural fests.
- **Interactive Completion Workflow**: One-click completion toggle with celebratory particle animations.
- **Filterable Timeline**: Group deadlines by pending, completed, exams, or assignment categories.

### 8.  Faculty Circulars & Notice Feed
- **Campus Bulletin Board**: Faculty and department announcements categorized by urgency (High Priority, Academic, Exam Branch, Placement Cell).
- **Detail View & Read Status**: Full-screen modal reader with unread notification badges and interactive markers.

### 9.  Library Privacy Mode & Command Palette
- **Confidentiality Masking**: One-click toggle to mask roll numbers, marks, and GPA with bullet characters when studying in public spaces.
- **Quick Command Palette (`Ctrl + K` / `Cmd + K`)**: Fast fuzzy search across courses, actions, deadlines, and faculty contacts.

---

##  Technologies & Libraries

- **Core Framework**: [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Build Tool**: [Vite 6](https://vitejs.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Animations & Micro-interactions**: [Motion (Framer Motion)](https://motion.dev/)
- **Data Visualization**: [Recharts](https://recharts.org/)
- **Iconography**: [Lucide React](https://lucide.dev/)
- **Celebration Effects**: [Canvas Confetti](https://www.npmjs.com/package/canvas-confetti)

---

##  System Requirements

- **Node.js**: `v18.0.0` or higher (Node 20+ recommended)
- **Package Manager**: `npm` (v9+), `pnpm`, `yarn`, or `bun`
- **Modern Web Browser**: Google Chrome, Mozilla Firefox, Safari, or Microsoft Edge with ES2022+ support

---

##  Installation

1. **Clone or download the repository:**
   ```bash
   git clone https://github.com/your-username/student-portal-dashboard.git
   cd student-portal-dashboard
   ```

2. **Install project dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables (Optional):**
   ```bash
   cp .env.example .env
   ```

---

##  How to Run

### Development Server
Start the local development server with hot-reload enabled:
```bash
npm run dev
```
Open your browser and navigate to `http://localhost:3000`.

### Production Build
Compile and bundle the production-ready static assets:
```bash
npm run build
```

### Preview Production Build
Locally preview the generated production build:
```bash
npm run preview
```

### Code Validation & Linting
Run TypeScript static type checks:
```bash
npm run lint
```

---

##  Example Usage & Walkthrough

1. **Viewing Attendance & Calculating Safe Bunks**:
   - Open the **Attendance** tab from the left sidebar.
   - Inspect subject-level percentages and color-coded status badges.
   - Review the summary bar to see exact lectures safe to skip without breaching the 75% requirement.
   - Use the **What-If Attendance Simulator** slider at the bottom to project future percentage shifts.

2. **Simulating Semester GPA & Setting Goals**:
   - Navigate to the **GPA Planner** tab.
   - Adjust expected grades for upcoming subjects to calculate real-time prospective SGPA.
   - Input your graduation CGPA target to see the required semester-by-semester score needed.

3. **Enrolling a New Student**:
   - Click **Register Student** in the sidebar or press `Ctrl + K` and type `"Register"`.
   - Complete the registration form with student name, department, semester, and avatar.
   - Choose **"Register & Switch to Student Portal"** to immediately explore the portal under the new student's profile.

4. **Toggling Discreet / Privacy Mode**:
   - Click the **Eye / Shield icon** in the top navigation bar or press `Privacy Mode` in **My Profile**.
   - Watch sensitive roll numbers, marks, and GPA metrics automatically mask for discreet usage in crowded libraries.

---

##  Project Structure

```text
├── index.html                   # HTML entry point with metadata
├── package.json                 # Project dependencies and script definitions
├── tsconfig.json                # TypeScript compiler configuration
├── vite.config.ts               # Vite build configuration with Tailwind CSS
├── metadata.json                # Application metadata
├── public/                      # Static assets and favicons
└── src/
    ├── main.tsx                 # React application root mount point
    ├── App.tsx                  # Root application state & modal coordinator
    ├── index.css                # Global styles and Tailwind CSS imports
    ├── types.ts                 # Global TypeScript definitions & interfaces
    ├── data/
    │   └── mockData.ts          # Comprehensive student data bundles & presets
    ├── utils/
    │   └── confetti.ts          # Celebration particle effects helper
    └── components/
        ├── Navbar.tsx           # Global header with privacy switch, search, and alerts
        ├── Sidebar.tsx          # Responsive navigation sidebar with badge counts
        ├── modals/
        │   ├── AddAchievementModal.tsx      # Modal to add new honors/certificates
        │   ├── AddDeadlineModal.tsx         # Modal to create custom tasks & deadlines
        │   ├── AnnouncementDetailModal.tsx  # Full notice reader modal
        │   ├── CertificateModal.tsx         # Credential preview & verification modal
        │   ├── DigitalIdCardModal.tsx       # Flip-enabled smart digital student ID
        │   ├── SearchCommandModal.tsx       # Cmd+K global command & navigation palette
        │   └── StudentAuthModal.tsx         # Student switcher & credential login modal
        └── views/
            ├── Overview.tsx                 # Home dashboard with analytics & vibe check
            ├── AttendanceView.tsx           # Subject attendance ledger & bunk calculators
            ├── AcademicsView.tsx            # Semester transcripts & gradebook tables
            ├── CalculatorsView.tsx          # SGPA/CGPA goal calculators & simulators
            ├── AchievementsView.tsx         # Honors, hackathons & certification vault
            ├── EventsScheduleView.tsx       # Deadlines, exams & event planner
            ├── AnnouncementsView.tsx        # Faculty circulars & department bulletins
            ├── ProfileView.tsx              # Student bio, skills, contact & privacy
            └── RegisterStudentView.tsx      # Enrollment form & student registry
```

---

##  Future Improvements & Roadmap

- [ ] **Cloud Database Integration**: Connect with Firebase Firestore or PostgreSQL / Cloud SQL for persistent multi-user accounts and role-based access control (Admin / Faculty / Student).
- [ ] **Learning Management System (LMS) Sync**: Live bidirectional integration with Google Classroom, Canvas LMS, and Moodle for automated syllabus and deadline imports.
- [ ] **PDF Transcript & Gradecard Export**: Instant one-click PDF generation of official semester grade sheets and verification certificates.
- [ ] **Push & SMS Notification Alerts**: Automated threshold alert pings when attendance dips below 78% or when assignments are due in < 24 hours.
- [ ] **Faculty Mentor Chat & Office Hours**: In-app appointment scheduler for 1-on-1 counseling with faculty advisors.
- [ ] **Dark Mode / Theme Customizer**: High-contrast dark mode and custom university accent palettes.

---

##  License

This project is open source and available under the [MIT License](LICENSE).
