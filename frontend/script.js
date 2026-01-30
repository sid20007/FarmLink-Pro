
            'Rice': { hi: 'चावल', mr: 'तांदूळ', kn: 'ಅಕ್ಕಿ' },

            'Corn': { hi: 'मक्का', mr: 'मका', kn: 'ಜೋಳ' },

            'Maize': { hi: 'मक्का', mr: 'मका', kn: 'ಜೋಳ' },

            'Orange': { hi: 'संतरा', mr: 'संत्री', kn: 'ಕಿತ್ತಳೆ' },

            'Oranges': { hi: 'संतरा', mr: 'संत्री', kn: 'ಕಿತ್ತಳೆ' },

            'Spinach': { hi: 'पालक', mr: 'पालक', kn: 'ಪಾಲಕ್' },

            'Organic': { hi: 'जैविक', mr: 'सेंद्रिय', kn: 'ಸಾವಯವ' },

            'Fresh': { hi: 'ताज़ा', mr: 'ताजे', kn: 'ತಾಜಾ' },

            'Yellow': { hi: 'पीला', mr: 'पिवळा', kn: 'ಹಳದಿ' },

            'Red': { hi: 'लाल', mr: 'लाल', kn: 'ಕೆಂಪು' },

            'Premium': { hi: 'प्रीमियम', mr: 'प्रीमियम', kn: 'ಪ್ರೀಮಿಯಂ' }

        };



        
let translations = {};

async function loadTranslations(lang) {
    if (translations[lang]) return;
    try {
        const response = await fetch(`locales/${lang}.json`);
        if (!response.ok) throw new Error(`Failed to load ${lang}`);
        translations[lang] = await response.json();
    } catch (err) {
        console.error('Failed to load translations', err);
    }
}

// --- Initialization ---

        document.addEventListener('DOMContentLoaded', async () => {
    await loadTranslations('en');

            renderPrices();

            renderListings();

            renderProfileOrders();

            renderFullOrderSummary();

            updateProfileUI();

            updateTranslations();

            

            // Global Click Listener for Menu Closing

            window.addEventListener('click', function(e) {

                const btn = document.getElementById('lang-btn');

                const menu = document.getElementById('lang-menu');

                const arrow = document.getElementById('lang-arrow');

                

                if (btn && menu && !btn.contains(e.target) && !menu.contains(e.target)) {

                    menu.classList.add('hidden');

                    if(arrow) arrow.classList.remove('rotate-180');

                }

            });

        });



        // --- Helper Function for Translation ---

        function t(key) {

            return translations[state.currentLang][key] || key;

        }



        // Helper to translate product names within strings

        function tProduct(text) {

            if (state.currentLang === 'en') return text;

            

            let translatedText = text;

            Object.keys(product_names).forEach(engName => {

                if (translatedText.includes(engName)) {

                    const trans = product_names[engName][state.currentLang];

                    if (trans) {

                        // Case insensitive replacement

                        const regex = new RegExp(engName, 'gi');

                        translatedText = translatedText.replace(regex, trans);

                    }

                }

            });

            return translatedText;

        }



        // --- Language Logic ---

        function toggleLangMenu(event) {

            event.stopPropagation();

            const menu = document.getElementById('lang-menu');

            const arrow = document.getElementById('lang-arrow');

            menu.classList.toggle('hidden');

            arrow.classList.toggle('rotate-180');

        }



        async function changeLanguage(lang) {
    await loadTranslations(lang);

            state.currentLang = lang;

            updateTranslations();

            

            // Re-render dynamic components

            renderPrices();

            renderListings(); 

            renderProfileOrders();

            renderFullOrderSummary(); 

            

            // Update Dropdown Label

            const labels = { 'en': 'English', 'hi': 'हिंदी', 'mr': 'मराठी', 'kn': 'ಕನ್ನಡ' };

            document.getElementById('current-lang-label').innerText = labels[lang];

            

            // Update Checkmarks visually

            document.querySelectorAll('[id^="check-"]').forEach(el => el.classList.remove('opacity-100'));

            document.querySelectorAll('[id^="check-"]').forEach(el => el.classList.add('opacity-0'));

            const activeCheck = document.getElementById(`check-${lang}`);

            if(activeCheck) {

                activeCheck.classList.remove('opacity-0');

                activeCheck.classList.add('opacity-100');

            }



            // Close Menu

            const menu = document.getElementById('lang-menu');

            const arrow = document.getElementById('lang-arrow');

            menu.classList.add('hidden');

            arrow.classList.remove('rotate-180');

        }



        function updateTranslations() {

            // Update text content

            const elements = document.querySelectorAll('[data-translate]');

            elements.forEach(el => {

                const key = el.getAttribute('data-translate');

                if (translations[state.currentLang][key]) {

                    el.innerHTML = translations[state.currentLang][key];

                }

            });



            // Update placeholders

            const inputs = document.querySelectorAll('[data-translate-placeholder]');

            inputs.forEach(el => {

                const key = el.getAttribute('data-translate-placeholder');

                if (translations[state.currentLang][key]) {

                    el.placeholder = translations[state.currentLang][key];

                }

            });

        }



        // --- Navigation Logic ---

        function switchTab(tabId) {

            // Hide all sections

            document.querySelectorAll('.view-section').forEach(el => {

                el.classList.remove('active');

            });

            

            // Show target

            const target = document.getElementById(tabId);

            if(target) target.classList.add('active');



            // Desktop Nav Update

            document.querySelectorAll('.nav-item').forEach(el => {

                el.classList.remove('nav-active', 'bg-slate-100');

            });

            const activeDesktop = document.getElementById(`nav-${tabId}`);

            if(activeDesktop) activeDesktop.classList.add('nav-active');



            // Mobile Nav Update

            document.querySelectorAll('.mob-nav-btn').forEach(el => {

                el.classList.remove('mob-active', 'text-brand-700');

                el.classList.add('text-slate-400');

            });

            const activeMobile = document.getElementById(`mob-${tabId}`);

            if(activeMobile) {

                activeMobile.classList.remove('text-slate-400');

                activeMobile.classList.add('mob-active', 'text-brand-700');

            }



            window.scrollTo({ top: 0, behavior: 'smooth' });

        }



        // --- Data Rendering ---

        function renderPrices() {

            const container = document.getElementById('hero-price-ticker');

            if(!container) return;

            

            container.innerHTML = state.marketPrices.map(item => {

                const isUp = item.trend === 'up';

                const isDown = item.trend === 'down';

                const colorClass = isUp ? 'text-green-600 bg-green-50' : (isDown ? 'text-red-600 bg-red-50' : 'text-slate-500 bg-slate-50');

                const icon = isUp ? 'fa-caret-up' : (isDown ? 'fa-caret-down' : 'fa-minus');

                

                return `

                <div class="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-colors border-b border-dashed border-slate-100 last:border-0 group">

                    <div class="flex items-center gap-3">

                        <div class="w-8 h-8 rounded-lg ${colorClass} flex items-center justify-center text-xs">

                             <i class="fa-solid ${icon}"></i>

                        </div>

                        <div>

                            <p class="font-bold text-slate-800 text-sm leading-tight group-hover:text-brand-700 transition-colors">${tProduct(item.name)}</p>

                            <p class="text-[10px] text-slate-400 font-bold uppercase tracking-wider">₹${item.price} / Qtl</p>

                        </div>

                    </div>

                    <span class="text-xs font-bold ${isUp ? 'text-green-600' : (isDown ? 'text-red-600' : 'text-slate-400')}">

                        ${isUp ? '+' : ''}${item.change}%

                    </span>

                </div>

                `;

            }).join('');

        }



        function renderProfileOrders() {

            const container = document.getElementById('orders-list');

            if(!container) return;



            container.innerHTML = state.orders.map(order => {

                let displayStatus = order.status;

                if(order.status === 'Completed') displayStatus = t('completed');

                else if(order.status === 'Pending') displayStatus = t('pending');

                

                return `

                <div class="flex items-center justify-between p-3 rounded-xl bg-earth-50 border border-transparent hover:border-earth-200 transition-all">

                    <div>

                        <p class="font-bold text-slate-800 text-sm">${tProduct(order.item)}</p>

                        <p class="text-[10px] text-slate-500 font-bold tracking-wide">${order.buyer}</p>

                    </div>

                    <div class="text-right">

                        <p class="font-bold text-slate-900 text-sm">₹${order.amount.toLocaleString()}</p>

                        <span class="text-[9px] font-bold uppercase tracking-wider ${order.status === 'Completed' ? 'text-green-600' : 'text-amber-600'}">${displayStatus}</span>

                    </div>

                </div>

            `}).join('');

        }



        function renderFullOrderSummary(filterStatus = 'All', filterText = '') {

            const container = document.getElementById('full-order-table-body');

            if(!container) return;



            let filtered = state.orders;



            // Apply Status Filter

            if (filterStatus !== 'All') {

                filtered = filtered.filter(o => o.status === filterStatus);

            }



            // Apply Search Filter

            if (filterText) {

                const lower = filterText.toLowerCase();

                filtered = filtered.filter(o => 

                    o.id.toLowerCase().includes(lower) || 

                    o.buyer.toLowerCase().includes(lower) ||

                    o.item.toLowerCase().includes(lower)

                );

            }



            if (filtered.length === 0) {

                container.innerHTML = `

                    <tr>

                        <td colspan="6" class="py-12 text-center">

                            <div class="flex flex-col items-center justify-center text-slate-300">

                                <i class="fa-solid fa-box-open text-4xl mb-3"></i>

                                <p class="text-sm font-bold text-slate-500">${t('no_orders')}</p>

                            </div>

                        </td>

                    </tr>

                `;

                return;

            }



            container.innerHTML = filtered.map(order => {

                const statusStyles = {

                    'Completed': 'bg-green-100 text-green-700 border-green-200 icon-check',

                    'Pending': 'bg-amber-100 text-amber-700 border-amber-200 icon-clock',

                    'Cancelled': 'bg-red-100 text-red-700 border-red-200 icon-xmark'

                };

                

                const style = statusStyles[order.status] || 'bg-slate-100 text-slate-600';

                const icon = order.status === 'Completed' ? 'fa-check' : (order.status === 'Pending' ? 'fa-clock' : 'fa-xmark');

                

                let displayStatus = order.status;

                if(order.status === 'Completed') displayStatus = t('completed');

                else if(order.status === 'Pending') displayStatus = t('pending');

                else if(order.status === 'Cancelled') displayStatus = t('cancelled');



                return `

                <tr class="hover:bg-brand-50/30 transition-colors group">

                    <td class="py-4 pl-6 font-bold text-brand-600 font-mono text-xs">${order.id}</td>

                    <td class="py-4">

                        <div class="flex items-center gap-3">

                            <div class="w-10 h-10 rounded-xl bg-earth-100 flex items-center justify-center text-lg shadow-sm group-hover:scale-110 transition-transform">

                                ${order.category === 'vegetable' ? '🍅' : (order.category === 'fruit' ? '🍊' : '🌾')}

                            </div>

                            <div>

                                <p class="font-bold text-slate-900">${tProduct(order.item)}</p>

                                <div class="flex items-center gap-1.5 text-xs text-slate-500">

                                    <span class="font-bold text-slate-700">${order.buyer}</span>

                                    <span class="w-1 h-1 rounded-full bg-slate-300"></span>

                                    <span>${order.qty}</span>

                                </div>

                            </div>

                        </div>

                    </td>

                    <td class="py-4 text-slate-500 text-xs font-bold">${order.date}</td>

                    <td class="py-4 font-bold text-slate-900">₹${order.amount.toLocaleString()}</td>

                    <td class="py-4">

                        <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold border ${style} uppercase tracking-wide">

                            <i class="fa-solid ${icon}"></i> ${displayStatus}

                        </span>

                    </td>

                    <td class="py-4 pr-6 text-right">

                        <button class="w-8 h-8 rounded-lg border border-slate-200 text-slate-400 hover:text-brand-600 hover:border-brand-200 hover:bg-white hover:shadow-sm transition-all flex items-center justify-center bg-slate-50" title="${t('view_details')}">

                            <i class="fa-solid fa-angle-right"></i>

                        </button>

                    </td>

                </tr>

                `;

            }).join('');

        }



        function renderListings(filterText = '', category = 'all') {

            const container = document.getElementById('marketplace-grid');

            const noResults = document.getElementById('no-results');

            

            // Filter Logic

            const filtered = state.listings.filter(item => {

                const matchesSearch = item.name.toLowerCase().includes(filterText.toLowerCase()) || 

                                    item.farmer.toLowerCase().includes(filterText.toLowerCase());

                const matchesCat = category === 'all' || item.category === category;

                return matchesSearch && matchesCat;

            });



            if (filtered.length === 0) {

                container.innerHTML = '';

                noResults.classList.remove('hidden');

                return;

            } else {

                noResults.classList.add('hidden');

            }



            container.innerHTML = filtered.map(item => `

                <div class="bg-white rounded-[2rem] overflow-hidden border border-earth-100 shadow-card group hover:translate-y-[-5px] transition-transform duration-300 flex flex-col h-full hover:shadow-depth">

                    <div class="relative h-56 overflow-hidden">

                        <img src="${item.img}" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" alt="${item.name}">

                        <div class="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-60"></div>

                        <div class="absolute top-4 right-4 bg-white/95 backdrop-blur px-3 py-1.5 rounded-xl text-xs font-bold text-slate-900 shadow-sm border border-white/20">

                            ₹${item.price}/kg

                        </div>

                        ${item.verified ? `<div class="absolute bottom-4 left-4 bg-green-500/90 backdrop-blur text-white text-[10px] font-bold px-2.5 py-1 rounded-lg flex items-center gap-1 shadow-sm"><i class="fa-solid fa-certificate"></i> ${t('verified')}</div>` : ''}

                        ${item.isMine ? `<div class="absolute top-4 left-4 bg-brand-600/90 backdrop-blur text-white text-[10px] font-bold px-2.5 py-1 rounded-lg shadow-sm">${t('my_stock')}</div>` : ''}

                    </div>

                    <div class="p-6 flex flex-col flex-1">

                        <div class="mb-4">

                            <h3 class="font-bold text-slate-900 text-lg leading-tight line-clamp-1 group-hover:text-brand-700 transition-colors">${tProduct(item.name)}</h3>

                            <p class="text-xs text-slate-500 mt-1 font-medium flex items-center"><i class="fa-solid fa-location-dot mr-1.5 text-brand-500"></i> ${item.loc}</p>

                        </div>

                        

                        <div class="mt-auto pt-4 border-t border-earth-100 flex items-center justify-between">

                            <div class="flex items-center gap-3">

                                <div class="w-9 h-9 rounded-full bg-earth-100 flex items-center justify-center text-xs font-bold text-slate-600 border border-earth-200 shadow-sm">

                                    ${item.farmer.charAt(0)}

                                </div>

                                <div>

                                    <p class="text-xs font-bold text-slate-800 line-clamp-1">${item.farmer}</p>

                                    <p class="text-[10px] text-slate-400 font-bold uppercase tracking-wider">${item.time}</p>

                                </div>

                            </div>

                            <button onclick="contactFarmer('${item.name}')" class="bg-earth-50 text-slate-400 border border-earth-200 hover:bg-brand-600 hover:text-white hover:border-brand-600 transition-colors w-10 h-10 rounded-xl flex items-center justify-center">

                                <i class="fa-solid fa-phone text-sm"></i>

                            </button>

                        </div>

                    </div>

                </div>

            `).join('');

            

            // Also update Profile History

            renderProfileHistory();

        }



        // --- Marketplace Filters ---

        function filterMarketplace() {

            const searchVal = document.getElementById('market-search').value;

            // Simplified: Reset filters to 'all' visually if searching, for this demo

            // In a real app, we'd keep track of active category state

            renderListings(searchVal, 'all'); 

            

            document.querySelectorAll('.market-filter').forEach(btn => {

                btn.classList.remove('active', 'bg-brand-900', 'text-white');

                btn.classList.add('bg-white', 'text-slate-600');

                if(btn.innerText.includes("All") || btn.innerText.includes("सभी") || btn.innerText.includes("सर्व") || btn.innerText.includes("ಎಲ್ಲಾ")) {

                     btn.classList.add('active', 'bg-brand-900', 'text-white');

                     btn.classList.remove('bg-white', 'text-slate-600');

                }

            });

        }



        function filterCategory(cat) {

            const searchVal = document.getElementById('market-search').value;

            renderListings(searchVal, cat);

            

            // Update Button Styles

            document.querySelectorAll('.market-filter').forEach(btn => {

                btn.classList.remove('active', 'bg-brand-900', 'text-white');

                btn.classList.add('bg-white', 'text-slate-600');

            });

            event.target.classList.add('active', 'bg-brand-900', 'text-white');

            event.target.classList.remove('bg-white', 'text-slate-600');

        }



        // --- Profile Logic ---

        function updateProfileUI() {

            document.querySelectorAll('.user-name-display').forEach(el => el.innerText = state.user.name);

            document.querySelectorAll('.user-email-display').forEach(el => el.innerText = state.user.email);

            document.querySelectorAll('.user-phone-display').forEach(el => el.innerText = state.user.phone);

            document.querySelectorAll('.user-address-display').forEach(el => el.innerText = state.user.address);

            

            document.querySelectorAll('.user-farm-display').forEach(el => {

                // Keep the icon if it exists inside

                const icon = el.querySelector('i');

                el.innerText = ` ${state.user.farmName} • ${state.user.location}`;

                if(icon) el.prepend(icon);

            });

            

            // Pre-fill inputs

            document.getElementById('edit-name').value = state.user.name;

            document.getElementById('edit-farm').value = state.user.farmName;

            document.getElementById('edit-location').value = state.user.location;

            document.getElementById('edit-phone').value = state.user.phone;

            

            // Count Listings

            const myCount = state.listings.filter(l => l.isMine).length;

            document.getElementById('profile-listings-count').innerText = myCount;

        }



        function renderProfileHistory() {

            const myListings = state.listings.filter(l => l.isMine);

            const container = document.getElementById('profile-history-list');

            

            if(myListings.length === 0) {

                container.innerHTML = '<div class="col-span-2 text-center py-8 text-slate-400 italic">No inventory listed yet.</div>';

                return;

            }



            container.innerHTML = myListings.map(item => `

                <div class="flex items-center gap-4 bg-white p-4 rounded-2xl border border-earth-100 shadow-sm hover:shadow-md transition-shadow group">

                    <img src="${item.img}" class="w-16 h-16 rounded-xl object-cover" alt="thumb">

                    <div class="flex-1">

                        <h4 class="font-bold text-slate-900 text-sm">${tProduct(item.name)}</h4>

                        <div class="flex items-center gap-3 mt-1">

                            <span class="text-xs text-slate-500 font-medium bg-earth-50 px-2 py-0.5 rounded">${item.qty}</span>

                            <span class="text-xs text-brand-700 font-bold">₹${item.price}/kg</span>

                        </div>

                    </div>

                    <button class="w-8 h-8 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors flex items-center justify-center">

                        <i class="fa-solid fa-trash-can"></i>

                    </button>

                </div>

            `).join('');

        }



        function toggleEditProfile() {

            const form = document.getElementById('edit-profile-form');

            form.classList.toggle('hidden');

        }



        function saveProfile() {

            state.user.name = document.getElementById('edit-name').value;

            state.user.farmName = document.getElementById('edit-farm').value;

            state.user.location = document.getElementById('edit-location').value;

            state.user.phone = document.getElementById('edit-phone').value;

            

            updateProfileUI();

            toggleEditProfile();

            showToast('Profile updated successfully!');

        }



        function filterOrders(status) {

            // Update UI Tabs

            document.querySelectorAll('.order-tab').forEach(btn => {

                btn.classList.remove('active', 'bg-slate-900', 'text-white', 'shadow-md');

                btn.classList.add('text-slate-500');

            });

            const activeBtn = document.getElementById(`tab-${status}`);

            activeBtn.classList.add('active', 'bg-slate-900', 'text-white', 'shadow-md');

            activeBtn.classList.remove('text-slate-500');



            // Filter Data

            const searchVal = document.getElementById('order-search').value;

            renderFullOrderSummary(status, searchVal);

        }



        function searchOrders() {

            const searchVal = document.getElementById('order-search').value;

            // Get active tab status

            let activeStatus = 'All';

            document.querySelectorAll('.order-tab').forEach(btn => {

                if(btn.classList.contains('active')) activeStatus = btn.id.split('-')[1];

            });

            renderFullOrderSummary(activeStatus, searchVal);

        }



        // --- Interaction Logic ---

        function handleRequest(elementId, action) {

            const el = document.getElementById(elementId);

            el.style.transform = 'translateX(100%)';

            el.style.opacity = '0';

            

            setTimeout(() => {

                el.style.display = 'none';

                // Check if empty

                const container = document.getElementById('requests-container');

                // Simple check for demo purposes

                let visible = 0;

                Array.from(container.children).forEach(c => {

                    if(c.style.display !== 'none') visible++;

                });

                

                if(visible === 0) {

                    container.innerHTML = '<div class="p-8 text-center text-slate-400 text-sm font-medium border-2 border-dashed border-earth-100 rounded-2xl">No active requests at the moment.</div>';

                }

            }, 300);



            showToast(`Request ${action}.`);

        }



        function contactFarmer(itemName) {

            showToast(`Calling owner...`);

        }



        // --- Modal Logic ---

        function openModal() {

            const modal = document.getElementById('listingModal');

            const backdrop = document.getElementById('modalBackdrop');

            const content = document.getElementById('modalContent');

            

            modal.classList.remove('hidden');

            setTimeout(() => {

                backdrop.classList.remove('opacity-0');

                content.classList.remove('opacity-0', 'translate-y-full');

                if(window.innerWidth >= 768) content.classList.remove('md:translate-y-10'); 

            }, 10);

        }



        function closeModal() {

            const modal = document.getElementById('listingModal');

            const backdrop = document.getElementById('modalBackdrop');

            const content = document.getElementById('modalContent');



            backdrop.classList.add('opacity-0');

            content.classList.add('opacity-0', 'translate-y-full');

            if(window.innerWidth >= 768) content.classList.add('md:translate-y-10'); 



            setTimeout(() => {

                modal.classList.add('hidden');

            }, 300);

        }



        function submitListing() {

            const name = document.getElementById('itemName').value;

            const price = document.getElementById('itemPrice').value;

            const qty = document.getElementById('itemQty').value;

            const cat = document.getElementById('itemCat').value;



            if(!name || !price || !qty) {

                showToast('Please fill all fields', 'Error');

                return;

            }



            // Add to State

            state.listings.unshift({

                id: Date.now(),

                name: name,

                category: cat,

                price: price,

                qty: qty + ' kg',

                farmer: state.user.name,

                loc: 'Pune, MH', // Default for demo

                time: 'Just now',

                img: 'https://images.unsplash.com/photo-1615484477778-ca3b77940c25?auto=format&fit=crop&q=80&w=600',

                verified: true,

                isMine: true

            });



            // Refresh Views

            renderListings();

            updateProfileUI(); // Update count

            closeModal();

            

            // Show Success

            showToast('Your produce is live! 🚀');

            setTimeout(() => switchTab('marketplace'), 500);

            

            // Reset form

            document.getElementById('itemName').value = '';

            document.getElementById('itemPrice').value = '';

            document.getElementById('itemQty').value = '';

        }



        function showToast(message, title='Success') {

            const toast = document.getElementById('toast');

            document.getElementById('toast-msg').innerText = message;

            document.getElementById('toast-title').innerText = title;

            toast.classList.add('show');

            setTimeout(() => {

                toast.classList.remove('show');

            }, 3000);

        }

    </script>

</body>

</html>
