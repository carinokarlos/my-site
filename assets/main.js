/**
 * =============================================================================
 * C.MIGUEL PORTFOLIO SYSTEM CORE
 * =============================================================================
 * Handles:
 * 1. Configuration & Global State
 * 2. Persistence (Zombie Storage)
 * 3. UI Manipulation (CLI, Scramble Effects)
 * 4. Data Fetching (GitHub API, Weather, Geolocation)
 * 5. Visuals (Matrix Rain, Canvas Game)
 * 6. Event Listeners (Navigation, CLI Interaction)
 * 7. Contact Form Logic (with Anti-Spam protection)
 * =============================================================================
 */

const System = (() => {

    /* ==========================================================================
       1. CONFIGURATION & STATE MANAGEMENT
       ========================================================================== */
    const CONFIG = {
        GITHUB_USER: "carinokarlos",
        EMAILJS: {
            KEY: "YWcE_pEySg9VCN6KU",
            SERVICE: "service_2fb81h6",
            TEMPLATE_ADMIN: "template_h0gz7ix",
            TEMPLATE_REPLY: "template_jqj3873"
        },
        // Repositories to highlight with a "LIVE" or "STAR" badge
        HIGHLIGHT_REPOS: ["Esmile", "iWash", "SmartFaq", "Facundo"]
    };

    // Mutable state for the application
    let state = {
        visitorLog: "",         // Stores IP/City for the contact form
        matrixActive: false,    // Is the matrix rain effect on?
        gameActive: false,      // Is the runner game active?
        geo: {                  // Default geolocation (Manila)
            lat: 14.5995, 
            long: 120.9842, 
            city: "Manila" 
        },
        history: [],            // CLI command history
        historyIndex: -1        // Current position in CLI history
    };

    /* ==========================================================================
       2. ZOMBIE STORAGE MODULE 
       (Redundant persistence across LocalStorage, Session, and Cookies)
       ========================================================================== */
    const Zombie = {
        key: "sys_config_x86",

        /**
         * Saves a flag to all storage mechanisms.
         * Used to remember if the user has seen the boot intro.
         */
        save: function() {
            const val = "true";
            try {
                localStorage.setItem(this.key, val);
                sessionStorage.setItem(this.key, val);
                document.cookie = `${this.key}=${val}; path=/; max-age=31536000`; // 1 Year
            } catch (e) {
                console.warn("Storage access blocked/failed");
            }
        },

        /**
         * Checks if the user has visited before.
         * Includes self-repair logic: if one storage is wiped, it restores from others.
         * @returns {boolean} True if user is returning.
         */
        check: function() {
            const inLocal = localStorage.getItem(this.key);
            const inSession = sessionStorage.getItem(this.key);
            const inCookie = document.cookie.includes(`${this.key}=true`);

            if (inLocal || inSession || inCookie) {
                // Self-Repair: Restore missing keys
                if (!inLocal) localStorage.setItem(this.key, "true");
                if (!inSession) sessionStorage.setItem(this.key, "true");
                if (!inCookie) document.cookie = `${this.key}=true; path=/; max-age=31536000`;
                return true;
            }
            return false;
        }
    };

    /* ==========================================================================
       3. UI UTILITIES MODULE
       ========================================================================== */
    const UI = {
        /**
         * Appends a line of text to the CLI output window.
         * @param {string} text - The HTML content to print.
         * @param {string} type - CSS class for styling (e.g., 'cli-error').
         */
        printLine: (text, type = "") => {
            const out = document.getElementById('cliOutput');
            const line = document.createElement('div');
            line.className = `cli-line ${type}`;
            line.innerHTML = text; 
            out.appendChild(line);
            out.scrollTop = out.scrollHeight; // Auto-scroll to bottom
        },

        /**
         * Creates a "Hacker" text scrambling effect on an element.
         * @param {string} elementId - The ID of the DOM element.
         * @param {string} finalValue - The text to reveal.
         */
        scrambleText: (elementId, finalValue) => {
            const el = document.getElementById(elementId);
            if (!el) return;
            
            const chars = "¡¢£¤¥¦§¨©ª«¬®¯°±²³´µ¶·";
            let frame = 0;
            
            const animate = () => {
                if (frame >= finalValue.length) {
                    // Special HTML handling for the Hero Title
                    if(elementId === 'heroTitle') {
                        el.innerHTML = `CARLOS<br><span style="color:var(--fg); opacity:0.8;">MIGUEL</span>`;
                    } else {
                        el.innerText = finalValue;
                    }
                    return;
                }
                
                el.innerHTML = finalValue.split("").map((char, i) => {
                    if (char === "<" || char === ">") return char; // Skip HTML tags
                    if (i < frame) return char;
                    return chars[Math.floor(Math.random() * chars.length)];
                }).join("");
                
                frame += 1/3; // Speed of reveal
                requestAnimationFrame(animate);
            };
            animate();
        }
    };

    /* ==========================================================================
       4. DATA & API MODULE
       ========================================================================== */
    const Data = {
        /**
         * Initializes clocks, uptime counters, and fetches Geolocation.
         */
        initVitals: () => {
            const startTime = new Date('2024-01-01T00:00:00'); // Portfolio Launch Date
            
            // 1. Clock & Uptime Interval
            setInterval(() => {
                const now = new Date();
                
                // Update Nav Clock
                const navClock = document.getElementById('navClock');
                if (navClock) navClock.innerText = now.toLocaleTimeString('en-GB');
                
                // Update Uptime Counter (if present)
                const uptimeEl = document.getElementById('uptime-counter');
                if (uptimeEl) {
                    const diff = now - startTime;
                    const d = Math.floor(diff / 86400000).toString().padStart(3, '0');
                    const h = Math.floor((diff / 3600000) % 24).toString().padStart(2, '0');
                    const m = Math.floor((diff / 60000) % 60).toString().padStart(2, '0');
                    const s = Math.floor((diff / 1000) % 60).toString().padStart(2, '0');
                    uptimeEl.innerText = `${d}:${h}:${m}:${s}`;
                }
            }, 1000);

            // 2. Simulated Network Latency
            setInterval(() => {
                const latencyEl = document.getElementById('latency');
                if (latencyEl) {
                    const ping = Math.floor(Math.random() * 15) + 18; // Random 18-33ms
                    latencyEl.innerText = `${ping}ms`;
                }
            }, 3000);

            // 3. Geolocation Fetching (IPAPI)
            const locTag = document.getElementById('locationTag');
            fetch('https://ipapi.co/json/')
                .then(res => {
                    if (!res.ok) throw new Error('Blocked');
                    return res.json();
                })
                .then(data => {
                    if(locTag) locTag.innerText = `GPS: ${data.latitude}°N, ${data.longitude}°E`;
                    state.visitorLog = `CITY: ${data.city} | IP: ${data.ip}`;
                    state.geo = { lat: data.latitude, long: data.longitude, city: data.city };
                })
                .catch(() => {
                    // Fallback if AdBlocker blocks the API
                    if(locTag) locTag.innerText = `GPS: 14.5995°N, 120.9842°E`;
                    state.visitorLog = "CITY: MANILA // LOCALHOST DETECTED";
                });
        },

        /**
         * Fetches Repositories from GitHub API.
         * Falls back to hardcoded data if API rate limit is reached.
         */
        fetchGitHub: async () => {
            const feed = document.getElementById('githubFeed');
            if (!feed) return;
            
            // Hardcoded backup data
            const fallbackData = [
                { name: "SmartFaq", html_url: "https://github.com/carinokarlos/SmartFaq", description: "Lightweight Electron-based app for creating and managing FAQs.", language: "JavaScript", stargazers_count: 1, forks_count: 0 },
                { name: "Esmile", html_url: "https://github.com/carinokarlos/Esmile", description: "Dental Appointment System - 3rd Year Capstone Project.", language: "HTML", stargazers_count: 1, forks_count: 0 },
                { name: "iWash", html_url: "https://github.com/carinokarlos/iWash", description: "Self-Service Car Wash System for 1 Elite Automotive - 4th Year Capstone.", language: "PHP", stargazers_count: 1, forks_count: 0 },
                { name: "Facundo", html_url: "https://github.com/carinokarlos/Facundo", description: "Automotive Ecommerce Platform.", language: "PHP", stargazers_count: 1, forks_count: 0 }
            ];

            const renderRepos = (list) => {
                feed.innerHTML = ''; 
                list.slice(0, 6).forEach(repo => {
                    const desc = repo.description || 'System module. Access restricted.';
                    const truncDesc = desc.length > 80 ? desc.substring(0, 77) + '...' : desc;
                    
                    // Determine Status Badge
                    let badge = '<span class="p-status" style="border-color:#666; color:#666;">IDLE</span>';
                    if (CONFIG.HIGHLIGHT_REPOS.some(h => repo.name.toLowerCase().includes(h.toLowerCase()))) {
                        badge = '<span class="p-status pulse">● LIVE</span>';
                    } else if (repo.stargazers_count > 0) {
                        badge = '<span class="p-status" style="border-color:#fbbf24; color:#fbbf24;">★ STAR</span>';
                    }

                    // Render Card HTML
                    const html = `
                        <a href="${repo.html_url}" target="_blank" class="project-row revealed">
                            <div class="p-header">
                                <span class="p-name">/${repo.name.toUpperCase()}</span>
                                ${badge}
                            </div>
                            <div class="p-body">
                                <p class="p-desc">${truncDesc}</p>
                            </div>
                            <div class="p-footer">
                                <div style="display:flex; align-items:center;">
                                    <span class="p-lang-dot"></span>
                                    <span style="color: #fff;">${(repo.language || "SHELL").toUpperCase()}</span>
                                </div>
                                <div class="p-stats">
                                    <span><i data-lucide="star"></i> ${repo.stargazers_count}</span>
                                    <span><i data-lucide="git-fork"></i> ${repo.forks_count}</span>
                                </div>
                            </div>
                            <div class="integrity-box"></div>
                        </a>`;
                    feed.insertAdjacentHTML('beforeend', html);
                });
                
                // Re-initialize icons after DOM injection
                if (typeof lucide !== 'undefined') lucide.createIcons();
            };

            try {
                // Fetch All Repos + Starred Repos
                const [reposRes, starredRes] = await Promise.all([
                    fetch(`https://api.github.com/users/${CONFIG.GITHUB_USER}/repos?sort=updated&per_page=100`),
                    fetch(`https://api.github.com/users/${CONFIG.GITHUB_USER}/starred?per_page=10`)
                ]);
                
                if (!reposRes.ok) throw new Error("GitHub API Limit/Block");
                
                const repos = await reposRes.json();
                const starred = await starredRes.json();
                
                // Prioritize Highlighted Repos
                const masterMap = new Map();
                repos.forEach(r => { if (CONFIG.HIGHLIGHT_REPOS.some(h => r.name.toLowerCase() === h.toLowerCase())) masterMap.set(r.id, r); });
                if (Array.isArray(starred)) starred.forEach(r => { if (!masterMap.has(r.id)) masterMap.set(r.id, r); });
                repos.forEach(r => { if (!masterMap.has(r.id)) masterMap.set(r.id, r); });
                
                const finalQueue = Array.from(masterMap.values());
                if (finalQueue.length === 0) throw new Error("No Repos Found");
                
                renderRepos(finalQueue);
            } catch (e) {
                renderRepos(fallbackData);
            }
        }
    };

    /* ==========================================================================
       5. VISUAL EFFECTS MODULE
       ========================================================================== */
    const Visuals = {
        /**
         * Renders the Matrix Digital Rain effect on the background canvas.
         */
        toggleMatrix: () => {
            const cvs = document.getElementById('particleCanvas');
            const ctx = cvs.getContext('2d');
            
            // Allow toggling off by reloading page (simplest cleanup)
            if (state.matrixActive) { location.reload(); return; }
            
            state.matrixActive = true;
            cvs.width = window.innerWidth;
            cvs.height = window.innerHeight;
            
            const fontSize = 14;
            const cols = cvs.width / fontSize;
            const drops = Array(Math.floor(cols)).fill(1);
            let lastTime = 0;

            const draw = (timestamp) => {
                if (!state.matrixActive) return;
                if (timestamp - lastTime < 75) { requestAnimationFrame(draw); return; } // Throttle FPS
                lastTime = timestamp;

                // Fading trail effect
                ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
                ctx.fillRect(0, 0, cvs.width, cvs.height);
                
                ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--accent');
                ctx.font = `${fontSize}px Space Mono`;
                
                drops.forEach((y, i) => {
                    const char = String.fromCharCode(Math.random() * 128);
                    ctx.fillText(char, i * fontSize, y * fontSize);
                    
                    // Randomly reset drops to top
                    if (y * fontSize > cvs.height && Math.random() > 0.975) drops[i] = 0;
                    drops[i]++;
                });
                requestAnimationFrame(draw);
            };
            requestAnimationFrame(draw);
        },
        
        /**
         * A simple hidden dinosaur-style runner game inside the CLI.
         */
        runGame: () => {
            if (state.gameActive) return;
            state.gameActive = true;
            
            const area = document.getElementById('gameArea');
            const out = document.getElementById('cliOutput');
            const gameScreen = document.getElementById('gameScreen');
            const scoreBoard = document.getElementById('scoreBoard');
            
            out.style.display = 'none';
            area.style.display = 'block';
            
            let pY = 0; // Player Y Position (0=ground, 1=air)
            let obsPos = 28; // Obstacle X Position
            let score = 0;
            let lastTime = 0;

            const jumpListener = (e) => {
                if (e.code === 'Space' && state.gameActive) {
                    e.preventDefault();
                    if(pY === 0) { pY = 1; setTimeout(() => pY = 0, 400); }
                }
            };
            document.addEventListener('keydown', jumpListener);

            const loop = (timestamp) => {
                if (!state.gameActive) return;
                if (timestamp - lastTime < 80) { requestAnimationFrame(loop); return; }
                lastTime = timestamp;

                score++; 
                obsPos--;
                if (obsPos < 0) obsPos = 28; // Reset obstacle
                
                scoreBoard.innerText = `SCORE: ${score.toString().padStart(3, '0')}`;
                
                // Render ASCII Graphics
                let sky = "", ground = "";
                for (let i = 0; i < 30; i++) {
                    ground += (i === obsPos) ? "█" : (i === 3 && pY === 0) ? "웃" : "_";
                    sky += (i === 3 && pY === 1) ? "웃" : " ";
                }
                gameScreen.innerText = `${sky}\n${ground}`;

                // Collision Detection (Pos 3 is player X)
                if (obsPos === 3 && pY === 0) {
                    state.gameActive = false;
                    gameScreen.innerText += "\n\n>> SYSTEM_CRASH.";
                    document.removeEventListener('keydown', jumpListener);
                    setTimeout(() => {
                        area.style.display = 'none';
                        out.style.display = 'flex';
                        UI.printLine(`>> GAME_OVER. SCORE: ${score}`);
                    }, 2000);
                } else { 
                    requestAnimationFrame(loop); 
                }
            };
            requestAnimationFrame(loop);
        }
    };

    /* ==========================================================================
       6. EVENT LISTENERS & LOGIC MODULE
       ========================================================================== */
    const initEvents = () => {
        
        // --- MOBILE MENU ---
        const menuBtn = document.getElementById('menuBtn');
        const mobileMenu = document.getElementById('mobileMenu');
        
        if (menuBtn && mobileMenu) {
            menuBtn.addEventListener('click', () => {
                mobileMenu.classList.toggle('active');
                menuBtn.innerText = mobileMenu.classList.contains('active') ? '[ CLOSE ]' : '[ MENU ]';
            });
            
            document.querySelectorAll('.mobile-link').forEach(l => {
                l.addEventListener('click', () => { 
                    mobileMenu.classList.remove('active'); 
                    menuBtn.innerText = '[ MENU ]'; 
                });
            });
        }

        // --- SMART SCROLL-TO-TOP (ASCENT BUTTON) ---
        const scrollTopBtn = document.getElementById('scrollTopBtn');
        if (scrollTopBtn) {
            scrollTopBtn.addEventListener('click', (e) => {
                e.preventDefault();
                
                // If Mobile (<= 900px): Scroll to absolute top of the window
                if (window.innerWidth <= 900) {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                } 
                // If Desktop (> 900px): Scroll to Work Section (#work)
                else {
                    const targetEl = document.getElementById('work');
                    if (targetEl) {
                        targetEl.scrollIntoView({ behavior: 'smooth' });
                    }
                }
            });
        }

        // --- CLI (TERMINAL) INTERACTIONS ---
        const cliContainer = document.getElementById('cliContainer');
        const cliInput = document.getElementById('cliInput');
        const cliOutput = document.getElementById('cliOutput');

        // Toggle CLI
        document.getElementById('cliTrigger').addEventListener('click', () => {
            cliContainer.style.display = 'flex';
            setTimeout(() => cliInput.focus(), 50);
        });
        document.getElementById('explicitExit').addEventListener('click', () => {
            cliContainer.style.display = 'none';
        });

        // --- GLOBAL SHORTCUT: Toggle Terminal with Backtick (`) ---
        document.addEventListener('keydown', (e) => {
            // Check for Backtick key (`)
            if (e.key === '`') {
                e.preventDefault(); // Stop the character ` from being typed
                
                if (cliContainer.style.display === 'flex') {
                    // Close if open
                    cliContainer.style.display = 'none';
                } else {
                    // Open if closed
                    cliContainer.style.display = 'flex';
                    setTimeout(() => cliInput.focus(), 50);
                }
            }
            
            // Optional: Close with ESC key
            if (e.key === 'Escape' && cliContainer.style.display === 'flex') {
                cliContainer.style.display = 'none';
            }
        });

        // CLI Key Handling
        cliInput.addEventListener('keydown', async (e) => {
            // History Navigation (Arrow Up/Down)
            if (e.key === 'ArrowUp') {
                e.preventDefault();
                if (state.history.length > 0) {
                    if (state.historyIndex === -1) state.historyIndex = state.history.length;
                    if (state.historyIndex > 0) state.historyIndex--;
                    cliInput.value = state.history[state.historyIndex];
                }
            } else if (e.key === 'ArrowDown') {
                e.preventDefault();
                if (state.history.length > 0 && state.historyIndex < state.history.length - 1) {
                    state.historyIndex++;
                    cliInput.value = state.history[state.historyIndex];
                } else {
                    state.historyIndex = state.history.length;
                    cliInput.value = '';
                }
            }

            // Command Execution (Enter)
            if (e.key === 'Enter') {
                const raw = cliInput.value;
                if (!raw.trim()) return;
                
                state.history.push(raw);
                state.historyIndex = -1; // Reset history position

                const args = raw.trim().split(' ');
                const cmd = args[0].toLowerCase();
                const arg1 = args[1] ? args[1].toLowerCase() : null;
                
                cliInput.value = '';
                UI.printLine(`CM:\\admin\\carinokarlos> ${raw}`, 'prompt-text');

                // Command Switch Statement
                switch (cmd) {
                    case 'help':
                        UI.printLine(`<div class="cli-grid">
                            <span>HELP</span> <span>List all commands</span>
                            <span>CLEAR / CLS</span> <span>Clear terminal buffer</span>
                            <span>WHOAMI</span> <span>Identify user</span>
                            <span>ASCII</span> <span>Display system logo</span>
                            <span>LS</span> <span>List directory files</span>
                            <span>OPEN [file]</span> <span>Nav: about, work, contact</span>
                            <span>SYS</span> <span>Display system specs</span>
                            <span>IP / LOCATE</span> <span>Trace network origin</span>
                            <span>WEATHER</span> <span>Local atmospheric scan</span>
                            <span>SOCIALS</span> <span>Establish comms uplink</span>
                            <span>CV / RESUME</span> <span>Download personnel file</span>
                            <span>THEME [clr]</span> <span>Set: red, blue, purple</span>
                            <span>PING [addr]</span> <span>Test network latency</span>
                            <span>CALC [eq]</span> <span>Calculate (e.g. 5*5)</span>
                            <span>HACK [trgt]</span> <span>Run brute force sim</span>
                            <span>MATRIX</span> <span>Toggle visualizer</span>
                            <span>GAME</span> <span>Execute 'Hacker Run'</span>
                            <span>PANIC</span> <span>Trigger kernel error</span>
                            <span>REBOOT</span> <span>Restart system</span>
                            <span>EXIT</span> <span>Terminate session</span>
                        </div>`);
                        break;

                    case 'clear':
                    case 'cls':
                        cliOutput.innerHTML = '';
                        break;

                    case 'whoami':
                        UI.printLine(`> Carlos Miguel Cariño`);
                        UI.printLine(`> Fullstack Engineer | BSIT Student`);
                        break;
                    
                    case 'ascii':
                        UI.printLine(`
                            <pre style="font-size:0.7rem; color:var(--accent)">
██████╗███╗   ███╗
██╔════╝████╗ ████║
██║     ██╔████╔██║
██║     ██║╚██╔╝██║
╚██████╗██║ ╚═╝ ██║
╚═════╝╚═╝     ╚═╝
                            </pre>
                        `);
                        break;
                        
                    case 'ping':
                        const host = arg1 || "127.0.0.1";
                        UI.printLine(`>> PING ${host} (32 bytes):`);
                        let pings = 0;
                        const pingInt = setInterval(() => {
                            const time = Math.floor(Math.random() * 40) + 10;
                            UI.printLine(`Reply from ${host}: bytes=32 time=${time}ms TTL=54`);
                            pings++;
                            if(pings >= 4) {
                                clearInterval(pingInt);
                                UI.printLine(`>> Ping statistics for ${host}: Packets: Sent = 4, Received = 4, Loss = 0%`);
                            }
                        }, 500);
                        break;
                        
                    case 'calc':
                        try {
                            if (!args[1]) { UI.printLine("Usage: calc [expression] (e.g. calc 5+5)", 'cli-error'); break; }
                            const expr = args.slice(1).join(''); 
                            // Simple validation to prevent code injection
                            if (/[^0-9+\-*/().]/.test(expr)) throw new Error("Invalid characters");
                            const res = new Function('return ' + expr)();
                            UI.printLine(`>> RESULT: ${res}`);
                        } catch (e) {
                            UI.printLine(`>> MATH_ERROR: ${e.message}`, 'cli-error');
                        }
                        break;

                    case 'panic':
                        UI.printLine("KERNEL PANIC: VFS: Unable to mount root fs on unknown-block(0,0)", 'cli-error');
                        UI.printLine("CPU: 0 PID: 1 Comm: init Not tainted 4.1.2 #1", 'cli-error');
                        setTimeout(() => {
                            document.body.innerHTML = "<div style='background:#0000aa;color:white;height:100vh;padding:50px;font-family:monospace;display:flex;flex-direction:column;justify-content:center;align-items:center;font-size:1.5rem;'><span>:(</span><br><br>Your PC ran into a problem and needs to restart.<br>Error Code: CRITICAL_PROCESS_DIED</div>";
                            setTimeout(() => location.reload(), 4000);
                        }, 1500);
                        break;

                    case 'sys':
                    case 'neofetch':
                        UI.printLine(`
                            <div style="color:var(--accent); margin-top:5px;">
                            ██████████████   USER: visitor@guest<br>
                            ██████████████   OS: ${navigator.platform}<br>
                            ██████████████   RES: ${window.screen.width}x${window.screen.height}<br>
                            ██████████████   CORES: ${navigator.hardwareConcurrency || 4}<br>
                            ██████████████   BROWSER: ${navigator.userAgent.split(')')[0]})}<br>
                            </div>
                        `);
                        break;

                    case 'weather':
                        UI.printLine(`>> SCANNING ATMOSPHERE AT [${state.geo.lat.toFixed(2)}, ${state.geo.long.toFixed(2)}]...`);
                        try {
                            const wRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${state.geo.lat}&longitude=${state.geo.long}&current_weather=true`);
                            const wData = await wRes.json();
                            UI.printLine(`>> LOC: ${state.geo.city.toUpperCase()}`);
                            UI.printLine(`>> TEMP: ${wData.current_weather.temperature}°C`);
                            UI.printLine(`>> WIND: ${wData.current_weather.windspeed} km/h`);
                        } catch(err) {
                            UI.printLine(`>> ERROR: SENSOR_OFFLINE.`);
                        }
                        break;

                    case 'hack':
                        const target = arg1 || "MAINFRAME";
                        UI.printLine(`>> INITIATING BRUTE FORCE ON [${target.toUpperCase()}]...`);
                        let steps = 0;
                        const hackInterval = setInterval(() => {
                            const hex = Math.random().toString(16).substr(2, 8);
                            UI.printLine(`> KEY_ATTEMPT: 0x${hex}... FAIL`);
                            steps++;
                            if(steps > 5) {
                                clearInterval(hackInterval);
                                if(Math.random() > 0.3) {
                                    UI.printLine(`>> ACCESS GRANTED. ROOT PRIVILEGES ACQUIRED.`, 'p-status pulse');
                                } else {
                                    UI.printLine(`>> ACCESS DENIED. FIREWALL TRIGGERED.`, 'cli-error');
                                }
                            }
                        }, 400);
                        break;

                    case 'ls':
                        UI.printLine(`<span style="color:var(--accent)">about.txt</span>`);
                        UI.printLine(`<span style="color:var(--accent)">work.json</span>`);
                        UI.printLine(`<span style="color:var(--accent)">contact.exe</span>`);
                        break;

                    case 'socials':
                    case 'connect':
                        UI.printLine(">> ESTABLISHING_LINK_CHANNELS:");
                        UI.printLine(" - <a href='https://github.com/carinokarlos' target='_blank' style='color:#fff'>GITHUB</a>");
                        UI.printLine(" - <a href='https://linkedin.com/in/carlos-miguel-cari%C3%B1o-492430253/' target='_blank' style='color:#fff'>LINKEDIN</a>");
                        UI.printLine(" - <a href='mailto:miguel.carlosc27@gmail.com' style='color:#fff'>EMAIL_UPLINK</a>");
                        break;

                    case 'ip':
                    case 'locate':
                        UI.printLine(">> SCANNING_NETWORK_NODE...");
                        UI.printLine(`>> CLIENT_DATA: ${state.visitorLog || "UNKNOWN_ORIGIN"}`, 'cli-success');
                        break;

                    case 'cv':
                    case 'resume':
                        UI.printLine(">> RETRIEVING_SECURE_FILE...");
                        setTimeout(() => {
                            const link = document.createElement('a');
                            link.href = 'resume/Carlos-Miguel-Angeles-Carino.pdf';
                            link.download = 'Carlos-Miguel-Angeles-Carino.pdf';
                            document.body.appendChild(link);
                            link.click();
                            document.body.removeChild(link);
                            UI.printLine(">> DOWNLOAD_INITIATED.", 'p-status pulse');
                        }, 800);
                        break;

                    case 'open':
                        if (!arg1) { UI.printLine("Usage: open [filename]", 'cli-error'); return; }
                        const targets = { 'about': 'about', 'work': 'work', 'contact': 'contact' };
                        const targetId = Object.keys(targets).find(k => arg1.includes(k));
                        if (targetId) {
                            document.getElementById(targets[targetId]).scrollIntoView({behavior: 'smooth'});
                            UI.printLine(`>> Opening ${targetId}...`);
                            if(window.innerWidth < 768) cliContainer.style.display = 'none';
                        } else {
                            UI.printLine(`File '${arg1}' not found.`, 'cli-error');
                        }
                        break;

                    case 'theme':
                        const root = document.documentElement;
                        const themes = {
                            'blue': { accent: '#3b82f6', name: 'CYAN_PROTOCOL' },
                            'red': { accent: '#ef4444', name: 'RED_ALERT' },
                            'purple': { accent: '#a855f7', name: 'NEON_PURPLE' }
                        };
                        
                        if (themes[arg1]) {
                            root.style.setProperty('--accent', themes[arg1].accent);
                            root.style.setProperty('--phosphor', themes[arg1].accent);
                            UI.printLine(`>> Theme set to: ${themes[arg1].name}`);
                        } else {
                            // Default Green
                            root.style.setProperty('--accent', '#33ff33');
                            root.style.setProperty('--phosphor', '#33ff33');
                            UI.printLine(">> Theme set to: STANDARD_GREEN");
                        }
                        break;

                    case 'matrix':
                        UI.printLine('>> INITIATING_OVERRIDE...');
                        Visuals.toggleMatrix();
                        break;

                    case 'game':
                        Visuals.runGame();
                        break;

                    case 'exit':
                        cliContainer.style.display = 'none';
                        break;

                    case 'reboot':
                        UI.printLine(">> SYSTEM REBOOT INITIATED...");
                        setTimeout(() => location.reload(), 1500);
                        break;

                    default:
                        if(cmd) UI.printLine(`Command not found: ${cmd}. Type 'help'.`, 'cli-error');
                }
            }
        });

        /* ============================================================
           7. CONTACT FORM & ANTI-SPAM "ZOMBIE LOCK"
           ============================================================ */
        const form = document.getElementById('contactForm');
        const btn = document.getElementById('submitBtn');

        // Helper: Find the latest lock timestamp from LocalStorage, Session, or Cookie
        const getLockTime = () => {
            const local = localStorage.getItem('tx_lock');
            const session = sessionStorage.getItem('tx_lock');
            const cookie = document.cookie.split('; ').find(row => row.startsWith('tx_lock='));
            const cookieVal = cookie ? cookie.split('=')[1] : null;

            return Math.max(Number(local || 0), Number(session || 0), Number(cookieVal || 0));
        };

        // Helper: Save the lock timestamp to ALL storage methods (Redundancy)
        const setLockTime = (timestamp) => {
            localStorage.setItem('tx_lock', timestamp);
            sessionStorage.setItem('tx_lock', timestamp);
            document.cookie = `tx_lock=${timestamp}; path=/; max-age=1800`; // 30 Mins
        };

        // Initial Check: Is the user currently locked out?
        const activeLock = getLockTime();
        if (activeLock && Date.now() < activeLock) {
            btn.disabled = true;
            btn.innerText = "UPLINK_LOCKED";
            
            // Self-Healing: If localStorage was wiped but cookie exists, restore localStorage
            if (!localStorage.getItem('tx_lock')) {
                console.log(">> SYSTEM: RESTORING_DELETED_LOCK");
                setLockTime(activeLock);
            }
        }

        // Form Submit Handler
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Double Check Lock before sending
            const currentLock = getLockTime();
            if (currentLock && Date.now() < currentLock) {
                alert(">> ERROR: TRANSMISSION LINK COOLED DOWN. PLEASE WAIT.");
                return;
            }

            btn.disabled = true;
            btn.innerText = "TRANSMITTING...";

            const params = {
                user_name: document.getElementById('user_name').value,
                user_email: document.getElementById('user_email').value,
                message: document.getElementById('message').value,
                visitor_log: state.visitorLog,
                timestamp: new Date().toLocaleString()
            };

            emailjs.send(CONFIG.EMAILJS.SERVICE, CONFIG.EMAILJS.TEMPLATE_ADMIN, params)
            .then(() => {
                // Success UI
                document.getElementById('successOverlay').classList.add('active');
                form.reset();

                // Activate 30 Minute Lock
                const unlockTime = Date.now() + 1800000; 
                setLockTime(unlockTime);

                setTimeout(() => document.getElementById('successOverlay').classList.remove('active'), 3000);
                btn.innerText = "UPLINK_LOCKED";
                
                // Auto-Reply Email
                emailjs.send(CONFIG.EMAILJS.SERVICE, CONFIG.EMAILJS.TEMPLATE_REPLY, params).catch(()=>{});
            })
            .catch((err) => {
                console.error(err);
                btn.innerText = "ERROR_RETRY";
                btn.disabled = false;
            });
        });
    };

    /* ==========================================================================
       8. INITIALIZATION EXPORT
       ========================================================================== */
    return {
        init: () => {
            // Initialize Libraries
            if (typeof lucide !== 'undefined') lucide.createIcons();
            if (typeof emailjs !== 'undefined') emailjs.init(CONFIG.EMAILJS.KEY);
            
            // Start Modules
            Data.initVitals();
            Data.fetchGitHub();
            initEvents();

            // Zombie Boot Check: Skip intro animation if user has visited before
            if (Zombie.check()) {
                console.log(">> SYSTEM: RESTORING_SESSION");
                document.querySelectorAll('.boot-hidden').forEach(el => el.classList.add('boot-visible'));
                const hero = document.getElementById('heroTitle');
                if(hero) hero.innerHTML = `CARLOS<br><span style="color:var(--fg); opacity:0.8;">MIGUEL</span>`;
            } else {
                console.log(">> SYSTEM: NEW_CONNECTION");
                setTimeout(() => {
                    document.querySelectorAll('.boot-hidden').forEach(el => el.classList.add('boot-visible'));
                    UI.scrambleText('heroTitle', 'CARLOS MIGUEL');
                    Zombie.save(); // Mark as visited
                }, 300);
            }
        }
    };
})();

// Start the System
document.addEventListener('DOMContentLoaded', System.init);
