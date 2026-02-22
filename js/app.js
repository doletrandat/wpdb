const homeView = document.getElementById('homeView');
const deviceView = document.getElementById('deviceView');
const homeGrid = document.getElementById('homeGrid');
const sidebar = document.getElementById('deviceSidebar');

const CDN_BASE = 'https://download.lumiadb.com/wpdb';

function buildDownloadUrl(brand, model, filename) {
    return `${CDN_BASE}/${encodeURIComponent(brand)}/${encodeURIComponent(model)}/${encodeURIComponent(filename)}`;
}

function getUrl(brand, model, entry) {
    if (entry.filename) return buildDownloadUrl(brand, model, entry.filename);
    return entry.url || '#';
}

const metroColors = [
    'bg-[#2d89ef]', 'bg-[#00aba9]', 'bg-[#2b5797]', 'bg-[#b91d47]',
    'bg-[#99b433]', 'bg-[#da532c]', 'bg-[#603cba]', 'bg-[#00a300]'
];

let wpdbData = [];

// init
async function init() {
    try {
        const response = await fetch('database.json');
        if (!response.ok) throw new Error("Failed to load database.json");
        wpdbData = await response.json();

        renderSidebar();
        renderHome();

        const urlParams = new URLSearchParams(window.location.search);
        const deviceCode = urlParams.get('device');
        if (deviceCode) {
            setTimeout(() => openDevice(deviceCode, false), 100);
        }

    } catch (error) {
        console.error("Error loading database:", error);
    }

    window.onpopstate = function (event) {
        if (event.state && event.state.device) {
            openDevice(event.state.device, false);
        } else {
            goToHome(false);
        }
    };
}

function renderSidebar() {
    let html = '';
    let delay = 0;
    wpdbData.forEach(brand => {
        html += `
            <div class="mb-5 brand-group animate-list-cascade" style="animation-delay: ${delay}ms; opacity: 0; animation-fill-mode: forwards;">
                <h3 class="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 px-3 flex items-center gap-2">
                    <span class="flex-1">${brand.brand}</span>
                    <span class="text-[9px] text-gray-300">${brand.devices.length}</span>
                </h3>
                <ul class="space-y-0.5">
                    ${brand.devices.map(d => `
                        <li 
                            onclick="openDevice('${d.codename}')"
                            id="nav-${d.codename}"
                            class="sidebar-item px-3 py-1.5 cursor-pointer text-sm text-gray-600 border-l-4 border-transparent transition-all duration-200 ease-metro hover:text-black hover:bg-white hover:border-gray-300 truncate active:scale-[0.98]"
                            data-name="${d.name.toLowerCase()} ${d.codename.toLowerCase()}"
                        >
                            ${d.name}
                        </li>
                    `).join('')}
                </ul>
            </div>
        `;
        delay += 50;
    });
    sidebar.innerHTML = html;
}

function renderHome() {
    let html = '';
    let delay = 0;

    wpdbData.forEach(brand => {
        brand.devices.forEach((d, index) => {
            const colorClass = metroColors[(d.name.charCodeAt(0) + index) % metroColors.length];

            const fwCount = d.firmwares ? d.firmwares.length : 0;
            html += `
                <div 
                    onclick="handleTileClick(this, '${d.codename}')"
                    data-brand="${brand.brand}"
                    class="group relative aspect-[16/9] bg-white cursor-pointer shadow-sm animate-tile-enter overflow-hidden flex flex-col"
                    style="animation-delay: ${delay}ms; opacity: 0; animation-fill-mode: forwards;"
                >
                    <div class="relative flex-1 overflow-hidden p-4 flex items-center justify-center">
                        <div class="absolute right-[-10px] top-[-10px] text-black/5 transform rotate-12">
                             <i class="fa-brands fa-windows text-8xl"></i>
                        </div>
                        ${fwCount > 0 ? `<span class="absolute top-2 right-2 z-10 bg-white/80 text-gray-400 text-[9px] font-bold px-1.5 py-0.5 font-mono">${fwCount}</span>` : ''}
                        <img 
                            src="${d.image}" 
                            loading="lazy"
                            class="max-h-full max-w-full object-contain transform group-hover:scale-110 transition-transform duration-500 ease-metro relative z-10"
                            alt="${d.name}"
                        >
                    </div>
                    <div class="${colorClass} h-14 px-4 flex flex-col justify-center relative z-20 transition-all duration-300 group-hover:h-16">
                        <div class="flex justify-between items-center">
                            <div class="overflow-hidden">
                                <h3 class="text-white text-lg font-light leading-none truncate pr-2">${d.name}</h3>
                                <p class="text-white/80 text-[10px] font-mono uppercase tracking-wider mt-0.5 truncate">${brand.brand} // ${d.codename}</p>
                            </div>
                            <i class="fa-solid fa-arrow-right text-white opacity-0 -translate-x-2 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300 shrink-0"></i>
                        </div>
                    </div>
                </div>
            `;
            delay += 50;
        });
    });
    homeGrid.innerHTML = html;

    // Build brand filter strip
    const brands = wpdbData.map(b => b.brand);
    const filterContainer = document.getElementById('brandFilter');
    if (filterContainer) {
        let filterHtml = `<button onclick="filterByBrand('all')" id="filter-all" class="brand-filter-btn text-2xl md:text-3xl font-light pb-1 border-b-4 border-black text-black transition-colors duration-200 whitespace-nowrap">all</button>`;
        brands.forEach(b => {
            filterHtml += `<button onclick="filterByBrand('${b}')" id="filter-${b}" class="brand-filter-btn text-2xl md:text-3xl font-light pb-1 border-b-4 border-transparent text-gray-300 hover:text-gray-500 transition-colors duration-200 whitespace-nowrap">${b.toLowerCase()}</button>`;
        });
        filterContainer.innerHTML = filterHtml;
    }
}

function filterByBrand(brand) {
    // Update active filter button
    document.querySelectorAll('.brand-filter-btn').forEach(btn => {
        btn.classList.remove('border-black', 'text-black');
        btn.classList.add('border-transparent', 'text-gray-300');
    });
    const activeBtn = document.getElementById(brand === 'all' ? 'filter-all' : `filter-${brand}`);
    if (activeBtn) {
        activeBtn.classList.remove('border-transparent', 'text-gray-300');
        activeBtn.classList.add('border-black', 'text-black');
    }
    // Show/hide tiles — disable animation so cards appear instantly
    document.querySelectorAll('#homeGrid > div[data-brand]').forEach(tile => {
        const visible = brand === 'all' || tile.dataset.brand === brand;
        tile.style.display = visible ? '' : 'none';
        if (visible) {
            tile.style.animation = 'none';
            tile.style.opacity = '1';
        }
    });
}

function handleTileClick(element, codename) {
    element.classList.add('tile-pressed');
    setTimeout(() => {
        requestAnimationFrame(() => {
            openDevice(codename);
            setTimeout(() => element.classList.remove('tile-pressed'), 300);
        });
    }, 50);
}

function goToHome(updateHistory = true) {
    if (updateHistory) {
        history.pushState(null, '', window.location.pathname);
    }

    deviceView.classList.add('hidden');
    homeView.classList.remove('hidden');

    document.querySelectorAll('.sidebar-item').forEach(el => {
        el.classList.remove('border-wp-blue', 'bg-white', 'text-black', 'font-semibold');
        el.classList.add('border-transparent', 'text-gray-600');
    });
}

function openDevice(codename, updateHistory = true) {
    if (updateHistory) {
        const url = new URL(window.location);
        url.searchParams.set('device', codename);
        history.pushState({ device: codename }, '', url);
    }

    document.querySelectorAll('.sidebar-item').forEach(el => {
        el.classList.remove('border-wp-blue', 'bg-white', 'text-black', 'font-semibold');
        el.classList.add('border-transparent', 'text-gray-600');
    });
    const activeItem = document.getElementById(`nav-${codename}`);
    if (activeItem) {
        activeItem.classList.remove('border-transparent', 'text-gray-600');
        activeItem.classList.add('border-wp-blue', 'bg-white', 'text-black', 'font-semibold');
    }

    const sidebar = document.getElementById('main-sidebar');
    if (!sidebar.classList.contains('-translate-x-full') && window.innerWidth < 768) {
        toggleMobileSidebar();
    }

    let device = null;
    let brandName = "";
    for (const b of wpdbData) {
        const found = b.devices.find(d => d.codename === codename);
        if (found) {
            device = found;
            brandName = b.brand;
            break;
        }
    }
    if (!device) return;

    homeView.classList.add('hidden');
    deviceView.classList.remove('hidden');
    deviceView.classList.remove('animate-page-enter');
    void deviceView.offsetWidth;
    deviceView.classList.add('animate-page-enter');

    const specs = device.specs || { cpu: "N/A", ram: "N/A", storage: "N/A", display: "N/A", battery: "N/A" };
    const guide = device.guide || [{ title: "No Guide", text: "No flashing guide is available for this device yet." }];
    const model = device.model || device.codename;

    deviceView.innerHTML = `
        <div class="w-full min-h-full bg-white pb-20">
            <div class="sticky top-0 bg-white/95 backdrop-blur z-30 px-6 md:px-8 py-4 border-b border-transparent shadow-sm md:shadow-none">
                <button onclick="goToHome()" class="text-xs font-bold text-gray-400 uppercase tracking-widest hover:text-wp-blue transition-colors flex items-center gap-2 group">
                    <i class="fa-solid fa-arrow-left group-hover:-translate-x-1 transition-transform duration-200 ease-metro"></i>
                    <span>back</span>
                </button>
            </div>

            <div class="px-6 md:px-16 pt-4 pb-8 md:pb-12 flex flex-col md:flex-row items-center md:items-end gap-6 md:gap-10 animate-content-slide opacity-0" style="animation-delay: 50ms; animation-fill-mode: forwards;">
                <div class="relative h-32 w-32 md:h-48 md:w-52 shrink-0 flex items-end justify-center">
                    <img src="${device.image}" loading="lazy" class="max-h-full max-w-full object-contain mix-blend-multiply filter contrast-110 drop-shadow-xl transform hover:scale-105 transition-transform duration-500 ease-metro">
                </div>
                <div class="flex-1 text-center md:text-left w-full">
                    <span class="text-wp-blue font-bold uppercase tracking-widest text-xs mb-2 block">${brandName}</span>
                    <h1 class="text-4xl md:text-7xl font-light text-black leading-none mb-4 md:-ml-0.5">${device.name}</h1>
                    <div class="flex flex-wrap justify-center md:justify-start gap-4 md:gap-6 text-sm text-gray-500 font-metro">
                        <div class="flex items-center gap-2">
                            <i class="fa-solid fa-code text-gray-300"></i>
                            <span>${device.codename}</span>
                        </div>
                        <div class="flex items-center gap-2">
                             <i class="fa-solid fa-screwdriver-wrench text-gray-300"></i>
                             <span>${device.required_tool}</span>
                        </div>
                        <div class="flex items-center gap-2">
                             <i class="fa-solid fa-database text-gray-300"></i>
                             <span>${device.firmwares.length} ${device.firmwares.length === 1 ? 'rom' : 'roms'}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div class="px-6 md:px-16 mb-8 border-b border-gray-100 flex gap-6 md:gap-8 animate-content-slide opacity-0 overflow-x-auto" style="animation-delay: 150ms; animation-fill-mode: forwards;">
                <button id="pivot-btn-downloads" onclick="switchPivot('downloads')" class="text-2xl md:text-4xl font-light pb-2 transition-colors duration-300 text-black border-b-4 border-black whitespace-nowrap">
                    downloads
                </button>
                <button id="pivot-btn-specs" onclick="switchPivot('specs')" class="text-2xl md:text-4xl font-light pb-2 transition-colors duration-300 text-gray-300 hover:text-gray-500 border-b-4 border-transparent whitespace-nowrap">
                    specs
                </button>
                <button id="pivot-btn-guide" onclick="switchPivot('guide')" class="text-2xl md:text-4xl font-light pb-2 transition-colors duration-300 text-gray-300 hover:text-gray-500 border-b-4 border-transparent whitespace-nowrap">
                    guide
                </button>
            </div>

            <div class="px-6 md:px-16 pb-20 max-w-7xl animate-content-slide opacity-0" style="animation-delay: 250ms; animation-fill-mode: forwards;">
                
                <div id="pivot-content-downloads">
                    ${device.notes ? `
                        <div class="bg-amber-50 border-l-4 border-amber-400 p-4 mb-8 text-sm text-[#8a6d3b] shadow-sm">
                            <strong class="block mb-1">Important Note</strong>
                            ${device.notes}
                        </div>
                    ` : ''}

                    <div class="md:hidden space-y-4">
                        ${device.firmwares.length === 0 ? `
                            <div class="py-16 text-center">
                                <i class="fa-solid fa-box-open text-3xl text-gray-200 mb-4 block"></i>
                                <p class="text-3xl font-light text-gray-300">no roms yet</p>
                                <p class="text-sm text-gray-400 mt-2">check back later</p>
                            </div>
                        ` : `
                        ${device.firmwares.map(fw => `
                            <div class="bg-gray-50 p-4 border border-gray-200 rounded-sm">
                                <div class="flex justify-between items-start mb-4">
                                    <div>
                                        <div class="text-lg font-light text-wp-blue break-all">${fw.version}</div>
                                        <span class="text-xs font-bold uppercase text-gray-400 tracking-wider">${fw.type}</span>
                                    </div>
                                </div>
                                <div class="text-sm text-gray-600 mb-4 pb-4 border-b border-gray-200">
                                    <span class="font-semibold">Region:</span> ${fw.region}
                                </div>
                                
                                ${fw.files && fw.files.length > 0 ?
            `<div class="space-y-2">
                                        ${fw.files.map(f => {
                const fUrl = getUrl(brandName, model, f); return `
                                            <div class="flex items-center gap-2">
                                                <button onclick="copyLink('${fUrl}')" class="p-3 bg-gray-200 text-gray-600"><i class="fa-regular fa-copy"></i></button>
                                                <a href="${fUrl}" class="block w-full text-center bg-white border border-gray-300 py-3 text-sm font-bold text-gray-700 hover:border-wp-blue hover:text-wp-blue transition-colors">
                                                    ${f.type} (${f.size})
                                                </a>
                                            </div>
                                        `;
            }).join('')}
                                    </div>`
            :
            `<div class="flex items-center gap-2">
                                        <button onclick="copyLink('${getUrl(brandName, model, fw)}')" class="p-3 bg-gray-200 text-gray-600"><i class="fa-regular fa-copy"></i></button>
                                        <a href="${getUrl(brandName, model, fw)}" class="block w-full bg-black text-white text-center py-3 font-bold uppercase tracking-wide shadow-md active:scale-95 transition-transform">
                                            Download (${fw.size})
                                        </a>
                                    </div>`
        }
                            </div>
                        `).join('')}
                        `}
                    </div>

                    <div class="hidden md:block overflow-x-auto">
                        <table class="w-full text-left border-collapse min-w-[600px]">
                            <thead>
                                <tr class="text-xs font-bold text-gray-400 uppercase tracking-widest border-b border-gray-200">
                                    <th class="py-4 pr-6 pl-2 w-1/4">Version</th>
                                    <th class="py-4 px-6 w-1/4">Region</th>
                                    <th class="py-4 px-6 text-right">Download</th>
                                </tr>
                            </thead>
                            <tbody class="text-sm">
                                ${device.firmwares.map(fw => `
                                    <tr class="group hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-0">
                                        <td class="py-5 pr-6 pl-2 align-top">
                                            <div class="text-xl font-light text-black group-hover:text-wp-blue transition-colors duration-200">${fw.version}</div>
                                            <span class="inline-block mt-1 px-2 py-0.5 bg-gray-100 text-gray-500 text-[10px] uppercase font-bold tracking-wide rounded-sm">${fw.type}</span>
                                        </td>
                                        <td class="py-5 px-6 align-top text-gray-600 pt-6">
                                            ${fw.region}
                                        </td>
                                        <td class="py-5 px-6 align-top text-right pt-6">
                                            ${fw.files && fw.files.length > 0 ?
                `<div class="flex flex-col items-end gap-2">
                                                    ${fw.files.map(f => {
                    const fUrl = getUrl(brandName, model, f); return `
                                                        <div class="flex items-center justify-end gap-2 w-full">
                                                            <button onclick="copyLink('${fUrl}')" title="Copy Link" class="text-gray-300 hover:text-wp-blue transition-colors px-2"><i class="fa-regular fa-copy"></i></button>
                                                            <a href="${fUrl}" class="group/btn flex items-center gap-3 pl-4 pr-3 py-1.5 border border-gray-200 hover:border-wp-blue bg-white hover:bg-wp-blue transition-all duration-200 rounded-sm">
                                                                <div class="text-right">
                                                                    <div class="text-xs font-bold text-gray-700 group-hover/btn:text-white uppercase">${f.type}</div>
                                                                    <div class="text-[10px] text-gray-400 group-hover/btn:text-white/80 font-mono">${f.size}</div>
                                                                </div>
                                                                <i class="fa-solid fa-download text-wp-blue group-hover/btn:text-white"></i>
                                                            </a>
                                                        </div>
                                                    `;
                }).join('')}
                                                </div>`
                :
                `<div class="inline-flex items-center gap-2 justify-end">
                                                    <button onclick="copyLink('${getUrl(brandName, model, fw)}')" title="Copy Link" class="text-gray-300 hover:text-wp-blue transition-colors p-2"><i class="fa-regular fa-copy"></i></button>
                                                    <a href="${getUrl(brandName, model, fw)}" class="inline-flex items-center gap-3 bg-black hover:bg-wp-blue text-white px-6 py-3 transition-colors shadow-lg hover:shadow-xl active:scale-95 duration-200">
                                                        <span class="font-bold tracking-wide text-xs uppercase">Download</span>
                                                        <span class="text-white/50 text-xs border-l border-white/20 pl-3">${fw.size}</span>
                                                    </a>
                                                </div>`
            }
                                        </td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                    ${device.firmwares.length === 0 ? `
                        <div class="py-16 text-center">
                            <i class="fa-solid fa-box-open text-3xl text-gray-200 mb-4 block"></i>
                            <p class="text-3xl font-light text-gray-300">no roms yet</p>
                            <p class="text-sm text-gray-400 mt-2">check back later</p>
                        </div>
                    ` : ''}
                </div>
                
                <div id="pivot-content-specs" class="hidden">
                    <div class="max-w-3xl">
                        <dl class="divide-y divide-gray-100">
                            ${Object.entries(specs).map(([key, value]) => `
                                <div class="py-4 md:py-6 grid grid-cols-1 md:grid-cols-3 gap-1 md:gap-4 hover:bg-gray-50 transition-colors px-2 -mx-2">
                                    <dt class="text-sm font-bold text-gray-400 uppercase tracking-widest pt-1 md:pt-2">${key}</dt>
                                    <dd class="col-span-2 text-xl md:text-2xl font-light text-black">${value}</dd>
                                </div>
                            `).join('')}
                        </dl>
                    </div>
                </div>

                <div id="pivot-content-guide" class="hidden">
                    <div class="max-w-3xl space-y-8">
                        ${guide.map((step, i) => `
                            <div class="flex gap-4 md:gap-6 group">
                                <div class="shrink-0 w-10 h-10 md:w-12 md:h-12 rounded-full border-2 border-wp-blue text-wp-blue flex items-center justify-center font-bold text-lg md:text-xl group-hover:bg-wp-blue group-hover:text-white transition-colors duration-300">
                                    ${i + 1}
                                </div>
                                <div class="pt-1">
                                    <h3 class="text-xl md:text-2xl font-light text-black mb-2">${step.title}</h3>
                                    <p class="text-gray-600 leading-relaxed text-sm md:text-base">${step.text}</p>
                                </div>
                            </div>
                        `).join('')}
                        
                        <div class="bg-gray-50 p-6 mt-8 border-l-4 border-gray-300">
                            <p class="text-xs text-gray-500 font-bold uppercase tracking-widest mb-1">Disclaimer</p>
                            <p class="text-sm text-gray-500 italic">We are not responsible for bricked devices. Flashing firmware always carries a risk.</p>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    `;
}

function switchPivot(tabName) {
    const tabs = ['downloads', 'specs', 'guide'];

    tabs.forEach(t => {
        const btn = document.getElementById(`pivot-btn-${t}`);
        const content = document.getElementById(`pivot-content-${t}`);
        if (btn && content) {
            btn.classList.remove('text-black', 'border-black');
            btn.classList.add('text-gray-300', 'border-transparent');
            content.classList.add('hidden');
            content.classList.remove('animate-content-slide');
        }
    });

    const activeBtn = document.getElementById(`pivot-btn-${tabName}`);
    const activeContent = document.getElementById(`pivot-content-${tabName}`);

    if (activeBtn && activeContent) {
        activeBtn.classList.remove('text-gray-300', 'border-transparent');
        activeBtn.classList.add('text-black', 'border-black');

        activeContent.classList.remove('hidden');
        void activeContent.offsetWidth;
        activeContent.classList.add('animate-content-slide');
        activeContent.style.animationDelay = "0ms";
        activeContent.style.opacity = "0";
        activeContent.style.animationFillMode = "forwards";
    }
}

function filterDevices() {
    const query = document.getElementById('searchInput').value.toLowerCase();
    const items = document.querySelectorAll('.sidebar-item');
    const brands = document.querySelectorAll('.brand-group');
    let hasResults = false;

    items.forEach(item => {
        const name = item.getAttribute('data-name');
        if (name.includes(query)) {
            item.style.display = 'block';
            hasResults = true;
        } else {
            item.style.display = 'none';
        }
    });

    brands.forEach(brand => {
        let brandHasVisible = false;
        brand.querySelectorAll('.sidebar-item').forEach(child => {
            if (child.style.display !== 'none') brandHasVisible = true;
        });
        brand.style.display = brandHasVisible ? 'block' : 'none';
    });

    if (!hasResults) {
        if (!document.getElementById('empty-msg')) {
            const msg = document.createElement('div');
            msg.id = 'empty-msg';
            msg.className = 'px-4 py-8 text-center';
            msg.innerHTML = `<div class="text-2xl text-gray-200 mb-2"><i class="fa-solid fa-magnifying-glass"></i></div><div class="text-xs text-gray-400 uppercase tracking-widest">No results</div>`;
            document.getElementById('deviceSidebar').appendChild(msg);
        }
    } else {
        const msg = document.getElementById('empty-msg');
        if (msg) msg.remove();
    }
}

function toggleModal(id) {
    const m = document.getElementById(id);
    const panel = m.querySelector('.absolute');

    if (m.classList.contains('hidden')) {
        m.classList.remove('hidden');
        void m.offsetWidth;
        m.classList.remove('opacity-0');
        panel.classList.remove('translate-x-full');
    } else {
        m.classList.add('opacity-0');
        panel.classList.add('translate-x-full');
        setTimeout(() => {
            m.classList.add('hidden');
        }, 300);
    }
}

function copyLink(url) {
    if (url === '#' || !url) return;
    navigator.clipboard.writeText(url).then(() => {
        const toast = document.getElementById('toast');
        toast.classList.remove('hidden');
        toast.classList.add('animate-toast-in');

        setTimeout(() => {
            toast.classList.remove('animate-toast-in');
            toast.classList.add('animate-toast-out');
            setTimeout(() => {
                toast.classList.add('hidden');
                toast.classList.remove('animate-toast-out');
            }, 300);
        }, 2000);
    });
}

function toggleMobileSidebar() {
    const sidebar = document.getElementById('main-sidebar');
    const overlay = document.getElementById('mobile-overlay');
    const isOpen = !sidebar.classList.contains('-translate-x-full');

    if (isOpen) {
        sidebar.classList.add('-translate-x-full');
        overlay.classList.remove('opacity-100');
        overlay.classList.add('opacity-0');
        setTimeout(() => overlay.classList.add('hidden'), 300);
    } else {
        overlay.classList.remove('hidden');
        void overlay.offsetWidth;
        overlay.classList.add('opacity-100');
        overlay.classList.remove('opacity-0');
        sidebar.classList.remove('-translate-x-full');
    }
}





// Keyboard shortcuts
document.addEventListener('keydown', e => {
    // Escape → go back to home if device view is visible
    if (e.key === 'Escape' && !deviceView.classList.contains('hidden')) {
        goToHome();
        return;
    }
    // / → focus sidebar search (ignore if already in an input)
    if (e.key === '/' && document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA') {
        e.preventDefault();
        const searchInput = document.getElementById('searchInput');
        if (searchInput) searchInput.focus();
    }
});

init();