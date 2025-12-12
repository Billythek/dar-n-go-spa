// DarDZ - Application JavaScript Principale
// Navigation SPA + Options Animaux + Toutes fonctionnalités

// État global de l'application
const APP_STATE = {
    currentPage: 'accueil',
    selectedListing: null,
    favorites: JSON.parse(localStorage.getItem('dardz_favorites') || '[]'),
    darkMode: localStorage.getItem('dardz_darkMode') === 'true',
    searchFilters: {
        destination: '',
        dateArrivee: '',
        dateDepart: '',
        prixMin: 5000,
        prixMax: 50000,
        types: [],
        equipements: [],
        animauxAcceptes: false
    },
    voyageurs: {
        adultes: 2,
        enfants: 0,
        bebes: 0,
        chiens: 0,
        chats: 0,
        autresAnimaux: false
    }
};

// Navigation SPA
function showPage(pageName) {
    // Cacher toutes les pages
    document.querySelectorAll('[data-page]').forEach(page => {
        page.style.display = 'none';
    });
    
    // Afficher la page demandée
    const page = document.querySelector(`[data-page="${pageName}"]`);
    if (page) {
        page.style.display = 'block';
        APP_STATE.currentPage = pageName;
        
        // Mise à jour navigation active
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });
        document.querySelector(`[data-nav="${pageName}"]`)?.classList.add('active');
        
        // Scroll to top
        window.scrollTo(0, 0);
        
        // Init page spécifique
        initPage(pageName);
    }
}

function initPage(pageName) {
    switch(pageName) {
        case 'accueil':
            renderAccueil();
            break;
        case 'explorer':
            renderExplorer();
            break;
        case 'favoris':
            renderFavoris();
            break;
        case 'profil':
            renderProfil();
            break;
        case 'messages':
            renderMessages();
            break;
        case 'devenir-hote':
            renderDevenirHote();
            break;
    }
}

// Gestion des voyageurs avec ANIMAUX
function updateVoyageurs(type, delta) {
    const current = APP_STATE.voyageurs[type];
    const limits = {
        adultes: { min: 1, max: 16 },
        enfants: { min: 0, max: 10 },
        bebes: { min: 0, max: 5 },
        chiens: { min: 0, max: 3 },
        chats: { min: 0, max: 3 }
    };
    
    if (type === 'autresAnimaux') {
        APP_STATE.voyageurs[type] = !APP_STATE.voyageurs[type];
    } else {
        const newValue = current + delta;
        const limit = limits[type];
        
        if (newValue >= limit.min && newValue <= limit.max) {
            APP_STATE.voyageurs[type] = newValue;
        }
    }
    
    updateVoyageursDisplay();
}

function updateVoyageursDisplay() {
    const v = APP_STATE.voyageurs;
    const total = v.adultes + v.enfants + v.bebes;
    const totalAnimaux = v.chiens + v.chats + (v.autresAnimaux ? 1 : 0);
    
    let text = `${total} voyageur${total > 1 ? 's' : ''}`;
    if (totalAnimaux > 0) {
        text += `, ${totalAnimaux} animal${totalAnimaux > 1 ? 'aux' : ''}`;
    }
    
    document.querySelectorAll('.voyageurs-display').forEach(el => {
        el.textContent = text;
    });
    
    // Mise à jour des compteurs
    Object.keys(v).forEach(key => {
        if (key !== 'autresAnimaux') {
            const el = document.querySelector(`[data-count="${key}"]`);
            if (el) el.textContent = v[key];
        }
    });
    
    // Mise à jour boutons +/-
    updateVoyageursButtons();
}

function updateVoyageursButtons() {
    const v = APP_STATE.voyageurs;
    const limits = {
        adultes: { min: 1, max: 16 },
        enfants: { min: 0, max: 10 },
        bebes: { min: 0, max: 5 },
        chiens: { min: 0, max: 3 },
        chats: { min: 0, max: 3 }
    };
    
    Object.keys(limits).forEach(key => {
        const minusBtn = document.querySelector(`[data-minus="${key}"]`);
        const plusBtn = document.querySelector(`[data-plus="${key}"]`);
        
        if (minusBtn) {
            minusBtn.disabled = v[key] <= limits[key].min;
        }
        if (plusBtn) {
            plusBtn.disabled = v[key] >= limits[key].max;
        }
    });
}

// Gestion des favoris
function toggleFavorite(listingId) {
    const index = APP_STATE.favorites.indexOf(listingId);
    
    if (index === -1) {
        APP_STATE.favorites.push(listingId);
        showToast('Ajouté aux favoris ❤️');
    } else {
        APP_STATE.favorites.splice(index, 1);
        showToast('Retiré des favoris');
    }
    
    localStorage.setItem('dardz_favorites', JSON.stringify(APP_STATE.favorites));
    updateFavoriteButtons();
}

function isFavorite(listingId) {
    return APP_STATE.favorites.includes(listingId);
}

function updateFavoriteButtons() {
    document.querySelectorAll('[data-favorite]').forEach(btn => {
        const listingId = parseInt(btn.dataset.favorite);
        const isFav = isFavorite(listingId);
        btn.classList.toggle('active', isFav);
        btn.querySelector('svg').style.fill = isFav ? '#C65D3B' : 'none';
    });
}

// Toast notifications
function showToast(message, duration = 3000) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    toast.style.cssText = `
        position: fixed;
        bottom: 30px;
        left: 50%;
        transform: translateX(-50%);
        background: #222;
        color: white;
        padding: 15px 25px;
        border-radius: 30px;
        z-index: 10000;
        animation: slideUp 0.3s ease;
    `;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.style.animation = 'slideDown 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, duration);
}

// Dark Mode
function toggleDarkMode() {
    APP_STATE.darkMode = !APP_STATE.darkMode;
    document.body.classList.toggle('dark-mode', APP_STATE.darkMode);
    localStorage.setItem('dardz_darkMode', APP_STATE.darkMode);
    
    const icon = document.querySelector('#dark-mode-toggle svg use');
    if (icon) {
        icon.setAttribute('href', APP_STATE.darkMode ? '#icon-sun' : '#icon-moon');
    }
}

// Autocomplete wilayas
function initAutocomplete() {
    const input = document.querySelector('#destination-input');
    const dropdown = document.querySelector('#destination-dropdown');
    
    if (!input || !dropdown) return;
    
    input.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase();
        
        if (query.length === 0) {
            dropdown.style.display = 'none';
            return;
        }
        
        const matches = WILAYAS.filter(w => w.toLowerCase().includes(query));
        
        if (matches.length > 0) {
            dropdown.innerHTML = matches.map(wilaya => `
                <div class="dropdown-item" onclick="selectDestination('${wilaya}')">
                    <span>${wilaya}</span>
                </div>
            `).join('');
            dropdown.style.display = 'block';
        } else {
            dropdown.style.display = 'none';
        }
    });
}

function selectDestination(wilaya) {
    document.querySelector('#destination-input').value = wilaya;
    document.querySelector('#destination-dropdown').style.display = 'none';
    APP_STATE.searchFilters.destination = wilaya;
}

// Recherche et filtres
function performSearch() {
    const filters = APP_STATE.searchFilters;
    const voyageurs = APP_STATE.voyageurs;
    
    let results = [...LOGEMENTS];
    
    // Filtre destination
    if (filters.destination) {
        results = results.filter(l => l.wilaya === filters.destination);
    }
    
    // Filtre prix
    results = results.filter(l => l.prix >= filters.prixMin && l.prix <= filters.prixMax);
    
    // Filtre types
    if (filters.types.length > 0) {
        results = results.filter(l => filters.types.includes(l.type));
    }
    
    // Filtre animaux
    if (filters.animauxAcceptes) {
        results = results.filter(l => l.animauxAcceptes === true);
    }
    
    // Filtre voyageurs (capacité)
    const totalVoyageurs = voyageurs.adultes + voyageurs.enfants + voyageurs.bebes;
    results = results.filter(l => l.voyageurs >= totalVoyageurs);
    
    return results;
}

// Render functions
function renderAccueil() {
    const container = document.querySelector('#accueil-listings');
    if (!container) return;
    
    const featured = LOGEMENTS.slice(0, 6);
    container.innerHTML = featured.map(listing => createListingCard(listing)).join('');
    updateFavoriteButtons();
}

function renderExplorer() {
    const results = performSearch();
    const container = document.querySelector('#explorer-listings');
    if (!container) return;
    
    container.innerHTML = results.map(listing => createListingCard(listing)).join('');
    updateFavoriteButtons();
}

function renderFavoris() {
    const container = document.querySelector('#favoris-listings');
    if (!container) return;
    
    const favoriteListings = LOGEMENTS.filter(l => isFavorite(l.id));
    
    if (favoriteListings.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <div id="empty-anim" style="width: 200px; height: 200px; margin: 0 auto;"></div>
                <h3>Aucun favori pour le moment</h3>
                <p>Explorez nos logements et ajoutez vos coups de cœur !</p>
                <button onclick="showPage('explorer')" class="btn-primary">Explorer</button>
            </div>
        `;
        
        // Load empty state animation
        if (typeof lottie !== 'undefined') {
            lottie.loadAnimation({
                container: document.getElementById('empty-anim'),
                renderer: 'svg',
                loop: true,
                autoplay: true,
                path: 'animations/n2_saved_emptry_state.json'
            });
        }
    } else {
        container.innerHTML = favoriteListings.map(listing => createListingCard(listing)).join('');
        updateFavoriteButtons();
    }
}

function renderProfil() {
    // Implementation profil page
}

function renderMessages() {
    // Implementation messages page
}

function renderDevenirHote() {
    // Implementation devenir hôte page
}

function createListingCard(listing) {
    return `
        <div class="listing-card" onclick="openDetailModal(${listing.id})">
            <div class="listing-image">
                <img src="${listing.images[0]}" alt="${listing.titre}">
                ${listing.superhote ? `
                    <div class="listing-badge gold">
                        <img src="images/ui_res_pdp_reviews_guestfavoriteheader__left_3d_laurel_gold.webp" 
                             style="width:16px;height:16px;margin-right:3px;">
                        Superhôte
                    </div>
                ` : ''}
                <button class="listing-favorite ${isFavorite(listing.id) ? 'active' : ''}" 
                        data-favorite="${listing.id}"
                        onclick="event.stopPropagation(); toggleFavorite(${listing.id})">
                    <svg viewBox="0 0 24 24">
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                    </svg>
                </button>
            </div>
            <div class="listing-info">
                <div class="listing-location">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                        <circle cx="12" cy="10" r="3"></circle>
                    </svg>
                    ${listing.quartier}, ${listing.wilaya}
                </div>
                <h3 class="listing-title">${listing.titre}</h3>
                <div class="listing-details">
                    ${listing.voyageurs} voyageurs · ${listing.chambres} chambres · ${listing.sallesBain} sdb
                    ${listing.animauxAcceptes ? ' · 🐕 Animaux OK' : ''}
                </div>
                <div class="listing-footer">
                    <div class="listing-price">${listing.prix.toLocaleString()} DZD <span>/ nuit</span></div>
                    <div class="listing-rating">
                        <svg viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                        ${listing.note} (${listing.nbAvis})
                    </div>
                </div>
            </div>
        </div>
    `;
}

function openDetailModal(listingId) {
    const listing = LOGEMENTS.find(l => l.id === listingId);
    if (!listing) return;
    
    APP_STATE.selectedListing = listing;
    
    // Build modal content
    const modal = document.querySelector('#detail-modal');
    const modalContent = document.querySelector('#modal-detail-content');
    
    modalContent.innerHTML = `
        <div class="modal-gallery">
            <img src="${listing.images[0]}" alt="${listing.titre}" id="modal-main-image">
            <div class="modal-thumbnails">
                ${listing.images.map((img, i) => `
                    <img src="${img}" alt="${listing.titre}" 
                         onclick="changeModalImage('${img}')"
                         class="${i === 0 ? 'active' : ''}">
                `).join('')}
            </div>
        </div>
        
        <div class="modal-header">
            <div>
                <h2>${listing.titre}</h2>
                <div class="modal-meta">
                    <span>📍 ${listing.quartier}, ${listing.wilaya}</span>
                    <span>⭐ ${listing.note} (${listing.nbAvis} avis)</span>
                    ${listing.superhote ? '<span class="badge-superhote">Superhôte</span>' : ''}
                </div>
            </div>
            <button onclick="closeDetailModal()" class="modal-close">✕</button>
        </div>
        
        <div class="modal-body">
            <div class="modal-main">
                <div class="modal-host">
                    <img src="${listing.hote.photo}" alt="${listing.hote.nom}">
                    <div>
                        <strong>${listing.hote.nom}</strong>
                        <div>Hôte depuis ${listing.hote.inscription}</div>
                    </div>
                </div>
                
                <div class="modal-features">
                    <div><strong>${listing.voyageurs}</strong> voyageurs</div>
                    <div><strong>${listing.chambres}</strong> chambres</div>
                    <div><strong>${listing.lits}</strong> lits</div>
                    <div><strong>${listing.sallesBain}</strong> sdb</div>
                </div>
                
                <div class="modal-description">
                    <h3>À propos de ce logement</h3>
                    <p>${listing.description}</p>
                </div>
                
                <div class="modal-equipements">
                    <h3>Équipements</h3>
                    <div class="equipements-grid">
                        ${listing.equipements.map(eq => `<div>✓ ${eq}</div>`).join('')}
                    </div>
                </div>
                
                <div class="modal-regles">
                    <h3>Règles du logement</h3>
                    <div>🚭 ${listing.regles.fumeur ? 'Fumeur autorisé' : 'Non-fumeur'}</div>
                    <div>🎉 ${listing.regles.fetes ? 'Fêtes autorisées' : 'Pas de fêtes'}</div>
                    <div>🐕 ${listing.regles.animaux ? 'Animaux acceptés' : 'Animaux non acceptés'}</div>
                </div>
                
                <div class="modal-avis">
                    <h3>Avis clients</h3>
                    ${listing.avis.map(avis => `
                        <div class="avis-item">
                            <div class="avis-header">
                                <strong>${avis.auteur}</strong>
                                <span>${avis.date}</span>
                            </div>
                            <div class="avis-stars">${'⭐'.repeat(avis.note)}</div>
                            <p>${avis.texte}</p>
                        </div>
                    `).join('')}
                </div>
            </div>
            
            <div class="modal-sidebar">
                <div class="reservation-widget">
                    <div class="widget-price">${listing.prix.toLocaleString()} DZD <span>/ nuit</span></div>
                    <button onclick="goToReservation(${listing.id})" class="btn-reserve">Réserver</button>
                </div>
            </div>
        </div>
    `;
    
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

function closeDetailModal() {
    document.querySelector('#detail-modal').style.display = 'none';
    document.body.style.overflow = '';
}

function changeModalImage(src) {
    document.querySelector('#modal-main-image').src = src;
    document.querySelectorAll('.modal-thumbnails img').forEach(img => {
        img.classList.toggle('active', img.src === src);
    });
}

function goToReservation(listingId) {
    closeDetailModal();
    APP_STATE.selectedListing = LOGEMENTS.find(l => l.id === listingId);
    showPage('reservation');
    renderReservation();
}

function renderReservation() {
    const listing = APP_STATE.selectedListing;
    if (!listing) {
        showPage('accueil');
        return;
    }
    
    const container = document.querySelector('#reservation-content');
    if (!container) return;
    
    const v = APP_STATE.voyageurs;
    const totalVoyageurs = v.adultes + v.enfants + v.bebes;
    const totalAnimaux = v.chiens + v.chats + (v.autresAnimaux ? 1 : 0);
    
    container.innerHTML = `
        <div class="reservation-container">
            <h2>Finaliser la réservation</h2>
            
            <div class="reservation-listing">
                <img src="${listing.images[0]}" alt="${listing.titre}">
                <div>
                    <h3>${listing.titre}</h3>
                    <p>${listing.quartier}, ${listing.wilaya}</p>
                </div>
            </div>
            
            <div class="reservation-form">
                <h3>Voyageurs</h3>
                <div class="voyageurs-selector">
                    <div class="voyageur-item">
                        <div>
                            <strong>Adultes</strong>
                            <span>13 ans et plus</span>
                        </div>
                        <div class="counter">
                            <button data-minus="adultes" onclick="updateVoyageurs('adultes', -1)">−</button>
                            <span data-count="adultes">${v.adultes}</span>
                            <button data-plus="adultes" onclick="updateVoyageurs('adultes', 1)">+</button>
                        </div>
                    </div>
                    
                    <div class="voyageur-item">
                        <div>
                            <strong>Enfants</strong>
                            <span>2-12 ans</span>
                        </div>
                        <div class="counter">
                            <button data-minus="enfants" onclick="updateVoyageurs('enfants', -1)">−</button>
                            <span data-count="enfants">${v.enfants}</span>
                            <button data-plus="enfants" onclick="updateVoyageurs('enfants', 1)">+</button>
                        </div>
                    </div>
                    
                    <div class="voyageur-item">
                        <div>
                            <strong>Bébés</strong>
                            <span>Moins de 2 ans</span>
                        </div>
                        <div class="counter">
                            <button data-minus="bebes" onclick="updateVoyageurs('bebes', -1)">−</button>
                            <span data-count="bebes">${v.bebes}</span>
                            <button data-plus="bebes" onclick="updateVoyageurs('bebes', 1)">+</button>
                        </div>
                    </div>
                    
                    ${listing.animauxAcceptes ? `
                        <hr>
                        <h4>Animaux de compagnie</h4>
                        
                        <div class="voyageur-item">
                            <div>
                                <strong>🐕 Chiens</strong>
                                <span>Maximum 3</span>
                            </div>
                            <div class="counter">
                                <button data-minus="chiens" onclick="updateVoyageurs('chiens', -1)">−</button>
                                <span data-count="chiens">${v.chiens}</span>
                                <button data-plus="chiens" onclick="updateVoyageurs('chiens', 1)">+</button>
                            </div>
                        </div>
                        
                        <div class="voyageur-item">
                            <div>
                                <strong>🐈 Chats</strong>
                                <span>Maximum 3</span>
                            </div>
                            <div class="counter">
                                <button data-minus="chats" onclick="updateVoyageurs('chats', -1)">−</button>
                                <span data-count="chats">${v.chats}</span>
                                <button data-plus="chats" onclick="updateVoyageurs('chats', 1)">+</button>
                            </div>
                        </div>
                        
                        <div class="voyageur-item">
                            <div>
                                <strong>🐦 Autres animaux</strong>
                                <span>Oiseaux, rongeurs, etc.</span>
                            </div>
                            <label class="switch">
                                <input type="checkbox" ${v.autresAnimaux ? 'checked' : ''} 
                                       onchange="updateVoyageurs('autresAnimaux', 0)">
                                <span class="slider"></span>
                            </label>
                        </div>
                    ` : ''}
                </div>
                
                <h3>Options supplémentaires</h3>
                <div class="options-list">
                    <label>
                        <input type="checkbox" id="option-menage">
                        Ménage de fin de séjour (+2 000 DZD)
                    </label>
                    <label>
                        <input type="checkbox" id="option-transfert">
                        Transfert aéroport (+5 000 DZD)
                    </label>
                </div>
                
                <h3>Paiement</h3>
                <div class="payment-methods">
                    <label class="payment-option">
                        <input type="radio" name="payment" value="cib" checked>
                        <span>💳 CIB (Carte Interbancaire)</span>
                    </label>
                    <label class="payment-option">
                        <input type="radio" name="payment" value="edahabia">
                        <span>💳 Edahabia</span>
                    </label>
                    <label class="payment-option">
                        <input type="radio" name="payment" value="baridimob">
                        <span>📱 BaridiMob</span>
                    </label>
                    <label class="payment-option">
                        <input type="radio" name="payment" value="especes">
                        <span>💵 Espèces sur place</span>
                    </label>
                </div>
                
                <div class="reservation-total">
                    <div>
                        <strong>Total</strong>
                        <span class="total-amount">${listing.prix.toLocaleString()} DZD</span>
                    </div>
                    <button onclick="confirmReservation()" class="btn-confirm">Confirmer la réservation</button>
                </div>
            </div>
        </div>
    `;
    
    updateVoyageursButtons();
}

function confirmReservation() {
    showToast('✅ Réservation confirmée !', 3000);
    setTimeout(() => {
        showPage('profil');
    }, 1500);
}

// Init app
document.addEventListener('DOMContentLoaded', () => {
    // Init dark mode
    if (APP_STATE.darkMode) {
        document.body.classList.add('dark-mode');
    }
    
    // Init autocomplete
    initAutocomplete();
    
    // Init page
    showPage('accueil');
    
    // Update UI
    updateVoyageursDisplay();
    updateFavoriteButtons();
    
    // Load animations
    loadAnimations();
});

function loadAnimations() {
    if (typeof lottie === 'undefined') return;
    
    // Loader animation
    const loaderEl = document.querySelector('#loader-anim');
    if (loaderEl) {
        lottie.loadAnimation({
            container: loaderEl,
            renderer: 'svg',
            loop: true,
            autoplay: true,
            path: 'animations/n2_spinning_belo_rausch.json'
        });
    }
}

// Export for global access
window.showPage = showPage;
window.toggleFavorite = toggleFavorite;
window.openDetailModal = openDetailModal;
window.closeDetailModal = closeDetailModal;
window.updateVoyageurs = updateVoyageurs;
window.selectDestination = selectDestination;
window.goToReservation = goToReservation;
window.confirmReservation = confirmReservation;
window.toggleDarkMode = toggleDarkMode;
