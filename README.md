# SYSTEM MANUAL: PERSONAL PORTFOLIO 

> **Developer:** Carlos Miguel Cariño
> **Architecture:** Single-Page Application (SPA) | **Design Spec:** Cyber-HUD / Windows IDE Hybrid

---

## 1. Executive Summary

This project represents a high-performance, Full-Stack developer portfolio engineered to simulate a functional operating system interface. By eschewing heavy frameworks (React/Vue) in favor of **Vanilla JavaScript (ES6+)** and **native CSS3**, the application achieves sub-second load times and 60fps animations on low-power devices. The interface merges a retro-futuristic HUD with practical IDE aesthetics to present professional competencies in an immersive, data-driven environment.

---

## 2. Technical Architecture

### 2.1 File System Structure

The project adheres to a strict separation of concerns, isolating structural logic, styling, and behavior.

```bash
root/
├── 📂 assets/
│   ├── 📄 style.css       # Core styling, variables, and responsive grids
│   └── 📄 main.js         # Application logic (IIFE Module Pattern)
├── 📂 resume/
│   ├── 📄 cm.png          # Avatar / Identity asset
│   └── 📄 [cv_file].pdf   # Downloadable Resume
├── 📄 index.html          # Semantic DOM structure & entry point
└── 📄 README.md           # System documentation

```

### 2.2 Core Technology Stack

| Layer | Technology | Justification |
| --- | --- | --- |
| **Markup** | **HTML5** | Semantic structure for SEO and accessibility. |
| **Styling** | **CSS3 (Variables)** | Zero-build step customization via `:root` variables. |
| **Logic** | **Vanilla JS (ES6)** | Raw performance; utilizes `Module Pattern` for scope isolation. |
| **Icons** | **Lucide** | Lightweight SVG rendering with zero pixelation. |
| **Backend** | **EmailJS / GitHub API** | Serverless architecture for data and communication. |

---

## 3. Functional Modules

### 3.1 The "Zombie" Persistence Module

A custom storage handler that ensures user preferences and anti-spam locks persist across sessions.

* **Redundancy:** writes to `localStorage`, `sessionStorage`, and `document.cookie` simultaneously.
* **Self-Healing:** If one storage method is cleared by the user, the system reconstructs the data from the remaining sources on the next boot.

### 3.2 Dynamic GitHub Integration

The `Data.fetchGitHub()` module retrieves live repository statistics.

* **Priority Queue:** Repositories listed in `HIGHLIGHT_REPOS` are rendered first with a "LIVE" indicator.
* **Fail-Safe Protocol:** If the GitHub API rate limit is exceeded, the system seamlessly swaps to a hardcoded internal dataset, ensuring no UI breakage.

### 3.3 Interactive CLI (Command Line Interface)

A functional terminal emulator available on desktop and mobile.

* **History Navigation:** Supports `ArrowUp` / `ArrowDown` to cycle through previous commands.
* **Hidden Mechanics:** Includes easter eggs (`matrix`, `panic`) and system utilities (`ping`, `weather`).

---

## 4. ⚙️ Configuration & Setup

To deploy this system, you must configure the `CONFIG` object located at the top of `assets/main.js`.

### 4.1 Environment Variables

```javascript
const CONFIG = {
    // Target GitHub account for fetching repos
    GITHUB_USER: "carinokarlos", 

    // EmailJS Credentials (Required for Contact Form)
    EMAILJS: {
        KEY: "YOUR_PUBLIC_KEY",          // From Account Settings
        SERVICE: "YOUR_SERVICE_ID",      // From Email Services
        TEMPLATE_ADMIN: "template_admin_id", // To: You
        TEMPLATE_REPLY: "template_reply_id"  // To: Visitor (Auto-Reply)
    },

    // Repositories to pin to the top of the list
    HIGHLIGHT_REPOS: ["SmartFaq", "Esmile", "iWash", "Facundo"]
};

```

### 4.2 Installation

1. **Clone the Repository:**
```bash
git clone https://github.com/carinokarlos/my-site.git

```


2. **Local Testing:**
Open `index.html` directly in your browser or use a live server extension.
3. **Deployment:**
Push to GitHub and enable **GitHub Pages** in repository settings.

---

## 5. User Manual: Terminal Commands

Users can interact with the system via the CLI overlay. Below is a list of executable directives.

| Command | Arguments | Description |
| --- | --- | --- |
| `help` | - | Lists all available system commands. |
| `whoami` | - | Displays current user identity and session info. |
| `open` | `[section]` | Navigates to `work`, `about`, or `contact`. |
| `theme` | `blue/red/purple` | Hot-swaps the UI color palette instantly. |
| `ping` | `[address]` | Simulates network latency test. |
| `weather` | - | Fetches real-time weather for the user's location. |
| `game` | - | Launches the hidden "Hacker Run" ASCII game. |
| `matrix` | - | Toggles the digital rain background effect. |

---

## 6. Security & Anti-Spam

The contact module implements a **Client-Side Transmission Lock** to prevent abuse of the EmailJS quota.

1. **Trigger:** Upon successful message delivery.
2. **Action:** The submit button is disabled and labeled `UPLINK_LOCKED`.
3. **Duration:** A 30-minute cooldown timer is initiated.
4. **Persistence:** The lock persists even if the browser is closed or refreshed (via the Zombie Module).

---

### 7. Legal & Attribution

**Author:** Carlos Miguel Cariño
**Role:** Fullstack Developer

---
