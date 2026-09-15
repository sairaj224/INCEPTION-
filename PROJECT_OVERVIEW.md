# 🚀 INCEPTION AI — System Architecture & Product Overview

**Project Name:** Inception AI  
**Target Audience:** Engineering Students, Robotics Clubs, Makers, and Universities  
**Core Purpose:** An intelligent, budget-aware IoT & Electronics engineering platform that pairs AI-guided project discovery and troubleshooting with a hardware kit marketplace and interactive learning lab.

---

## 1. Executive Summary

**Inception AI** bridges the gap between theoretical electronics engineering and practical hardware implementation. It solves three critical student challenges:
1. **Selection Paralysis & Budget Constraints:** AI recommends verified hardware projects based on strict budget limits (in ₹ INR), skill level, and components available.
2. **Hardware Debugging Frustration:** An embedded AI troubleshooter diagnoses wiring faults, I2C address conflicts, pin polarity mistakes, and code syntax bugs.
3. **Component Procurement Hassle:** A single-click student marketplace where learners can purchase individual ICs/sensors or complete project BOM (Bill of Materials) kits delivered directly to university campus hostels.

---

## 2. Core Feature Breakdown

### 🧠 A. AI Intelligence Suite (Powered by Google Gemini)
* **AI Project Recommendation Engine (`/api/ai/recommend`)**:
  * Takes target budget (₹50 to ₹100,000+), domain of interest (IoT, Robotics, Automation, Healthcare, AIoT), and skill level.
  * Dynamically generates 3 structured, feasible hardware projects complete with time commitments, cost breakdowns, Bill of Materials (BOM), and core learning outcomes.
* **AI Circuit & Firmware Troubleshooter (`/api/ai/troubleshoot`)**:
  * Accepts project context, component list, and the student's observed issue (e.g. *“LCD only shows black boxes”*, *“ESP32 bootlooping on brownout”*).
  * Returns a probable root-cause diagnosis, 4 actionable hardware/wiring checks, and ready-to-flash C++ code fixes with serial debugging hooks.
* **AI Component Explainer (`/api/ai/explain-component`)**:
  * Deep conceptual breakdowns for individual electronics components (e.g., L298N Motor Driver, DHT11, Optocoupler).
  * Explains internal semiconductor working, *“What happens if I skip this component?”*, industrial applications, and cheaper alternative replacements.

---

### 🛒 B. Hardware Marketplace & E-Commerce Engine
* **Project Bundles & Single-Part Procurement:**
  * Students can purchase entire pre-tested project kits or check off only the missing components they need.
  * Real-time price calculation with student campus discount tags.
* **University Campus Delivery & Checkout:**
  * Multi-step checkout tailored to campus life: hostel block, room number, university department, and student roll number.
  * Flexible payment methods: Cash on Delivery (COD), UPI QR, and Student NetBanking.
* **Automated Order Tracking & Invoices:**
  * Real-time order status tracking (`Order Placed` ➔ `Hardware Verification` ➔ `Dispatched` ➔ `Delivered`).
  * Downloadable itemized e-invoices with component warranty details.

---

### 📚 C. Interactive Learning Hub & Project Guides
* **Step-by-Step Interactive Assembly:**
  * High-definition circuit schematics and pin-mapping diagrams.
  * Ready-to-flash Arduino IDE / PlatformIO embedded C++ sketches with one-click copy.
  * Common hardware pitfalls and safety checklist.
* **Community Showcase & Maker Forum:**
  * Students publish their modified circuits, custom 3D enclosures, and project video demos.

---

### 🔐 D. Security & Email-First Authentication
* **Email-First Authentication Flow:**
  * Optimized for university emails (`@iitb.ac.in`, `@nit.ac.in`, `@edu.in`) and personal emails (`@gmail.com`, `@outlook.com`).
  * Quick-add domain chips for one-tap entry on mobile and desktop.
* **Dual Login Mechanisms:**
  1. **Password Sign-in:** Secured with cryptographic PBKDF2 hashing and unique per-user salts.
  2. **6-digit Email OTP Verification:** Fast passwordless login with resend rate-limiting and session token generation.
* **Admin Management Console:**
  * Secure portal for stock management, price updates, project catalog editing, and order dispatch tracking.

---

## 3. Technology Stack

| Layer | Technologies Used | Description |
| :--- | :--- | :--- |
| **Frontend Framework** | **React 19, TypeScript, Vite 6** | Ultra-fast Single Page Application (SPA) architecture with strict type safety. |
| **Styling & UI Design** | **Tailwind CSS v4, Lucide Icons, Motion** | Modern responsive UI, micro-animations, and accessible color-contrast layouts. |
| **Backend & Serverless** | **Node.js, Express 4, TypeScript (TSX / esbuild)** | Dual-mode backend: custom Express server in dev/Docker and serverless routes on Vercel/Cloud Run. |
| **AI / LLM Engine** | **Google GenAI SDK (`@google/genai`)** | Powered by **Gemini 3.6 Flash** with structured JSON schema outputs and low latency. |
| **Cloud Databases** | **Firebase Firestore & Supabase PostgreSQL** | Real-time synchronized database for users, project catalog, orders, and inventory. |
| **Security & Auth** | **Node Crypto (PBKDF2 SHA-512), Firebase Auth** | Multi-layer auth handling passwords, email OTP dispatch, and tokenized sessions. |
| **Build & Tooling** | **esbuild, Rollup Chunks, Vercel / Cloud Run** | Optimized multi-chunk bundling (`vendor-react`, `vendor-firebase`, `vendor-icons`). |

---

## 4. System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                            CLIENT LAYER (React 19 + Vite)                   │
│                                                                             │
│  [Marketplace View]    [Project Detail & BOM]    [AI Guidance & Debugger]   │
│  [Email Auth Modal]    [Checkout & Tracking]     [Admin Inventory Portal]   │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │ HTTPS / JSON REST
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                     BACKEND PROXY & API LAYER (Express / Node.js)           │
│                                                                             │
│  • /api/ai/recommend            • /api/auth/check-identifier                │
│  • /api/ai/troubleshoot         • /api/auth/send-otp                        │
│  • /api/ai/explain-component    • /api/auth/verify-otp & login              │
│  • /api/health                  • Rate Limiters & Input Sanitizers          │
└──────────────────┬──────────────────────────────────────┬───────────────────┘
                   │                                      │
                   ▼                                      ▼
┌──────────────────────────────────────┐ ┌────────────────────────────────────┐
│      GOOGLE GEMINI API (LLM)         │ │   DATABASE PERSISTENCE LAYER       │
│                                      │ │                                    │
│ • Model: gemini-3.6-flash            │ │ • Firestore / Supabase Collections:│
│ • Zero-shot reasoning on circuits    │ │   - Users & Profiles               │
│ • JSON-mode structured responses     │ │   - Hardware Projects Catalog      │
│ • Contextual code generation         │ │   - Orders & Campus Deliveries     │
│                                      │ │   - Stock & Inventory Control      │
└──────────────────────────────────────┘ └────────────────────────────────────┘
```

---

## 5. Key Architecture Highlights for Your Team

1. **Zero Secret Leakage:**
   * All calls to the Gemini AI API and sensitive database credentials remain isolated on the server/serverless layer (`/api/*`). The browser client never touches private API keys.
2. **Graceful Fallbacks & Offline Resilience:**
   * If Gemini API limits or network drops occur, the backend includes deterministic fallback datasets for beginner projects and core troubleshooting steps.
3. **High-Performance Chunking:**
   * Heavy libraries (Firebase, React core, Icon packs) are split into dedicated chunks in `vite.config.ts`, ensuring fast initial page loads under 1.5 seconds.
4. **Vercel & Container Compatibility:**
   * Packaged with both `dist/server.cjs` (for Docker/Cloud Run deployments) and `/api/index.ts` + `vercel.json` (for serverless Vercel deployments).

---

## 6. How to Export to PDF

1. **In VS Code / Code Editor:** Open `PROJECT_OVERVIEW.md` ➔ Right-click ➔ **Markdown Preview** ➔ Right-click preview ➔ **Print / Export to PDF**.
2. **In Browser / Web:** Open the markdown in GitHub, Notion, or Google Docs, and select **File → Print / Download → PDF Document (.pdf)**.
