# PLAN D'AMELIORATION 100% - DarDZ

## Objectif: Passer de 72/100 a 100/100

---

## PHASE 1: SECURITE (55 -> 100)
**Duree estimee: 2-3 heures**

### 1.1 Corriger les vulnerabilites XSS

#### Tache 1.1.1: Creer une fonction d'echappement HTML
```javascript
// Ajouter dans js/app.js
const Utils = {
    escapeHTML(str) {
        if (!str) return '';
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    },

    sanitizeObject(obj) {
        const sanitized = {};
        for (const key in obj) {
            if (typeof obj[key] === 'string') {
                sanitized[key] = this.escapeHTML(obj[key]);
            } else {
                sanitized[key] = obj[key];
            }
        }
        return sanitized;
    }
};
```

#### Tache 1.1.2: Securiser toutes les insertions innerHTML
**Fichiers a modifier:**
- `js/app.js` lignes: 239, 295, 304, 315, 335, 407, 528
- `index.html` lignes: 2043, 2093

**Exemple de correction:**
```javascript
// AVANT (vulnerable)
dropdown.innerHTML = matches.map(wilaya => `
    <div onclick="selectDestination('${wilaya}')">${wilaya}</div>
`).join('');

// APRES (securise)
dropdown.innerHTML = matches.map(wilaya => `
    <div onclick="selectDestination('${Utils.escapeHTML(wilaya)}')">${Utils.escapeHTML(wilaya)}</div>
`).join('');
```

#### Tache 1.1.3: Remplacer les inline onclick par addEventListener
```javascript
// AVANT
<button onclick="toggleFavorite(1)">

// APRES
<button data-action="favorite" data-id="1">

// JS
document.addEventListener('click', (e) => {
    if (e.target.matches('[data-action="favorite"]')) {
        toggleFavorite(parseInt(e.target.dataset.id));
    }
});
```

### 1.2 Securiser le LocalStorage

#### Tache 1.2.1: Ajouter une gestion d'erreurs robuste
```javascript
const Storage = {
    get(key, fallback = null) {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : fallback;
        } catch (e) {
            console.warn(`Storage.get error for ${key}:`, e);
            return fallback;
        }
    },

    set(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (e) {
            console.warn(`Storage.set error for ${key}:`, e);
            return false;
        }
    },

    remove(key) {
        try {
            localStorage.removeItem(key);
            return true;
        } catch (e) {
            return false;
        }
    }
};

// Utilisation
APP_STATE.favorites = Storage.get('dardz_favorites', []);
```

### 1.3 Nettoyer le code de production

#### Tache 1.3.1: Supprimer tous les console.log
```bash
# Rechercher et supprimer
grep -rn "console\." js/ index.html
```

#### Tache 1.3.2: Ajouter un mode debug conditionnel
```javascript
const DEBUG = false; // Mettre a true pour dev

const log = {
    info: (...args) => DEBUG && console.log('[INFO]', ...args),
    warn: (...args) => DEBUG && console.warn('[WARN]', ...args),
    error: (...args) => console.error('[ERROR]', ...args) // Toujours actif
};
```

### 1.4 Ajouter les headers de securite (si serveur)
```
Content-Security-Policy: default-src 'self'; script-src 'self' https://cdnjs.cloudflare.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src https://fonts.gstatic.com; img-src 'self' https://images.unsplash.com https://i.pravatar.cc data:;
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
```

---

## PHASE 2: PERFORMANCE (70 -> 100)
**Duree estimee: 3-4 heures**

### 2.1 Optimiser les images

#### Tache 2.1.1: Implementer le lazy loading natif
```html
<!-- Ajouter loading="lazy" a toutes les images -->
<img loading="lazy" src="image.jpg" alt="Description">
```

#### Tache 2.1.2: Ajouter des images placeholder/blur
```javascript
// Creer un composant image avec placeholder
function createLazyImage(src, alt) {
    return `
        <div class="lazy-image-wrapper">
            <img
                src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 300'%3E%3Crect fill='%23f5e6d3' width='400' height='300'/%3E%3C/svg%3E"
                data-src="${src}"
                alt="${alt}"
                loading="lazy"
                onload="this.src=this.dataset.src; this.onload=null;"
            >
        </div>
    `;
}
```

#### Tache 2.1.3: Utiliser srcset pour les images responsives
```html
<img
    srcset="image-400.jpg 400w,
            image-800.jpg 800w,
            image-1200.jpg 1200w"
    sizes="(max-width: 600px) 400px,
           (max-width: 1200px) 800px,
           1200px"
    src="image-800.jpg"
    alt="Description"
    loading="lazy"
>
```

### 2.2 Optimiser le CSS

#### Tache 2.2.1: Extraire le CSS inline vers styles.css
1. Copier tout le contenu de `<style>` dans index.html
2. Coller dans css/styles.css
3. Supprimer le `<style>` de index.html
4. Ajouter `<link rel="stylesheet" href="css/styles.css">`

#### Tache 2.2.2: Creer un fichier CSS critique
```html
<!-- Dans <head> - CSS critique inline -->
<style>
    /* Uniquement le CSS pour le above-the-fold */
    :root { --terracotta: #C65D3B; --ocean: #1E6B7B; }
    body { font-family: 'DM Sans', sans-serif; margin: 0; }
    .header { background: linear-gradient(135deg, #134852, #1E6B7B); padding: 15px 20px; }
    .loader { display: flex; position: fixed; inset: 0; background: #FBF7F2; z-index: 9999; }
</style>

<!-- CSS complet en async -->
<link rel="preload" href="css/styles.css" as="style" onload="this.onload=null;this.rel='stylesheet'">
<noscript><link rel="stylesheet" href="css/styles.css"></noscript>
```

#### Tache 2.2.3: Minifier CSS et JS
```bash
# Installer des outils
npm install -g cssnano terser

# Minifier
cssnano css/styles.css css/styles.min.css
terser js/app.js -o js/app.min.js
terser js/data.js -o js/data.min.js
```

### 2.3 Optimiser les animations Lottie

#### Tache 2.3.1: Charger les animations a la demande
```javascript
const AnimationLoader = {
    cache: {},

    async load(containerId, path) {
        if (this.cache[path]) {
            return this.cache[path];
        }

        const container = document.getElementById(containerId);
        if (!container) return null;

        // Observer pour charger seulement quand visible
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const anim = lottie.loadAnimation({
                        container: container,
                        renderer: 'svg',
                        loop: true,
                        autoplay: true,
                        path: path
                    });
                    this.cache[path] = anim;
                    observer.disconnect();
                }
            });
        });

        observer.observe(container);
    }
};
```

### 2.4 Implementer le Service Worker

#### Tache 2.4.1: Creer sw.js
```javascript
// sw.js
const CACHE_NAME = 'dardz-v1';
const ASSETS = [
    '/',
    '/index.html',
    '/css/styles.css',
    '/js/app.js',
    '/js/data.js',
    '/fonts/DMSans-Regular.woff2',
    '/fonts/PlayfairDisplay-Bold.woff2'
];

// Installation
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(ASSETS))
    );
});

// Fetch avec strategie Cache First
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then(response => response || fetch(event.request))
    );
});
```

#### Tache 2.4.2: Enregistrer le Service Worker
```javascript
// Dans app.js
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js')
        .then(reg => log.info('SW registered'))
        .catch(err => log.error('SW failed', err));
}
```

### 2.5 Precharger les ressources critiques
```html
<head>
    <!-- Preconnect aux origines externes -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link rel="preconnect" href="https://images.unsplash.com">

    <!-- Preload ressources critiques -->
    <link rel="preload" href="css/styles.css" as="style">
    <link rel="preload" href="js/app.js" as="script">
    <link rel="preload" href="fonts/DMSans-Regular.woff2" as="font" type="font/woff2" crossorigin>
</head>
```

---

## PHASE 3: ACCESSIBILITE (60 -> 100)
**Duree estimee: 3-4 heures**

### 3.1 Navigation clavier

#### Tache 3.1.1: Rendre les cartes focusables
```html
<!-- AVANT -->
<div class="listing-card" onclick="openModal(1)">

<!-- APRES -->
<article class="listing-card"
         tabindex="0"
         role="button"
         aria-label="Villa mauresque avec vue mer - 15000 DZD par nuit"
         onclick="openModal(1)"
         onkeydown="if(event.key==='Enter')openModal(1)">
```

#### Tache 3.1.2: Gestion du focus dans les modales
```javascript
const FocusTrap = {
    previousFocus: null,

    trap(modalElement) {
        this.previousFocus = document.activeElement;

        const focusableElements = modalElement.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        firstElement.focus();

        modalElement.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                if (e.shiftKey && document.activeElement === firstElement) {
                    e.preventDefault();
                    lastElement.focus();
                } else if (!e.shiftKey && document.activeElement === lastElement) {
                    e.preventDefault();
                    firstElement.focus();
                }
            }
            if (e.key === 'Escape') {
                closeModal();
            }
        });
    },

    release() {
        if (this.previousFocus) {
            this.previousFocus.focus();
        }
    }
};
```

### 3.2 Attributs ARIA

#### Tache 3.2.1: Ajouter ARIA aux boutons
```html
<!-- Bouton favori -->
<button class="listing-favorite"
        aria-label="Ajouter aux favoris"
        aria-pressed="false">
    <svg aria-hidden="true">...</svg>
</button>

<!-- Bouton recherche -->
<button class="search-btn" aria-label="Lancer la recherche">
    <svg aria-hidden="true">...</svg>
    <span>Rechercher</span>
</button>
```

#### Tache 3.2.2: Ajouter ARIA aux modales
```html
<div class="modal-overlay"
     id="modal-overlay"
     role="dialog"
     aria-modal="true"
     aria-labelledby="modal-title"
     aria-describedby="modal-description">
    <div class="modal">
        <h2 id="modal-title">Titre du logement</h2>
        <p id="modal-description">Description...</p>
        <button class="modal-close" aria-label="Fermer la modale">X</button>
    </div>
</div>
```

#### Tache 3.2.3: Ajouter ARIA aux formulaires
```html
<div class="search-field">
    <label for="destination-select" id="destination-label">Destination</label>
    <select id="destination-select"
            aria-labelledby="destination-label"
            aria-describedby="destination-help">
        <option value="">Toutes les wilayas</option>
    </select>
    <span id="destination-help" class="sr-only">
        Selectionnez une wilaya pour filtrer les resultats
    </span>
</div>
```

#### Tache 3.2.4: Navigation et regions
```html
<header class="header" role="banner">
    <nav class="nav-links" role="navigation" aria-label="Navigation principale">
        ...
    </nav>
</header>

<main class="main" role="main" aria-label="Contenu principal">
    <section aria-labelledby="section-title">
        <h2 id="section-title">Logements populaires</h2>
    </section>
</main>

<footer class="footer" role="contentinfo">...</footer>
```

### 3.3 Annonces pour lecteurs d'ecran

#### Tache 3.3.1: Creer une region live pour les notifications
```html
<div id="announcer"
     class="sr-only"
     role="status"
     aria-live="polite"
     aria-atomic="true">
</div>
```

```javascript
function announce(message) {
    const announcer = document.getElementById('announcer');
    announcer.textContent = '';
    setTimeout(() => {
        announcer.textContent = message;
    }, 100);
}

// Utilisation
function toggleFavorite(id) {
    // ... logique existante
    announce(isFav ? 'Ajoute aux favoris' : 'Retire des favoris');
}
```

### 3.4 Contraste et couleurs

#### Tache 3.4.1: Ameliorer le contraste des textes gris
```css
/* AVANT */
.listing-location { color: #717171; } /* Ratio ~4.5:1 */

/* APRES - Ratio minimum 4.5:1 pour texte normal */
.listing-location { color: #595959; } /* Ratio ~7:1 */
```

#### Tache 3.4.2: Ne pas dependre uniquement de la couleur
```html
<!-- Ajouter des icones/texte en plus de la couleur -->
<span class="badge badge-success">
    <svg aria-hidden="true">...</svg>
    Disponible
</span>
```

### 3.5 CSS pour l'accessibilite
```css
/* Screen reader only */
.sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
}

/* Focus visible */
:focus-visible {
    outline: 3px solid var(--ocean);
    outline-offset: 2px;
}

/* Respect des preferences utilisateur */
@media (prefers-reduced-motion: reduce) {
    *, *::before, *::after {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
    }
}

/* High contrast mode */
@media (prefers-contrast: high) {
    :root {
        --grey: #000000;
        --grey-light: #ffffff;
    }
}
```

---

## PHASE 4: QUALITE DU CODE (80 -> 100)
**Duree estimee: 2-3 heures**

### 4.1 Structure et organisation

#### Tache 4.1.1: Creer une architecture modulaire
```
js/
├── app.js              # Point d'entree
├── modules/
│   ├── state.js        # Gestion de l'etat
│   ├── storage.js      # LocalStorage wrapper
│   ├── utils.js        # Fonctions utilitaires
│   ├── ui/
│   │   ├── modal.js    # Composant modal
│   │   ├── toast.js    # Notifications
│   │   ├── cards.js    # Cartes logement
│   │   └── search.js   # Barre de recherche
│   └── pages/
│       ├── home.js     # Page accueil
│       ├── explorer.js # Page explorer
│       └── favorites.js# Page favoris
└── data.js             # Donnees
```

#### Tache 4.1.2: Utiliser les ES Modules
```javascript
// js/modules/utils.js
export const Utils = {
    escapeHTML(str) { /* ... */ },
    formatPrice(price) { /* ... */ },
    debounce(fn, delay) { /* ... */ }
};

// js/modules/state.js
import { Storage } from './storage.js';

export const APP_STATE = {
    // ...
};

// js/app.js
import { Utils } from './modules/utils.js';
import { APP_STATE } from './modules/state.js';
```

### 4.2 Documentation

#### Tache 4.2.1: Ajouter JSDoc a toutes les fonctions
```javascript
/**
 * Ouvre la modale de detail d'un logement
 * @param {number} listingId - L'identifiant du logement
 * @returns {void}
 * @throws {Error} Si le logement n'existe pas
 * @example
 * openDetailModal(1);
 */
function openDetailModal(listingId) {
    const listing = LOGEMENTS.find(l => l.id === listingId);
    if (!listing) {
        throw new Error(`Logement ${listingId} non trouve`);
    }
    // ...
}
```

### 4.3 Gestion d'erreurs

#### Tache 4.3.1: Ajouter try/catch systematiquement
```javascript
function renderListings(container, listings) {
    try {
        if (!container) {
            throw new Error('Container element not found');
        }

        if (!Array.isArray(listings)) {
            throw new TypeError('Listings must be an array');
        }

        container.innerHTML = listings.map(createListingCard).join('');
        updateFavoriteButtons();

    } catch (error) {
        log.error('renderListings failed:', error);
        container.innerHTML = `
            <div class="error-state">
                <p>Une erreur est survenue lors du chargement.</p>
                <button onclick="location.reload()">Reessayer</button>
            </div>
        `;
    }
}
```

### 4.4 Configuration projet

#### Tache 4.4.1: Creer package.json
```json
{
    "name": "dardz",
    "version": "1.0.0",
    "description": "Application SPA de location en Algerie",
    "main": "js/app.js",
    "scripts": {
        "start": "npx serve .",
        "lint": "eslint js/",
        "lint:fix": "eslint js/ --fix",
        "format": "prettier --write .",
        "build": "npm run minify:css && npm run minify:js",
        "minify:css": "cssnano css/styles.css css/styles.min.css",
        "minify:js": "terser js/app.js -o js/app.min.js",
        "test": "jest"
    },
    "devDependencies": {
        "eslint": "^8.0.0",
        "prettier": "^3.0.0",
        "cssnano": "^6.0.0",
        "terser": "^5.0.0",
        "jest": "^29.0.0"
    }
}
```

#### Tache 4.4.2: Configurer ESLint
```json
// .eslintrc.json
{
    "env": {
        "browser": true,
        "es2021": true
    },
    "extends": "eslint:recommended",
    "parserOptions": {
        "ecmaVersion": "latest",
        "sourceType": "module"
    },
    "rules": {
        "no-unused-vars": "warn",
        "no-console": "warn",
        "eqeqeq": "error",
        "curly": "error",
        "semi": ["error", "always"]
    }
}
```

#### Tache 4.4.3: Configurer Prettier
```json
// .prettierrc
{
    "semi": true,
    "singleQuote": true,
    "tabWidth": 4,
    "trailingComma": "es5",
    "printWidth": 100
}
```

### 4.5 Tests

#### Tache 4.5.1: Ajouter des tests unitaires
```javascript
// tests/utils.test.js
import { Utils } from '../js/modules/utils.js';

describe('Utils', () => {
    describe('escapeHTML', () => {
        test('should escape HTML characters', () => {
            expect(Utils.escapeHTML('<script>')).toBe('&lt;script&gt;');
        });

        test('should handle empty string', () => {
            expect(Utils.escapeHTML('')).toBe('');
        });

        test('should handle null', () => {
            expect(Utils.escapeHTML(null)).toBe('');
        });
    });

    describe('formatPrice', () => {
        test('should format price with DZD', () => {
            expect(Utils.formatPrice(15000)).toBe('15 000 DZD');
        });
    });
});
```

---

## PHASE 5: BONNES PRATIQUES (80 -> 100)
**Duree estimee: 2 heures**

### 5.1 Methodologie CSS

#### Tache 5.1.1: Adopter BEM
```css
/* Block Element Modifier */

/* Block */
.listing-card { }

/* Elements */
.listing-card__image { }
.listing-card__title { }
.listing-card__price { }
.listing-card__badge { }

/* Modifiers */
.listing-card--featured { }
.listing-card--sold-out { }
.listing-card__badge--gold { }
```

### 5.2 Semantique HTML

#### Tache 5.2.1: Utiliser les bonnes balises
```html
<!-- Utiliser <article> pour les cartes autonomes -->
<article class="listing-card">
    <figure class="listing-card__image">
        <img src="..." alt="...">
        <figcaption class="sr-only">Photo du logement</figcaption>
    </figure>
    <header class="listing-card__header">
        <h3 class="listing-card__title">...</h3>
    </header>
    <footer class="listing-card__footer">
        <data class="listing-card__price" value="15000">15 000 DZD / nuit</data>
    </footer>
</article>

<!-- Utiliser <time> pour les dates -->
<time datetime="2024-12-20">20 decembre 2024</time>

<!-- Utiliser <address> pour les contacts -->
<address>
    <a href="mailto:contact@dardz.dz">contact@dardz.dz</a>
</address>
```

### 5.3 SEO et Meta

#### Tache 5.3.1: Ameliorer les meta tags
```html
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="DarDZ - La premiere plateforme algerienne de location de logements. Trouvez des villas, appartements et riads dans toutes les wilayas d'Algerie.">
    <meta name="keywords" content="location, algerie, logement, villa, appartement, vacances, dz">
    <meta name="author" content="DarDZ">
    <meta name="robots" content="index, follow">

    <!-- Open Graph -->
    <meta property="og:title" content="DarDZ - Locations en Algerie">
    <meta property="og:description" content="Trouvez votre logement ideal en Algerie">
    <meta property="og:image" content="https://dardz.dz/og-image.jpg">
    <meta property="og:url" content="https://dardz.dz">
    <meta property="og:type" content="website">

    <!-- Twitter -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="DarDZ - Locations en Algerie">

    <!-- Favicon -->
    <link rel="icon" type="image/svg+xml" href="/favicon.svg">
    <link rel="apple-touch-icon" href="/apple-touch-icon.png">

    <!-- Canonical -->
    <link rel="canonical" href="https://dardz.dz">

    <title>DarDZ - Locations en Algerie | Villas, Appartements, Riads</title>
</head>
```

### 5.4 Manifest PWA

#### Tache 5.4.1: Creer manifest.json
```json
{
    "name": "DarDZ - Locations en Algerie",
    "short_name": "DarDZ",
    "description": "Trouvez votre logement ideal en Algerie",
    "start_url": "/",
    "display": "standalone",
    "background_color": "#FBF7F2",
    "theme_color": "#1E6B7B",
    "icons": [
        {
            "src": "/icons/icon-192.png",
            "sizes": "192x192",
            "type": "image/png"
        },
        {
            "src": "/icons/icon-512.png",
            "sizes": "512x512",
            "type": "image/png"
        }
    ]
}
```

```html
<link rel="manifest" href="/manifest.json">
```

---

## PHASE 6: MAINTENABILITE (75 -> 100)
**Duree estimee: 1-2 heures**

### 6.1 Documentation

#### Tache 6.1.1: Creer CONTRIBUTING.md
```markdown
# Guide de contribution

## Structure du projet
...

## Conventions de code
...

## Processus de PR
...
```

### 6.2 Git Hooks

#### Tache 6.2.1: Configurer husky pour pre-commit
```bash
npm install husky lint-staged --save-dev
npx husky install
npx husky add .husky/pre-commit "npx lint-staged"
```

```json
// package.json
"lint-staged": {
    "*.js": ["eslint --fix", "prettier --write"],
    "*.css": ["prettier --write"],
    "*.html": ["prettier --write"]
}
```

### 6.3 Versionning

#### Tache 6.3.1: Adopter Semantic Versioning
```json
// package.json
"version": "1.0.0"
// MAJOR.MINOR.PATCH
// 1.0.0 -> 1.0.1 (bug fix)
// 1.0.0 -> 1.1.0 (new feature)
// 1.0.0 -> 2.0.0 (breaking change)
```

---

## CHECKLIST FINALE

### Securite
- [ ] Fonction escapeHTML implementee
- [ ] Toutes les insertions innerHTML securisees
- [ ] Inline onclick remplaces par addEventListener
- [ ] LocalStorage avec try/catch
- [ ] Console.log supprimes
- [ ] Headers de securite configures

### Performance
- [ ] Lazy loading images
- [ ] CSS extrait et minifie
- [ ] JS minifie
- [ ] Service Worker actif
- [ ] Preload/Preconnect configures
- [ ] Animations chargees a la demande

### Accessibilite
- [ ] Navigation clavier complete
- [ ] Focus trap dans les modales
- [ ] Attributs ARIA sur tous les elements interactifs
- [ ] Region live pour les annonces
- [ ] Contraste suffisant (4.5:1 minimum)
- [ ] prefers-reduced-motion respecte

### Qualite du code
- [ ] Architecture modulaire
- [ ] JSDoc sur toutes les fonctions
- [ ] Gestion d'erreurs systematique
- [ ] ESLint configure et passe
- [ ] Prettier configure
- [ ] Tests unitaires

### Bonnes pratiques
- [ ] Methodologie BEM pour CSS
- [ ] HTML semantique
- [ ] Meta tags SEO
- [ ] Manifest PWA
- [ ] Favicon et icons
- [ ] Git hooks configures

---

## ORDRE D'EXECUTION RECOMMANDE

1. **Phase 1.3** - Supprimer console.log (5 min)
2. **Phase 1.1** - Securiser innerHTML (1h)
3. **Phase 1.2** - Securiser LocalStorage (30 min)
4. **Phase 2.1** - Lazy loading images (30 min)
5. **Phase 2.2** - Extraire et optimiser CSS (1h)
6. **Phase 3.2** - Ajouter attributs ARIA (1h)
7. **Phase 3.1** - Navigation clavier (1h)
8. **Phase 4.4** - Configuration projet (30 min)
9. **Phase 5.3** - SEO et Meta (30 min)
10. **Phase 4.5** - Tests unitaires (1h)

**Temps total estime: 8-10 heures de travail**

---

*Plan genere le 14 Decembre 2024*
