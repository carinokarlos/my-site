# Project Documentation: Personal Portfolio
**Operator:** Carlos Miguel Cariño | **Theme:** Cyber-HUD / IDE Hybrid

### 1. Executive Summary

This project is a high-performance personal developer portfolio engineered to demonstrate full-stack competencies through a distinct visual language. The interface merges retro-futuristic HUD elements with a Windows-style IDE profile viewer, creating an immersive, data-driven user experience. Built entirely on Vanilla JavaScript, the application prioritizes raw performance, zero-dependency architecture, and native CSS3 animations over heavy frontend frameworks.

### 2. Technical Architecture

#### 2.1 Frontend Composition

The application utilizes a split-pane layout architecture to organize content hierarchy effectively:

* **Semantic HTML5:** Ensures accessibility and structural integrity.
* **Advanced CSS3:** Utilizes CSS Variables (Custom Properties), Grid/Flexbox layouts, and Glassmorphism effects for a modern aesthetic without pre-processors.
* **Typography:**
* *Orbitron:* Employed for structural headers and UI controls.
* *Space Mono:* Used for code blocks, terminal outputs, and data visualization.


* **Vector Graphics:** Integrated **Lucide Icons** for lightweight, scalable interface elements.

#### 2.2 Dynamic Modules

* **GitHub API Integration:** A custom fetch module retrieves live repository data. It features a robust **Fail-Safe Protocol** that automatically switches to a hardcoded data fallback if the GitHub API encounters rate limits or network blockages, ensuring content availability.
* **Command Line Interface (CLI):** A functional terminal emulator embedded in the footer. It parses user input to execute system commands (`help`, `clear`, `matrix`) and launches interactive easter eggs.
* **Secure Communication Relay:** A dual-channel messaging system powered by **EmailJS**, capable of dispatching administrative notifications and automated receipt confirmations simultaneously.

### 3. Configuration & Deployment

To deploy this environment, the `CONFIG` object within the primary script must be initialized with valid credentials.

#### 3.1 Environment Configuration

Navigate to the `System` module in `index.html` and populate the following keys:

```javascript
const CONFIG = {
    GITHUB_USER: "carinokarlos", // Target GitHub Username
    
    // EmailJS Configuration
    EMAILJS: {
        KEY: "YOUR_PUBLIC_KEY",      // Public API Key
        SERVICE: "YOUR_SERVICE_ID",  // Email Service ID
        TEMPLATE_ADMIN: "YOUR_ADMIN_TEMPLATE", // Admin Notification Template ID
        TEMPLATE_REPLY: "YOUR_REPLY_TEMPLATE"  // User Auto-Reply Template ID
    },

    // Repository Prioritization (Case-Insensitive Partial Match)
    HIGHLIGHT_REPOS: ["SmartFaq", "Esmile", "iWash", "Facundo"]
};

```

#### 3.2 Template Variable Mapping

Ensure your EmailJS templates are configured to accept the following payload variables:

* `{{user_name}}`: Sender's full name.
* `{{user_email}}`: Sender's contact address.
* `{{message}}`: Body of the inquiry.

### 4. Functional Specifications

#### 🛡️ Spam Mitigation & Rate Limiting

The contact module implements a client-side locking mechanism using `localStorage`. Upon a successful transmission, the interface enforces a **30-minute cooldown period**, preventing automated scripts from exhausting the EmailJS API quota.

#### 🎮 Interactive CLI & Mini-Games

The embedded terminal allows for user interaction beyond standard navigation. Executing the `game` command initializes **"Hacker Run"**, an ASCII-based endless runner game rendered directly in the DOM without canvas dependencies.

#### 📡 Real-Time Telemetry

* **Uptime Monitor:** Tracks session duration since system initialization.
* **Network Latency:** Simulates server response times to enhance the technical atmosphere.

### 5. Legal & Attribution

**Author:** Carlos Miguel Cariño
**Role:** Fullstack Developer
**Copyright:** © 2026 Carlos Miguel Cariño. All Rights Reserved.

*This source code is provided for portfolio demonstration purposes. Unauthorized commercial redistribution or modification is prohibited.*
