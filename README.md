# Nexus EDGE — Enterprise IT Consulting & IT Services Platform

[![GitHub Pages Deployment](https://github.com/vkchang39/nexus-edge-sample/actions/workflows/deploy.yml/badge.svg)](https://github.com/vkchang39/nexus-edge-sample/actions/workflows/deploy.yml)
[![Live Demo](https://img.shields.io/badge/Live%20Demo-GitHub%20Pages-00C853?style=flat-square&logo=github)](https://vkchang39.github.io/nexus-edge-sample/)
[![License](https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square)](LICENSE)
[![Vanilla JS](https://img.shields.io/badge/Built%20With-Vanilla%20JS%20%7C%20CSS3%20%7C%20HTML5-F7DF1E?style=flat-square&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)

A state-of-the-art, high-performance web platform built for **Nexus EDGE** — an integrated talent intelligence and IT product engineering powerhouse serving 150+ enterprise clients across 23 global verticals.

---

## 🌟 Live Demo

🔗 **Explore the Live Application**: [https://vkchang39.github.io/nexus-edge-sample/](https://vkchang39.github.io/nexus-edge-sample/)

---

## 🚀 Key Interactive Components & Features

### 1. ⚡ 12 Industries Fluid Ribbon Accordion Deck
* **Fluid Flex Animation**: Smooth, GPU-accelerated card expansion (`420px` active flex-basis) with paint containment (`contain: paint layout;`) for jitter-free 60/120 FPS transitions.
* **Dynamic Serial Re-Indexing**: Real-time JavaScript indexing (`01`, `02`, `03`...) that updates sequentially as categories are filtered (All, Fintech, Healthcare, Commerce, Cloud, Enterprise).
* **Deep Metric Highlights**: Each vertical card presents industry-specific compliance standards (PCI-DSS, HIPAA, SOC-2, ISO 27001), tech stacks, and tangible ROI metrics.

### 2. 🛤️ 11-Step Talent Consulting Horizontal Timeline
* **Alternating Zig-Zag Rail**: A continuous central glowing line with Step 1 (DOWN), Step 2 (UP), Step 3 (DOWN), Step 4 (UP)... alternating through all 11 milestones.
* **Progressive Lighting Effect**: As the timeline scrolls horizontally, the central rail fills with a neon green gradient (`#00FF87` → `#60EFFF`), illuminating active nodes, connecting stems, and cards.
* **Dedicated Horizontal Scrolling**: Completely unhijacked vertical page scrolling with horizontal drag-to-scroll, trackpad horizontal swipe, and Prev/Next button controls.

### 3. 💼 2026 Tech Compensation & Salary Benchmark Engine
* Real-time salary calculator based on actual hiring intelligence across India's premier tech centers (Bengaluru, Mumbai, NCR, Hyderabad, Pune).
* Multi-currency switcher (**INR ₹**, **USD $**, **EUR €**, **GBP £**) dynamically updating rate cards and compensation brackets.

### 4. 🧠 Neural Particle Canvas & Interactive Hero
* Real-time HTML5 2D Canvas particle mesh with distance-based constellation rendering and cursor magnetic field attraction.
* Performance-optimized with `IntersectionObserver` to pause loop execution when scrolled out of viewport.

### 5. 🗺️ Enterprise Architecture Blueprint & Global Delivery Map
* Interactive architecture explorer comparing legacy monolith vulnerabilities with modern cloud-native Nexus architectures.
* Pan-India & global delivery hub coverage with live SLA guarantees.

### 6. 📱 Progressive Web App (PWA) & Offline Capabilities
* Fully responsive across mobile, tablet, and ultra-wide enterprise monitors.
* Integrated Service Worker (`sw.js`) and Web App Manifest (`manifest.json`) supporting fast offline asset caching.

---

## 🎨 Design System & Aesthetics

* **Color Palette**:
  * **Brand Cyber Green**: `#00C853` (Primary), `#00FF87` (Active Neon Accent)
  * **Cyan Glow**: `#60EFFF`
  * **Dark Glass Surfaces**: `#080C14` (Deep Canvas), `#0D1620` (Surface Elevated), `#151F33` (Card Glass)
* **Typography**:
  * **Headings**: `Plus Jakarta Sans`
  * **Body**: `Inter`
  * **Mono / Technical Metrics**: `Space Grotesk`
* **Micro-Interactions**:
  * Subtle card elevation with cyan/emerald ambient drop shadows
  * Touch targets conforming to accessibility standards (≥44px tap targets)

---

## 📁 Repository Structure

```plaintext
nexus-edge-sample/
├── .github/
│   └── workflows/
│       └── deploy.yml        # Automated GitHub Actions deployment workflow
├── assets/
│   ├── clients/              # Enterprise client vector logos (Tata, Infosys, Amazon...)
│   ├── logo.svg              # Pixel-accurate dark theme vector logo
│   ├── logo.png              # High-resolution retina PNG logo
│   └── logo-mark.svg         # Favicon and app icon mark
├── css/
│   └── styles.css            # Complete design tokens, components, and responsive styles
├── js/
│   └── app.js                # SPA routing, interactive timeline, ribbon accordion, salary engine
├── .gitignore                # Production ignore patterns for build & OS artifacts
├── index.html                # Single-page application structure & semantic layouts
├── manifest.json             # Web App Manifest for PWA installation
├── sw.js                     # Service Worker for offline asset caching
└── README.md                 # Project documentation
```

---

## 🛠️ Local Development & Setup

This repository is built using clean, zero-dependency modern web standards. No `npm install` or compilation step is required.

### 1. Clone the repository
```bash
git clone https://github.com/vkchang39/nexus-edge-sample.git
cd nexus-edge-sample
```

### 2. Run locally
You can serve the directory with any local HTTP server:

**Using Python:**
```bash
python -m http.server 3000
```

**Using Node.js (`npx serve`):**
```bash
npx serve .
```

**Using VS Code Live Server:**
Right-click on `index.html` and select **"Open with Live Server"**.

Open your browser at `http://localhost:3000`.

---

## 🚢 Deployment & CI/CD

The platform is configured with continuous deployment to **GitHub Pages**:

* **Automated Workflow**: Pushing to the `main` branch automatically triggers `.github/workflows/deploy.yml` which builds and deploys the latest version to GitHub Pages.
* **Manual Branch Deploy**: A dedicated `gh-pages` branch is also maintained for direct branch-based hosting.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
