let wpdbData = [];
let guidesData = {};
const PANEL_DURATION = 460;
const OVERLAY_DURATION = 260;

async function init() {
    try {
        const [dbRes, guidesRes] = await Promise.all([
            fetch('database.json'),
            fetch('guides.json')
        ]);
        wpdbData = await dbRes.json();
        guidesData = await guidesRes.json();

        renderSidebar();

        // Handle initial hash
        if (window.location.hash) {
            const id = window.location.hash.substring(1).toLowerCase();
            showGuide(id);
        } else {
            showGuide('htc'); // Default
        }
    } catch (error) {
        console.error("Error loading guides:", error);
    }
}

function renderSidebar() {
    const sidebar = document.getElementById('guideSidebar');
    if (!sidebar) return;

    let html = '';
    let delay = 0;

    // Core Brand Guides
    html += `
        <div class="mb-5 brand-group animate-list-cascade" style="animation-delay: ${delay}ms; opacity: 0; animation-fill-mode: forwards;">
            <h3 class="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 px-3">Standard Guides</h3>
            <ul class="space-y-0.5">
                <li onclick="showGuide('htc')" id="nav-htc" class="guide-nav-item px-3 py-1.5 cursor-pointer text-sm text-gray-600 border-l-4 border-transparent hover:bg-gray-100 transition-colors duration-200 ease-metro">HTC RUU</li>
                <li onclick="showGuide('samsung')" id="nav-samsung" class="guide-nav-item px-3 py-1.5 cursor-pointer text-sm text-gray-600 border-l-4 border-transparent hover:bg-gray-100 transition-colors duration-200 ease-metro">Samsung SMD</li>
                <li onclick="showGuide('hp')" id="nav-hp" class="guide-nav-item px-3 py-1.5 cursor-pointer text-sm text-gray-600 border-l-4 border-transparent hover:bg-gray-100 transition-colors duration-200 ease-metro">Generic FFU flashing</li>
            </ul>
        </div>
    `;
    delay += 48;

    // Device-specific guides (if any exist in database)
    // For now we don't have many, but we prepare the UI
    const brandsWithCustom = wpdbData.filter(b => b.devices.some(d => d.guide));
    if (brandsWithCustom.length > 0) {
        brandsWithCustom.forEach(brand => {
            html += `
                <div class="mb-5 brand-group animate-list-cascade" style="animation-delay: ${delay}ms; opacity: 0; animation-fill-mode: forwards;">
                    <h3 class="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 px-3">${brand.brand} Special</h3>
                    <ul class="space-y-0.5">
                        ${brand.devices.filter(d => d.guide).map(d => `
                            <li onclick="showGuide('${d.codename}')" id="nav-${d.codename}" class="guide-nav-item px-3 py-1.5 cursor-pointer text-sm text-gray-600 border-l-4 border-transparent hover:bg-gray-100 transition-colors duration-200 ease-metro truncate">${d.name}</li>
                        `).join('')}
                    </ul>
                </div>
            `;
            delay += 48;
        });
    }

    sidebar.innerHTML = html;
}

function showGuide(id) {
    const content = document.getElementById('guideContent');
    if (!content) return;

    // Update active state in sidebar
    document.querySelectorAll('.guide-nav-item').forEach(el => {
        el.classList.remove('border-wp-blue', 'bg-white', 'text-black', 'font-semibold');
        el.classList.add('border-transparent', 'text-gray-600');
    });
    const activeNav = document.getElementById(`nav-${id}`);
    if (activeNav) {
        activeNav.classList.remove('border-transparent', 'text-gray-600');
        activeNav.classList.add('border-wp-blue', 'bg-white', 'text-black', 'font-semibold');
    }

    let steps = guidesData[id];
    let title = "";
    let description = "";

    if (!steps) {
        // Check for device specific guide in database
        for (const brand of wpdbData) {
            const dev = brand.devices.find(d => d.codename === id);
            if (dev && dev.guide) {
                steps = dev.guide;
                title = `${dev.name} Specific Guide`;
                description = `Custom instructions for the ${dev.name} codename ${dev.codename}.`;
                break;
            }
        }
    } else {
        // Standard brands
        if (id === 'htc') { title = "HTC Devices"; description = "Standard RUU flashing instructions for HTC devices."; }
        if (id === 'samsung') { title = "Samsung ATIV Devices"; description = "Standard SMD Binary Downloader instructions for Samsung devices."; }
        if (id === 'hp') { title = "Generic FFU Flashing"; description = "Using ffutool to flash generic .ffu firmware files."; }
    }

    if (!steps) {
        content.innerHTML = `<div class="py-20 text-center text-gray-400">Guide not found.</div>`;
        return;
    }

    let html = `
        <div>
            <div class="mb-10 border-b border-gray-200 pb-5 animate-content-slide opacity-0" style="animation-delay: 40ms; animation-fill-mode: forwards;">
                <h1 class="text-4xl md:text-6xl text-black mb-1">${title.toLowerCase()}</h1>
                <p class="text-base md:text-xl text-gray-500 mt-3">${description}</p>
            </div>
            <div class="space-y-8">
                ${steps.map((step, i) => `
                    <div class="flex gap-4 md:gap-6 group animate-content-slide opacity-0" style="animation-delay: ${120 + (i * 70)}ms; animation-fill-mode: forwards;">
                        <div class="shrink-0 w-10 h-10 md:w-12 md:h-12 rounded-full border-2 border-wp-blue text-wp-blue flex items-center justify-center font-bold text-lg md:text-xl group-hover:bg-wp-blue group-hover:text-white transition-colors duration-200 ease-metro">
                            ${i + 1}
                        </div>
                        <div class="pt-1">
                            <h3 class="text-xl md:text-2xl font-light text-black mb-2">${step.title}</h3>
                            <p class="text-gray-600 leading-relaxed text-sm md:text-base">${step.text}</p>
                        </div>
                    </div>
                `).join('')}
            </div>
            <div class="bg-gray-50 p-6 mt-12 border-l-4 border-gray-300 animate-content-slide opacity-0" style="animation-delay: ${180 + (steps.length * 70)}ms; animation-fill-mode: forwards;">
                <p class="text-xs text-gray-500 font-bold uppercase tracking-widest mb-1">Disclaimer</p>
                <p class="text-sm text-gray-500 italic">We are not responsible for bricked devices. Flashing firmware always carries a risk.</p>
            </div>
        </div>
    `;

    content.innerHTML = html;
    window.location.hash = id;
}

// Reuse mobile sidebar logic from app.js basically
function toggleMobileSidebar() {
    const sidebar = document.getElementById('main-sidebar');
    const overlay = document.getElementById('mobile-overlay');
    const isOpen = !sidebar.classList.contains('-translate-x-full');

    if (isOpen) {
        sidebar.classList.add('-translate-x-full');
        overlay.classList.remove('opacity-100');
        overlay.classList.add('opacity-0');
        setTimeout(() => overlay.classList.add('hidden'), OVERLAY_DURATION);
    } else {
        overlay.classList.remove('hidden');
        requestAnimationFrame(() => {
            overlay.classList.add('opacity-100');
            overlay.classList.remove('opacity-0');
            sidebar.classList.remove('-translate-x-full');
        });
    }
}

function toggleModal(id) {
    const m = document.getElementById(id);
    if (!m) return;
    const panel = m.querySelector('.absolute');

    if (m.classList.contains('hidden')) {
        m.classList.remove('hidden');
        void m.offsetWidth;
        requestAnimationFrame(() => {
            m.classList.remove('opacity-0');
            panel.classList.remove('translate-x-full');
        });
    } else {
        m.classList.add('opacity-0');
        panel.classList.add('translate-x-full');
        setTimeout(() => {
            m.classList.add('hidden');
        }, PANEL_DURATION);
    }
}

init();
