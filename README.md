# Inception — Smart Hardware & IoT Learning Platform

**Inception** is an AI-powered marketplace, Bill-of-Materials (BOM) builder, and IoT learning assistant designed specifically for engineering students, researchers, and academic faculty.

🌐 **Live Application URL:** [https://ais-pre-7cz5zqe3wiscaflajwsjro-797954490813.asia-east1.run.app](https://ais-pre-7cz5zqe3wiscaflajwsjro-797954490813.asia-east1.run.app)

---

## 🚀 Features

- 🛠️ **Smart Hardware & Component Marketplace**: Browse curated microcontrollers, sensors, electronic components, and lab tools categorized across domains (Robotics, Embedded Systems, IoT, Edge AI, Power Electronics).
- 📋 **AI-Powered BOM & Project Assistant**: Generate instant Bill-of-Materials, circuit wiring diagrams, component recommendations, and code snippets tailored for student capstone and research projects.
- ☁️ **Real-Time Cloud Firestore Sync**: Powered by Google Cloud Firestore for persistent inventory management, catalog updates, and order history tracking.
- 🎓 **Student Verification & Discounts**: Built-in institutional authentication flow supporting student email verification and academic discount perks.
- 🔐 **Admin Control Panel**: Secure inventory management suite allowing admins to add, edit, or remove hardware products with immediate database synchronization.
- ⚡ **Full-Stack Architecture**: Modern TypeScript stack with Vite, React 18, Express backend proxying, and Tailwind CSS.

---

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS, Lucide React Icons
- **Backend**: Node.js & Express (`server.ts`)
- **Database**: Google Cloud Firestore (`firebase-applet-config.json`, `firestore.rules`)
- **AI Integration**: Google Gemini API for smart component suggestions and wiring advice
- **Build Tooling**: Vite & esbuild

---

## 📂 Project Structure

```text
├── src/
│   ├── components/      # Modular UI components (Catalog, Cart, Admin Modal, BOM Assistant, etc.)
│   ├── lib/             # Utilities for Firebase, SEO, Logger, API
│   ├── App.tsx          # Main Application Component
│   ├── types.ts         # Shared TypeScript Types & Interfaces
│   └── main.tsx         # React Client Entrypoint
├── server.ts            # Node Express Server Entrypoint
├── firebase-blueprint.json # Firestore Schema Definition
├── firestore.rules      # Firestore Security Rules
├── firebase-applet-config.json # Applet Firebase Configuration
├── package.json         # Dependencies & Build Scripts
└── README.md            # Project Documentation
```

---

## 💻 Local Development Setup

1. **Clone the repository:**
   ```bash
   git clone <your-repository-url>
   cd inception
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```
   Open `http://localhost:3000` in your browser.

4. **Build for production:**
   ```bash
   npm run build
   npm start
   ```

---

## 📤 Exporting to GitHub

You can export or sync this project directly to your GitHub account:
1. Open the top-right **Settings / Export** menu in the AI Studio header interface.
2. Select **Export to GitHub** (or **Download ZIP**).
3. Authorize GitHub access and select your target repository name.
