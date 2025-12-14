/**
 * DarDZ - Application JavaScript Principale
 * Version 2.0 - Securisee et Accessible
 * @module app
 */

'use strict';

// ============================================
// ETAT GLOBAL DE L'APPLICATION
// ============================================

/**
 * Etat global de l'application
 * @type {Object}
 */
const APP_STATE = {
    currentPage: 'accueil',
    selectedListing: null,
    favorites: DarDZ.Utils.Storage.get('dardz_favorites', []),
    darkMode: DarDZ.Utils.Storage.get('dardz_darkMode', false),
    focusTrap: null,
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

// ============================================
// NAVIGATION SPA
// ============================================

/**
 * Affiche une page specifique de l'application
 * @param {string} pageName - Nom de la page a afficher
 */
function showPage(pageName) {
    try {
        // Cacher toutes les pages
        document.querySelectorAll('[data-page]').forEach(page => {
            page.style.display = 'none';
            page.setAttribute('aria-hidden', 'true');
        });

        // Afficher la page demandee
        const page = document.querySelector(`[data-page="${escapeAttr(pageName)}"]`);
        if (page) {
            page.style.display = 'block';
            page.setAttribute('aria-hidden', 'false');
            APP_STATE.currentPage = pageName;

            // Mise a jour navigation active
            document.querySelectorAll('.nav-link').forEach(link => {
                link.classList.remove('active');
                link.setAttribute('aria-current', 'false');
            });

            const activeLink = document.querySelector(`[data-nav="${escapeAttr(pageName)}"]`);
            if (activeLink) {
                activeLink.classList.add('active');
                activeLink.setAttribute('aria-current', 'page');
            }

            // Scroll to top
            window.scrollTo({ top: 0, behavior: 'smooth' });

            // Init page specifique
            initPage(pageName);

            // Annoncer le changement de page
            DarDZ.Utils.A11y.announce(`Page ${pageName} chargee`);
        }
    } catch (error) {
        DarDZ.Utils.log.error('showPage error:', error);
    }
}

/**
 * Initialise le contenu d'une page
 * @param {string} pageName - Nom de la page
 */
function initPage(pageName) {
    switch (pageName) {
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

// ============================================
// GESTION DES VOYAGEURS
// ============================================

/**
 * Met a jour le nombre de voyageurs
 * @param {string} type - Type de voyageur (adultes, enfants, etc.)
 * @param {number} delta - Valeur a ajouter (+1 ou -1)
 */
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
    } else if (limits[type]) {
        const newValue = current + delta;
        const limit = limits[type];

        if (newValue >= limit.min && newValue <= limit.max) {
            APP_STATE.voyageurs[type] = newValue;
        }
    }

    updateVoyageursDisplay();
}

/**
 * Met a jour l'affichage du nombre de voyageurs
 */
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

    // Mise a jour des compteurs
    Object.keys(v).forEach(key => {
        if (key !== 'autresAnimaux') {
            const el = document.querySelector(`[data-count="${escapeAttr(key)}"]`);
            if (el) el.textContent = v[key];
        }
    });

    updateVoyageursButtons();
}

/**
 * Met a jour l'etat des boutons +/-
 */
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
        const minusBtn = document.querySelector(`[data-minus="${escapeAttr(key)}"]`);
        const plusBtn = document.querySelector(`[data-plus="${escapeAttr(key)}"]`);

        if (minusBtn) {
            const isDisabled = v[key] <= limits[key].min;
            minusBtn.disabled = isDisabled;
            minusBtn.setAttribute('aria-disabled', isDisabled.toString());
        }
        if (plusBtn) {
            const isDisabled = v[key] >= limits[key].max;
            plusBtn.disabled = isDisabled;
            plusBtn.setAttribute('aria-disabled', isDisabled.toString());
        }
    });
}

// ============================================
// GESTION DES FAVORIS
// ============================================

/**
 * Ajoute ou retire un logement des favoris
 * @param {number} listingId - ID du logement
 */
function toggleFavorite(listingId) {
    const index = APP_STATE.favorites.indexOf(listingId);
    let message;

    if (index === -1) {
        APP_STATE.favorites.push(listingId);
        message = 'Ajoute aux favoris';
    } else {
        APP_STATE.favorites.splice(index, 1);
        message = 'Retire des favoris';
    }

    DarDZ.Utils.Storage.set('dardz_favorites', APP_STATE.favorites);
    updateFavoriteButtons();
    showToast(message);
    DarDZ.Utils.A11y.announce(message);
}

/**
 * Verifie si un logement est en favori
 * @param {number} listingId - ID du logement
 * @returns {boolean}
 */
function isFavorite(listingId) {
    return APP_STATE.favorites.includes(listingId);
}

/**
 * Met a jour l'affichage des boutons favoris
 */
function updateFavoriteButtons() {
    document.querySelectorAll('[data-favorite]').forEach(btn => {
        const listingId = parseInt(btn.dataset.favorite, 10);
        const isFav = isFavorite(listingId);
        btn.classList.toggle('active', isFav);
        btn.setAttribute('aria-pressed', isFav.toString());
        btn.setAttribute('aria-label', isFav ? 'Retirer des favoris' : 'Ajouter aux favoris');

        const svg = btn.querySelector('svg');
        if (svg) {
            svg.style.fill = isFav ? '#C65D3B' : 'none';
        }
    });
}

// ============================================
// NOTIFICATIONS TOAST
// ============================================

/**
 * Affiche une notification toast
 * @param {string} message - Message a afficher
 * @param {number} duration - Duree en ms
 */
function showToast(message, duration = 3000) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.setAttribute('role', 'alert');
    toast.setAttribute('aria-live', 'assertive');
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

// ============================================
// MODE SOMBRE
// ============================================

/**
 * Active/desactive le mode sombre
 */
function toggleDarkMode() {
    APP_STATE.darkMode = !APP_STATE.darkMode;
    document.body.classList.toggle('dark-mode', APP_STATE.darkMode);
    DarDZ.Utils.Storage.set('dardz_darkMode', APP_STATE.darkMode);

    const icon = document.querySelector('#dark-mode-toggle svg use');
    if (icon) {
        icon.setAttribute('href', APP_STATE.darkMode ? '#icon-sun' : '#icon-moon');
    }

    DarDZ.Utils.A11y.announce(APP_STATE.darkMode ? 'Mode sombre active' : 'Mode clair active');
}

// ============================================
// AUTOCOMPLETE WILAYAS
// ============================================

/**
 * Initialise l'autocomplete des wilayas
 */
function initAutocomplete() {
    const input = document.querySelector('#destination-input');
    const dropdown = document.querySelector('#destination-dropdown');

    if (!input || !dropdown) return;

    const handleInput = DarDZ.Utils.Helpers.debounce((e) => {
        const query = e.target.value.toLowerCase().trim();

        if (query.length === 0) {
            dropdown.style.display = 'none';
            dropdown.setAttribute('aria-hidden', 'true');
            return;
        }

        const matches = WILAYAS.filter(w => w.toLowerCase().includes(query));

        if (matches.length > 0) {
            dropdown.innerHTML = matches.map((wilaya, index) => `
                <div class="dropdown-item"
                     role="option"
                     tabindex="0"
                     data-wilaya="${escapeAttr(wilaya)}"
                     id="wilaya-option-${index}">
                    <span>${escapeHTML(wilaya)}</span>
                </div>
            `).join('');
            dropdown.style.display = 'block';
            dropdown.setAttribute('aria-hidden', 'false');

            // Ajouter les event listeners
            dropdown.querySelectorAll('.dropdown-item').forEach(item => {
                item.addEventListener('click', () => selectDestination(item.dataset.wilaya));
                item.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        selectDestination(item.dataset.wilaya);
                    }
                });
            });
        } else {
            dropdown.style.display = 'none';
            dropdown.setAttribute('aria-hidden', 'true');
        }
    }, 200);

    input.addEventListener('input', handleInput);
}

/**
 * Selectionne une destination
 * @param {string} wilaya - Nom de la wilaya
 */
function selectDestination(wilaya) {
    const input = document.querySelector('#destination-input');
    const dropdown = document.querySelector('#destination-dropdown');

    if (input) input.value = wilaya;
    if (dropdown) {
        dropdown.style.display = 'none';
        dropdown.setAttribute('aria-hidden', 'true');
    }

    APP_STATE.searchFilters.destination = wilaya;
    DarDZ.Utils.A11y.announce(`Destination selectionnee: ${wilaya}`);
}

// ============================================
// RECHERCHE ET FILTRES
// ============================================

/**
 * Effectue une recherche avec les filtres actuels
 * @returns {Array} Resultats de la recherche
 */
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

    // Filtre voyageurs (capacite)
    const totalVoyageurs = voyageurs.adultes + voyageurs.enfants + voyageurs.bebes;
    results = results.filter(l => l.voyageurs >= totalVoyageurs);

    return results;
}

// ============================================
// RENDU DES PAGES
// ============================================

/**
 * Rend la page d'accueil
 */
function renderAccueil() {
    const container = document.querySelector('#accueil-listings');
    if (!container) return;

    try {
        const featured = LOGEMENTS.slice(0, 6);
        container.innerHTML = featured.map(listing => createListingCard(listing)).join('');
        attachListingEventListeners(container);
        updateFavoriteButtons();
    } catch (error) {
        DarDZ.Utils.log.error('renderAccueil error:', error);
        container.innerHTML = createErrorState();
    }
}

/**
 * Rend la page explorer
 */
function renderExplorer() {
    const container = document.querySelector('#explorer-listings');
    if (!container) return;

    try {
        const results = performSearch();
        container.innerHTML = results.map(listing => createListingCard(listing)).join('');
        attachListingEventListeners(container);
        updateFavoriteButtons();
    } catch (error) {
        DarDZ.Utils.log.error('renderExplorer error:', error);
        container.innerHTML = createErrorState();
    }
}

/**
 * Rend la page favoris
 */
function renderFavoris() {
    const container = document.querySelector('#favoris-listings');
    if (!container) return;

    try {
        const favoriteListings = LOGEMENTS.filter(l => isFavorite(l.id));

        if (favoriteListings.length === 0) {
            container.innerHTML = createEmptyState();
            loadEmptyStateAnimation();
        } else {
            container.innerHTML = favoriteListings.map(listing => createListingCard(listing)).join('');
            attachListingEventListeners(container);
            updateFavoriteButtons();
        }
    } catch (error) {
        DarDZ.Utils.log.error('renderFavoris error:', error);
        container.innerHTML = createErrorState();
    }
}

/**
 * Rend la page profil
 */
function renderProfil() {
    // Implementation profil page
}

/**
 * Rend la page messages
 */
function renderMessages() {
    // Implementation messages page
}

/**
 * Rend la page devenir hote
 */
function renderDevenirHote() {
    // Implementation devenir hote page
}

// ============================================
// CREATION DES COMPOSANTS
// ============================================

/**
 * Cree une carte de logement
 * @param {Object} listing - Donnees du logement
 * @returns {string} HTML de la carte
 */
function createListingCard(listing) {
    const s = DarDZ.Utils.Security;
    const isFav = isFavorite(listing.id);

    return `
        <article class="listing-card"
                 data-listing-id="${listing.id}"
                 tabindex="0"
                 role="button"
                 aria-label="${s.escapeAttr(listing.titre)} - ${listing.prix.toLocaleString()} DZD par nuit">
            <div class="listing-image">
                <img src="${s.escapeAttr(listing.images[0])}"
                     alt="${s.escapeAttr(listing.titre)}"
                     loading="lazy"
                     onerror="this.src='images/placeholder.svg'">
                ${listing.superhote ? `
                    <div class="listing-badge gold" aria-label="Superhote">
                        <img src="images/ui_res_pdp_reviews_guestfavoriteheader__left_3d_laurel_gold.webp"
                             alt="" aria-hidden="true"
                             style="width:16px;height:16px;margin-right:3px;">
                        Superhote
                    </div>
                ` : ''}
                <button class="listing-favorite ${isFav ? 'active' : ''}"
                        data-favorite="${listing.id}"
                        aria-label="${isFav ? 'Retirer des favoris' : 'Ajouter aux favoris'}"
                        aria-pressed="${isFav}">
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                    </svg>
                </button>
            </div>
            <div class="listing-info">
                <div class="listing-location">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                        <circle cx="12" cy="10" r="3"></circle>
                    </svg>
                    ${s.escapeHTML(listing.quartier)}, ${s.escapeHTML(listing.wilaya)}
                </div>
                <h3 class="listing-title">${s.escapeHTML(listing.titre)}</h3>
                <div class="listing-details">
                    ${listing.voyageurs} voyageurs · ${listing.chambres} chambres · ${listing.sallesBain} sdb
                    ${listing.animauxAcceptes ? ' · <span aria-label="Animaux acceptes">🐕 Animaux OK</span>' : ''}
                </div>
                <div class="listing-footer">
                    <div class="listing-price">
                        <data value="${listing.prix}">${listing.prix.toLocaleString()} DZD</data>
                        <span>/ nuit</span>
                    </div>
                    <div class="listing-rating" aria-label="Note ${listing.note} sur 5, ${listing.nbAvis} avis">
                        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                        ${listing.note} (${listing.nbAvis})
                    </div>
                </div>
            </div>
        </article>
    `;
}

/**
 * Attache les event listeners aux cartes de logement
 * @param {HTMLElement} container - Conteneur des cartes
 */
function attachListingEventListeners(container) {
    container.querySelectorAll('.listing-card').forEach(card => {
        const listingId = parseInt(card.dataset.listingId, 10);

        // Click sur la carte
        card.addEventListener('click', (e) => {
            if (!e.target.closest('.listing-favorite')) {
                openDetailModal(listingId);
            }
        });

        // Navigation clavier
        card.addEventListener('keydown', (e) => {
            if ((e.key === 'Enter' || e.key === ' ') && !e.target.closest('.listing-favorite')) {
                e.preventDefault();
                openDetailModal(listingId);
            }
        });
    });

    // Boutons favoris
    container.querySelectorAll('.listing-favorite').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const listingId = parseInt(btn.dataset.favorite, 10);
            toggleFavorite(listingId);
        });
    });
}

/**
 * Cree un etat vide
 * @returns {string} HTML de l'etat vide
 */
function createEmptyState() {
    return `
        <div class="empty-state" role="status">
            <div id="empty-anim" style="width: 200px; height: 200px; margin: 0 auto;" aria-hidden="true"></div>
            <h3>Aucun favori pour le moment</h3>
            <p>Explorez nos logements et ajoutez vos coups de coeur !</p>
            <button class="btn-primary" data-action="navigate" data-page="explorer">Explorer</button>
        </div>
    `;
}

/**
 * Cree un etat d'erreur
 * @returns {string} HTML de l'etat d'erreur
 */
function createErrorState() {
    return `
        <div class="error-state" role="alert">
            <h3>Une erreur est survenue</h3>
            <p>Impossible de charger les logements.</p>
            <button class="btn-primary" onclick="location.reload()">Reessayer</button>
        </div>
    `;
}

/**
 * Charge l'animation de l'etat vide
 */
function loadEmptyStateAnimation() {
    if (typeof lottie !== 'undefined') {
        const container = document.getElementById('empty-anim');
        if (container) {
            lottie.loadAnimation({
                container: container,
                renderer: 'svg',
                loop: true,
                autoplay: true,
                path: 'animations/n2_saved_emptry_state.json'
            });
        }
    }
}

// ============================================
// MODAL DETAIL
// ============================================

/**
 * Ouvre la modale de detail d'un logement
 * @param {number} listingId - ID du logement
 */
function openDetailModal(listingId) {
    const listing = LOGEMENTS.find(l => l.id === listingId);
    if (!listing) {
        DarDZ.Utils.log.error('Listing not found:', listingId);
        return;
    }

    APP_STATE.selectedListing = listing;

    const modal = document.querySelector('#detail-modal');
    const modalContent = document.querySelector('#modal-detail-content');

    if (!modal || !modalContent) return;

    const s = DarDZ.Utils.Security;

    modalContent.innerHTML = `
        <div class="modal-gallery">
            <img src="${s.escapeAttr(listing.images[0])}"
                 alt="${s.escapeAttr(listing.titre)}"
                 id="modal-main-image"
                 loading="lazy">
            <div class="modal-thumbnails" role="listbox" aria-label="Galerie photos">
                ${listing.images.map((img, i) => `
                    <img src="${s.escapeAttr(img)}"
                         alt="Photo ${i + 1} de ${s.escapeAttr(listing.titre)}"
                         role="option"
                         tabindex="0"
                         data-src="${s.escapeAttr(img)}"
                         class="${i === 0 ? 'active' : ''}"
                         aria-selected="${i === 0}">
                `).join('')}
            </div>
        </div>

        <div class="modal-header">
            <div>
                <h2 id="modal-title">${s.escapeHTML(listing.titre)}</h2>
                <div class="modal-meta">
                    <span>📍 ${s.escapeHTML(listing.quartier)}, ${s.escapeHTML(listing.wilaya)}</span>
                    <span aria-label="Note ${listing.note} sur 5">⭐ ${listing.note} (${listing.nbAvis} avis)</span>
                    ${listing.superhote ? '<span class="badge-superhote">Superhote</span>' : ''}
                </div>
            </div>
            <button class="modal-close"
                    aria-label="Fermer la modale"
                    data-action="close-modal">✕</button>
        </div>

        <div class="modal-body">
            <div class="modal-main">
                <div class="modal-host">
                    <img src="${s.escapeAttr(listing.hote.photo)}"
                         alt="Photo de ${s.escapeAttr(listing.hote.nom)}"
                         loading="lazy">
                    <div>
                        <strong>${s.escapeHTML(listing.hote.nom)}</strong>
                        <div>Hote depuis ${s.escapeHTML(listing.hote.inscription)}</div>
                    </div>
                </div>

                <div class="modal-features" role="list" aria-label="Caracteristiques">
                    <div role="listitem"><strong>${listing.voyageurs}</strong> voyageurs</div>
                    <div role="listitem"><strong>${listing.chambres}</strong> chambres</div>
                    <div role="listitem"><strong>${listing.lits}</strong> lits</div>
                    <div role="listitem"><strong>${listing.sallesBain}</strong> sdb</div>
                </div>

                <div class="modal-description">
                    <h3>A propos de ce logement</h3>
                    <p>${s.escapeHTML(listing.description)}</p>
                </div>

                <div class="modal-equipements">
                    <h3>Equipements</h3>
                    <div class="equipements-grid" role="list">
                        ${listing.equipements.map(eq => `<div role="listitem">✓ ${s.escapeHTML(eq)}</div>`).join('')}
                    </div>
                </div>

                <div class="modal-regles">
                    <h3>Regles du logement</h3>
                    <div>🚭 ${listing.regles.fumeur ? 'Fumeur autorise' : 'Non-fumeur'}</div>
                    <div>🎉 ${listing.regles.fetes ? 'Fetes autorisees' : 'Pas de fetes'}</div>
                    <div>🐕 ${listing.regles.animaux ? 'Animaux acceptes' : 'Animaux non acceptes'}</div>
                </div>

                <div class="modal-avis">
                    <h3>Avis clients</h3>
                    ${listing.avis.map(avis => `
                        <div class="avis-item">
                            <div class="avis-header">
                                <strong>${s.escapeHTML(avis.auteur)}</strong>
                                <span>${s.escapeHTML(avis.date)}</span>
                            </div>
                            <div class="avis-stars" aria-label="Note ${avis.note} sur 5">${'⭐'.repeat(avis.note)}</div>
                            <p>${s.escapeHTML(avis.texte)}</p>
                        </div>
                    `).join('')}
                </div>
            </div>

            <div class="modal-sidebar">
                <div class="reservation-widget">
                    <div class="widget-price">
                        <data value="${listing.prix}">${listing.prix.toLocaleString()} DZD</data>
                        <span>/ nuit</span>
                    </div>
                    <button class="btn-reserve" data-action="reserve" data-listing-id="${listing.id}">Reserver</button>
                </div>
            </div>
        </div>
    `;

    // Afficher la modale
    modal.style.display = 'flex';
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    // Attacher les event listeners
    attachModalEventListeners(modal);

    // Focus trap
    APP_STATE.focusTrap = DarDZ.Utils.A11y.trapFocus(modal);

    // Annoncer
    DarDZ.Utils.A11y.announce(`Modale ouverte: ${listing.titre}`);
}

/**
 * Attache les event listeners a la modale
 * @param {HTMLElement} modal - Element modal
 */
function attachModalEventListeners(modal) {
    // Bouton fermer
    modal.querySelectorAll('[data-action="close-modal"]').forEach(btn => {
        btn.addEventListener('click', closeDetailModal);
    });

    // Bouton reserver
    modal.querySelectorAll('[data-action="reserve"]').forEach(btn => {
        btn.addEventListener('click', () => {
            const listingId = parseInt(btn.dataset.listingId, 10);
            goToReservation(listingId);
        });
    });

    // Thumbnails
    modal.querySelectorAll('.modal-thumbnails img').forEach(img => {
        const handleSelect = () => changeModalImage(img.dataset.src);
        img.addEventListener('click', handleSelect);
        img.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleSelect();
            }
        });
    });

    // Fermer avec Escape
    modal.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeDetailModal();
        }
    });

    // Clic en dehors
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeDetailModal();
        }
    });
}

/**
 * Ferme la modale de detail
 */
function closeDetailModal() {
    const modal = document.querySelector('#detail-modal');
    if (!modal) return;

    modal.style.display = 'none';
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';

    // Liberer le focus trap
    if (APP_STATE.focusTrap) {
        APP_STATE.focusTrap.release();
        APP_STATE.focusTrap = null;
    }

    DarDZ.Utils.A11y.announce('Modale fermee');
}

/**
 * Change l'image principale de la modale
 * @param {string} src - URL de l'image
 */
function changeModalImage(src) {
    const mainImage = document.querySelector('#modal-main-image');
    if (mainImage) {
        mainImage.src = src;
    }

    document.querySelectorAll('.modal-thumbnails img').forEach(img => {
        const isActive = img.dataset.src === src;
        img.classList.toggle('active', isActive);
        img.setAttribute('aria-selected', isActive.toString());
    });
}

// ============================================
// RESERVATION
// ============================================

/**
 * Redirige vers la page de reservation
 * @param {number} listingId - ID du logement
 */
function goToReservation(listingId) {
    closeDetailModal();
    APP_STATE.selectedListing = LOGEMENTS.find(l => l.id === listingId);
    showPage('reservation');
    renderReservation();
}

/**
 * Rend la page de reservation
 */
function renderReservation() {
    const listing = APP_STATE.selectedListing;
    if (!listing) {
        showPage('accueil');
        return;
    }

    const container = document.querySelector('#reservation-content');
    if (!container) return;

    const s = DarDZ.Utils.Security;
    const v = APP_STATE.voyageurs;

    container.innerHTML = `
        <div class="reservation-container">
            <h2>Finaliser la reservation</h2>

            <div class="reservation-listing">
                <img src="${s.escapeAttr(listing.images[0])}"
                     alt="${s.escapeAttr(listing.titre)}"
                     loading="lazy">
                <div>
                    <h3>${s.escapeHTML(listing.titre)}</h3>
                    <p>${s.escapeHTML(listing.quartier)}, ${s.escapeHTML(listing.wilaya)}</p>
                </div>
            </div>

            <div class="reservation-form">
                <h3 id="voyageurs-heading">Voyageurs</h3>
                <div class="voyageurs-selector" role="group" aria-labelledby="voyageurs-heading">
                    ${createVoyageurItem('adultes', 'Adultes', '13 ans et plus', v.adultes)}
                    ${createVoyageurItem('enfants', 'Enfants', '2-12 ans', v.enfants)}
                    ${createVoyageurItem('bebes', 'Bebes', 'Moins de 2 ans', v.bebes)}

                    ${listing.animauxAcceptes ? `
                        <hr>
                        <h4 id="animaux-heading">Animaux de compagnie</h4>
                        ${createVoyageurItem('chiens', '🐕 Chiens', 'Maximum 3', v.chiens)}
                        ${createVoyageurItem('chats', '🐈 Chats', 'Maximum 3', v.chats)}
                        <div class="voyageur-item">
                            <div>
                                <strong>🐦 Autres animaux</strong>
                                <span>Oiseaux, rongeurs, etc.</span>
                            </div>
                            <label class="switch">
                                <input type="checkbox" ${v.autresAnimaux ? 'checked' : ''}
                                       id="autres-animaux-toggle"
                                       aria-label="Autres animaux">
                                <span class="slider"></span>
                            </label>
                        </div>
                    ` : ''}
                </div>

                <h3>Options supplementaires</h3>
                <div class="options-list">
                    <label>
                        <input type="checkbox" id="option-menage">
                        Menage de fin de sejour (+2 000 DZD)
                    </label>
                    <label>
                        <input type="checkbox" id="option-transfert">
                        Transfert aeroport (+5 000 DZD)
                    </label>
                </div>

                <h3 id="payment-heading">Paiement</h3>
                <div class="payment-methods" role="radiogroup" aria-labelledby="payment-heading">
                    ${createPaymentOption('cib', '💳 CIB (Carte Interbancaire)', true)}
                    ${createPaymentOption('edahabia', '💳 Edahabia', false)}
                    ${createPaymentOption('baridimob', '📱 BaridiMob', false)}
                    ${createPaymentOption('especes', '💵 Especes sur place', false)}
                </div>

                <div class="reservation-total">
                    <div>
                        <strong>Total</strong>
                        <span class="total-amount">
                            <data value="${listing.prix}">${listing.prix.toLocaleString()} DZD</data>
                        </span>
                    </div>
                    <button class="btn-confirm" data-action="confirm-reservation">Confirmer la reservation</button>
                </div>
            </div>
        </div>
    `;

    attachReservationEventListeners(container);
    updateVoyageursButtons();
}

/**
 * Cree un item de selection de voyageur
 * @param {string} type - Type de voyageur
 * @param {string} label - Label
 * @param {string} description - Description
 * @param {number} value - Valeur actuelle
 * @returns {string} HTML
 */
function createVoyageurItem(type, label, description, value) {
    return `
        <div class="voyageur-item">
            <div>
                <strong>${escapeHTML(label)}</strong>
                <span>${escapeHTML(description)}</span>
            </div>
            <div class="counter" role="group" aria-label="${label}">
                <button data-minus="${type}"
                        aria-label="Reduire ${label}"
                        class="counter-btn">−</button>
                <span data-count="${type}" aria-live="polite">${value}</span>
                <button data-plus="${type}"
                        aria-label="Augmenter ${label}"
                        class="counter-btn">+</button>
            </div>
        </div>
    `;
}

/**
 * Cree une option de paiement
 * @param {string} value - Valeur
 * @param {string} label - Label
 * @param {boolean} checked - Est cochee
 * @returns {string} HTML
 */
function createPaymentOption(value, label, checked) {
    return `
        <label class="payment-option">
            <input type="radio" name="payment" value="${value}" ${checked ? 'checked' : ''}>
            <span>${label}</span>
        </label>
    `;
}

/**
 * Attache les event listeners a la page de reservation
 * @param {HTMLElement} container - Conteneur
 */
function attachReservationEventListeners(container) {
    // Boutons +/-
    container.querySelectorAll('[data-minus]').forEach(btn => {
        btn.addEventListener('click', () => updateVoyageurs(btn.dataset.minus, -1));
    });

    container.querySelectorAll('[data-plus]').forEach(btn => {
        btn.addEventListener('click', () => updateVoyageurs(btn.dataset.plus, 1));
    });

    // Toggle autres animaux
    const autresToggle = container.querySelector('#autres-animaux-toggle');
    if (autresToggle) {
        autresToggle.addEventListener('change', () => updateVoyageurs('autresAnimaux', 0));
    }

    // Bouton confirmer
    container.querySelectorAll('[data-action="confirm-reservation"]').forEach(btn => {
        btn.addEventListener('click', confirmReservation);
    });
}

/**
 * Confirme la reservation
 */
function confirmReservation() {
    showToast('Reservation confirmee !');
    DarDZ.Utils.A11y.announce('Reservation confirmee avec succes');
    setTimeout(() => {
        showPage('profil');
    }, 1500);
}

// ============================================
// ANIMATIONS
// ============================================

/**
 * Charge les animations Lottie
 */
function loadAnimations() {
    if (typeof lottie === 'undefined') return;

    // Observer pour charger les animations uniquement quand visibles
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const container = entry.target;
                const path = container.dataset.animationPath;

                if (path && !container.dataset.loaded) {
                    lottie.loadAnimation({
                        container: container,
                        renderer: 'svg',
                        loop: true,
                        autoplay: true,
                        path: path
                    });
                    container.dataset.loaded = 'true';
                }

                observer.unobserve(container);
            }
        });
    });

    // Observer tous les conteneurs d'animation
    document.querySelectorAll('[data-animation-path]').forEach(container => {
        observer.observe(container);
    });

    // Loader animation (toujours charger immediatement)
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

// ============================================
// INITIALISATION
// ============================================

/**
 * Initialise l'application
 */
function initApp() {
    try {
        // Init accessibilite
        DarDZ.Utils.A11y.init();

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

        // Global event delegation
        setupGlobalEventListeners();

        DarDZ.Utils.log.info('App initialized successfully');
    } catch (error) {
        DarDZ.Utils.log.error('App initialization failed:', error);
    }
}

/**
 * Configure les event listeners globaux
 */
function setupGlobalEventListeners() {
    // Event delegation pour les actions communes
    document.addEventListener('click', (e) => {
        const target = e.target.closest('[data-action]');
        if (!target) return;

        const action = target.dataset.action;

        switch (action) {
            case 'navigate':
                e.preventDefault();
                showPage(target.dataset.page);
                break;
            case 'close-modal':
                closeDetailModal();
                break;
        }
    });

    // Navigation clavier globale
    document.addEventListener('keydown', (e) => {
        // Skip links avec Tab
        if (e.key === 'Tab' && !e.shiftKey) {
            const skipLink = document.querySelector('.skip-link');
            if (skipLink && document.activeElement === document.body) {
                skipLink.focus();
            }
        }
    });

    // Respecter prefers-reduced-motion
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mediaQuery.matches) {
        document.documentElement.style.setProperty('--animation-duration', '0.01ms');
    }
}

// ============================================
// DEMARRAGE
// ============================================

document.addEventListener('DOMContentLoaded', initApp);

// ============================================
// EXPORTS GLOBAUX
// ============================================

window.showPage = showPage;
window.toggleFavorite = toggleFavorite;
window.openDetailModal = openDetailModal;
window.closeDetailModal = closeDetailModal;
window.updateVoyageurs = updateVoyageurs;
window.selectDestination = selectDestination;
window.goToReservation = goToReservation;
window.confirmReservation = confirmReservation;
window.toggleDarkMode = toggleDarkMode;
window.changeModalImage = changeModalImage;
