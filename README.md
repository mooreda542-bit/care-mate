# CareMate (رفيق الرعاية)

CareMate is a senior-friendly, bilingual (Arabic / English) medication organization and reminder web application developed as an academic graduation front-end course project. It provides an accessible, calm, high-contrast user interface designed specifically to help elderly individuals and family caregivers manage daily medication routines, schedules, and reminders with ease.

---

## 1. Project Overview & Architecture

CareMate is built as a pure **Client-Side Single-Page Application (SPA)** with zero external backend dependencies or tracking servers. All user data is preserved privately on the user's device.

### High-Level Architecture

```
User Browser (Client-Side Only)
 ├── React 19 UI Components (Tailwind CSS v4 & Lucide Icons)
 ├── React Router DOM v7 (Client-Side Routing)
 ├── Context Layer
 │    ├── LanguageContext (Arabic RTL Default / English LTR)
 │    └── ReminderContext (Heartbeat Engine + In-App Alerts + Native Notifications)
 ├── Local Processing & Persistence
 │    ├── WebAssembly OCR Engine (Tesseract.js v7 Client-Side Text Extraction)
 │    ├── Deterministic Time Parser (timeParser.js - RegEx & Math Minutes Normalization)
 │    └── HTML5 Storage API (localStorage for medications / sessionStorage for reminder deduplication)
```

---

## 2. Main Features

- **Senior-Friendly User Experience:**
  - Extra-large touch targets (minimum 48px to 58px on primary actions).
  - High-contrast typography with Cairo (Arabic) and Plus Jakarta Sans (English) font families.
  - Large, readable headings and uncluttered screens without overwhelming data cards or popups.

- **Immediate Access (No Authentication Walls):**
  - Works out-of-the-box without requiring account creation, credentials, or passwords.
  - Direct guest access to the full application (`/dashboard`) ensuring 100% privacy and zero barriers.

- **Dynamic Today's Routine Dashboard:**
  - Automatically reads user-entered medications and presents the **next upcoming dose** in a high-visibility hero banner.
  - One-tap "Medication Taken" button that updates daily completion progress immediately.
  - Clear, welcoming empty state with direct action guidance when no medications have been added yet.

- **Medication Management (CRUD):**
  - Add, edit, browse, and delete medication records.
  - Real-time client-side search filtering by medication name.
  - Safe LocalStorage persistence under the key `caremate_medications`.
  - Delete confirmation dialogs to prevent accidental data loss.

- **Chronological Schedule Timeline:**
  - Converts diverse time notations (12-hour Arabic/English, 24-hour, Arabic-Indic numerals) into normalized minutes from midnight.
  - Displays doses sorted ascendingly from morning to night.
  - Isolates and cleanly explains unscheduled medications.

- **Dual-Layer Reminder Engine:**
  - **In-App Reminder Banner:** 100% reliable floating modal that triggers at the exact minute inside any active browser tab.
  - **Native Browser Notifications:** Dispatches system notifications to the desktop or mobile notification tray when permissions are granted.
  - 10-second heartbeat check with a 1-minute safety grace window to prevent missed reminders due to clock drift or tab sleep.
  - Session-backed deduplication (`sessionStorage`) prevents repeat triggers for the same dose on the same day.

- **Prescription OCR Scanner (Tesseract.js):**
  - Upload or photograph prescription labels directly via device camera or gallery.
  - Runs client-side using WebAssembly without sending images to cloud servers.
  - Multi-language recognition (Arabic, English, or bilingual).
  - Editable text review box allowing users to inspect and correct extracted text before applying it to the medication form.

- **Bilingual & RTL/LTR Layout:**
  - Modern Standard Arabic as the default native language.
  - Dynamic RTL/LTR document direction switching with mirroring layouts and direction-aware icons.
  - Complete 100% parity across 310 translation keys.

---

## 3. Technology Stack & Versions

All dependencies match the exact versions in `package.json`:

| Package | Version | Purpose |
| :--- | :--- | :--- |
| **React** | `^19.3.1` | Core UI component library |
| **React DOM** | `^19.3.1` | DOM renderer for React |
| **Vite** | `^8.3.6` | High-speed frontend build tool & dev server |
| **Tailwind CSS** | `^4.3.5` | Modern utility-first CSS styling engine |
| **@tailwindcss/vite** | `^4.3.5` | Vite plugin integration for Tailwind CSS v4 |
| **React Router DOM** | `^7.18.6` | Client-side routing and navigation |
| **Lucide React** | `^1.78.0` | Accessible, senior-friendly iconography |
| **Tesseract.js** | `^7.0.0` | WebAssembly-powered browser OCR engine |
| **Oxlint** | `^1.90.0` | High-performance JavaScript/JSX linter |

---

## 4. Folder Structure & Responsibilities

```
D:\431\CARE-MATE\
├── public/                     # Static assets (favicon.svg)
├── src/
│   ├── components/             # Reusable modal and specialized components
│   │   └── PrescriptionScannerModal.jsx  # Tesseract OCR camera/file modal
│   ├── context/                # Global React Context providers
│   │   ├── LanguageContext.jsx # Arabic/English & RTL/LTR state
│   │   └── ReminderContext.jsx # Notification dispatching & in-app alerts
│   ├── layout/                 # Structural layouts and navigation bars
│   │   ├── AppHeader.jsx       # Internal header with route title & quick alerts
│   │   ├── AppLayout.jsx       # Layout orchestrator (Landing, Auth, Shell)
│   │   ├── AppSidebar.jsx      # Senior-friendly desktop navigation sidebar
│   │   ├── Header.jsx          # Public landing/auth top bar
│   │   └── MobileBottomNav.jsx # High-visibility mobile bottom navigation
│   ├── locales/                # Localization dictionary files (310 keys each)
│   │   ├── ar.js               # Natural Modern Standard Arabic dictionary
│   │   └── en.js               # Clean English dictionary
│   ├── pages/                  # Route view components
│   │   ├── DashboardPage.jsx   # Today's routine, next dose & progress
│   │   ├── LandingPage.jsx     # Simple, clear introduction & entry CTA
│   │   ├── LoginPage.jsx       # Direct-access demonstration screen
│   │   ├── MedicationsPage.jsx # Medication CRUD list & search
│   │   ├── NotFoundPage.jsx    # Custom 404 recovery page
│   │   ├── SchedulePage.jsx    # Chronological daily timeline
│   │   ├── SettingsPage.jsx    # Language, alerts & data reset options
│   │   └── SignUpPage.jsx      # Instant-start demonstration screen
│   ├── utils/                  # Pure utility and helper modules
│   │   ├── storage.js          # Safe LocalStorage wrapper with error handling
│   │   └── timeParser.js       # Robust 12h/24h time parser into minute integers
│   ├── App.jsx                 # Route tree definitions
│   ├── index.css               # Tailwind v4 theme variables & tokens
│   └── main.jsx                # React root mount with LanguageProvider
├── .gitignore                  # Git exclusion rules
├── .oxlintrc.json              # Linter configuration
├── index.html                  # HTML entry point with Cairo & Jakarta fonts
├── package.json                # Project dependencies and npm scripts
└── vite.config.js              # Vite bundler configuration
```

---

## 5. Getting Started & Installation

### Prerequisites
- **Node.js**: v18.0.0 or higher recommended.
- **npm**: v9.0.0 or higher.

### 1. Clone the Repository
```bash
git clone <repository-url>
cd CARE-MATE
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Run Development Server
```bash
npm run dev
```
Open your browser at `http://localhost:5173/`.

### 4. Run Linter
```bash
npm run lint
```

### 5. Build for Production
```bash
npm run build
```

### 6. Preview Production Build
```bash
npm run preview
```

---

## 6. Technical Implementation Details

### Medication Storage (`storage.js`)
All medication entries persist in the browser's `localStorage` under the key `caremate_medications`.
- Uses a safe wrapper that catches exceptions (such as private browsing quota restrictions).
- Data structure:
  ```typescript
  interface Medication {
    id: string;             // Unique ID: med_{timestamp}_{random}
    name: string;           // Medication name (required)
    instructions?: string;  // Dosage and instructions
    times?: string;         // Clock times (e.g. "08:00 ص, 02:00 م")
    notes?: string;         // Special precautions
    createdAt: string;      // ISO string
  }
  ```

### Time Parsing & Sorting (`timeParser.js`)
- Sanitizes Arabic-Indic numerals (`٠-٩` &rarr; `0-9`).
- Parses 12-hour AM/PM formats (`ص/م` or `AM/PM`) and 24-hour clocks.
- Converts times to minutes from midnight (`0` to `1439`) for ascending numerical sorting in schedules.

### Reminder Engine (`ReminderContext.jsx`)
- Ticks every 10 seconds checking the local device time against scheduled doses.
- Grace window of 1 minute (`diff >= 0 && diff <= 1`) ensures reminders fire reliably even if timer ticks are delayed.
- Fires an **In-App Toast Alert** immediately without requiring permissions.
- Fires a **Native Notification** if permission is granted (`Notification.permission === 'granted'`).
- Saves fired event keys (`YYYY-MM-DD_medId_minute_chunkIdx`) in `sessionStorage` to prevent duplicate alerts upon page reload.

### OCR Pipeline (`PrescriptionScannerModal.jsx`)
- Initializes Tesseract.js worker lazily upon modal opening.
- Employs WebAssembly for 100% in-browser text recognition.
- Text is loaded into an editable review field so the user can verify doctor handwriting before applying it to the medication form.
- Revokes temporary object URLs (`URL.revokeObjectURL`) upon closing to avoid memory leaks.

---

## 7. Privacy, Security & Limitations

1. **Unencrypted Local Storage:** Data is stored locally in `localStorage`. Users should not input sensitive clinical secrets.
2. **Foreground Dependency:** Reminders rely on client-side intervals while the website tab remains open. If the browser or device is powered off or sleeping, background notifications cannot be guaranteed.
3. **OCR Non-Clinical Nature:** Text extraction is an organizational assistant and must not be used as clinical drug validation. Users must always verify extracted text against original prescriptions.
4. **Academic Prototype:** CareMate does not provide clinical diagnoses or emergency medical advice.

---

## 8. License & Academic Disclaimer

Developed as an educational graduation project demonstration for front-end web development. Provided "as-is" for learning, accessibility research, and academic evaluation.
