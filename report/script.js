document.addEventListener("DOMContentLoaded", () => {
    // 1. Theme Configuration
    const currentTheme = localStorage.getItem("theme") || "light";
    document.documentElement.setAttribute("data-theme", currentTheme);
    updateThemeIcon(currentTheme);

    // 2. Dynamic Sidebar Generation
    const sidebarHtml = `
        <div class="sidebar-header">
            <div class="sidebar-title">E-Commerce Portal</div>
            <div class="sidebar-subtitle">MCA Mini Project Report</div>
        </div>
        <ul class="nav-list">
            <li class="nav-item" data-page="index.html"><a href="index.html"><span class="nav-item-num">0</span>Cover Page</a></li>
            <li class="nav-item" data-page="chapter1.html"><a href="chapter1.html"><span class="nav-item-num">1</span>Introduction</a></li>
            <li class="nav-item" data-page="chapter2.html"><a href="chapter2.html"><span class="nav-item-num">2</span>Project Plan</a></li>
            <li class="nav-item" data-page="chapter3.html"><a href="chapter3.html"><span class="nav-item-num">3</span>SRS Document</a></li>
            <li class="nav-item" data-page="chapter4.html"><a href="chapter4.html"><span class="nav-item-num">4</span>System Analysis</a></li>
            <li class="nav-item" data-page="chapter5.html"><a href="chapter5.html"><span class="nav-item-num">5</span>System Design</a></li>
            <li class="nav-item" data-page="chapter6.html"><a href="chapter6.html"><span class="nav-item-num">6</span>Source Code</a></li>
            <li class="nav-item" data-page="chapter7.html"><a href="chapter7.html"><span class="nav-item-num">7</span>System Testing</a></li>
            <li class="nav-item" data-page="chapter8.html"><a href="chapter8.html"><span class="nav-item-num">8</span>Implementation</a></li>
            <li class="nav-item" data-page="chapter9.html"><a href="chapter9.html"><span class="nav-item-num">9</span>Future Plans</a></li>
        </ul>
        <div class="sidebar-footer">
            <button class="theme-btn" id="themeToggleBtn" title="Toggle Light/Dark Mode (Key: D)">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="theme-sun"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="theme-moon" style="display:none;"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>
            </button>
            <div style="font-family:var(--font-ui); font-size:0.75rem; color:var(--text-muted); font-weight:500;">
                SASTRA University
            </div>
        </div>
    `;

    // Inject sidebar into page container
    const layoutDiv = document.querySelector(".layout");
    if (layoutDiv) {
        const sidebarDiv = document.createElement("aside");
        sidebarDiv.className = "sidebar";
        sidebarDiv.innerHTML = sidebarHtml;
        layoutDiv.insertBefore(sidebarDiv, layoutDiv.firstChild);
    }

    // 3. Highlight current page
    const path = window.location.pathname;
    const page = path.split("/").pop() || "index.html";
    const navItems = document.querySelectorAll(".nav-item");
    
    let pageFound = false;
    navItems.forEach(item => {
        if (item.getAttribute("data-page") === page) {
            item.classList.add("active");
            pageFound = true;
        }
    });
    
    // Fallback logic for subpages/folders
    if (!pageFound) {
        if (page === "" || page === "index.html") {
            document.querySelector('.nav-item[data-page="index.html"]')?.classList.add("active");
        }
    }

    // 4. Mobile hamburger toggle
    const toggleButton = document.createElement("button");
    toggleButton.className = "sidebar-toggle";
    toggleButton.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
    `;
    document.body.appendChild(toggleButton);

    toggleButton.addEventListener("click", () => {
        const sidebar = document.querySelector(".sidebar");
        if (sidebar) {
            sidebar.classList.toggle("open");
        }
    });

    // Close sidebar on click outside on mobile
    document.addEventListener("click", (e) => {
        const sidebar = document.querySelector(".sidebar");
        if (sidebar && sidebar.classList.contains("open") && !sidebar.contains(e.target) && !toggleButton.contains(e.target)) {
            sidebar.classList.remove("open");
        }
    });

    // 5. Theme Toggle Logic
    const themeBtn = document.getElementById("themeToggleBtn");
    if (themeBtn) {
        themeBtn.addEventListener("click", () => {
            let activeTheme = document.documentElement.getAttribute("data-theme");
            let newTheme = activeTheme === "dark" ? "light" : "dark";
            document.documentElement.setAttribute("data-theme", newTheme);
            localStorage.setItem("theme", newTheme);
            updateThemeIcon(newTheme);
        });
    }

    // 6. Keyboard Shortcuts: D for Darkmode, P for Print
    document.addEventListener("keydown", (e) => {
        if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") return;
        
        if (e.key.toLowerCase() === "d") {
            const themeBtn = document.getElementById("themeToggleBtn");
            if (themeBtn) themeBtn.click();
        }
    });

    function updateThemeIcon(theme) {
        setTimeout(() => {
            const sunIcon = document.querySelector(".theme-sun");
            const moonIcon = document.querySelector(".theme-moon");
            if (sunIcon && moonIcon) {
                if (theme === "dark") {
                    sunIcon.style.display = "none";
                    moonIcon.style.display = "block";
                } else {
                    sunIcon.style.display = "block";
                    moonIcon.style.display = "none";
                }
            }
        }, 50);
    }
});
