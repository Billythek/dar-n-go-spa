/**
 * DarDZ - Module Utilitaires
 * Fonctions de securite, stockage et helpers
 */

'use strict';

// ============================================
// DEBUG MODE
// ============================================
const DEBUG = false;

const log = {
    info: (...args) => DEBUG && console.log('[INFO]', ...args),
    warn: (...args) => DEBUG && console.warn('[WARN]', ...args),
    error: (...args) => console.error('[ERROR]', ...args)
};

// ============================================
// SECURITE - Protection XSS
// ============================================
const Security = {
    /**
     * Echappe les caracteres HTML dangereux
     * @param {string} str - Chaine a echapper
     * @returns {string} Chaine echappee
     */
    escapeHTML(str) {
        if (str === null || str === undefined) return '';
        if (typeof str !== 'string') str = String(str);

        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    },

    /**
     * Echappe un attribut HTML
     * @param {string} str - Valeur de l'attribut
     * @returns {string} Valeur echappee
     */
    escapeAttr(str) {
        if (str === null || str === undefined) return '';
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');
    },

    /**
     * Sanitise un objet en echappant toutes ses proprietes string
     * @param {Object} obj - Objet a sanitiser
     * @returns {Object} Objet sanitise
     */
    sanitizeObject(obj) {
        if (!obj || typeof obj !== 'object') return obj;

        const sanitized = Array.isArray(obj) ? [] : {};

        for (const key in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, key)) {
                const value = obj[key];
                if (typeof value === 'string') {
                    sanitized[key] = this.escapeHTML(value);
                } else if (typeof value === 'object' && value !== null) {
                    sanitized[key] = this.sanitizeObject(value);
                } else {
                    sanitized[key] = value;
                }
            }
        }

        return sanitized;
    }
};

// ============================================
// STOCKAGE - LocalStorage securise
// ============================================
const Storage = {
    /**
     * Recupere une valeur du localStorage
     * @param {string} key - Cle de stockage
     * @param {*} fallback - Valeur par defaut
     * @returns {*} Valeur recuperee ou fallback
     */
    get(key, fallback = null) {
        try {
            const item = localStorage.getItem(key);
            if (item === null) return fallback;
            return JSON.parse(item);
        } catch (e) {
            log.warn(`Storage.get error for "${key}":`, e.message);
            return fallback;
        }
    },

    /**
     * Stocke une valeur dans localStorage
     * @param {string} key - Cle de stockage
     * @param {*} value - Valeur a stocker
     * @returns {boolean} Succes de l'operation
     */
    set(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (e) {
            log.warn(`Storage.set error for "${key}":`, e.message);
            return false;
        }
    },

    /**
     * Supprime une valeur du localStorage
     * @param {string} key - Cle a supprimer
     * @returns {boolean} Succes de l'operation
     */
    remove(key) {
        try {
            localStorage.removeItem(key);
            return true;
        } catch (e) {
            log.warn(`Storage.remove error for "${key}":`, e.message);
            return false;
        }
    }
};

// ============================================
// FORMATAGE
// ============================================
const Format = {
    /**
     * Formate un prix en DZD
     * @param {number} price - Prix a formater
     * @returns {string} Prix formate
     */
    price(price) {
        if (typeof price !== 'number') return '0 DZD';
        return price.toLocaleString('fr-DZ') + ' DZD';
    },

    /**
     * Formate une date
     * @param {string|Date} date - Date a formater
     * @returns {string} Date formatee
     */
    date(date) {
        try {
            const d = new Date(date);
            return d.toLocaleDateString('fr-DZ', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
            });
        } catch (e) {
            return '';
        }
    },

    /**
     * Pluralise un mot
     * @param {number} count - Nombre
     * @param {string} singular - Forme singuliere
     * @param {string} plural - Forme plurielle
     * @returns {string} Mot avec le bon accord
     */
    pluralize(count, singular, plural) {
        return count <= 1 ? singular : plural;
    }
};

// ============================================
// HELPERS
// ============================================
const Helpers = {
    /**
     * Debounce une fonction
     * @param {Function} fn - Fonction a debouncer
     * @param {number} delay - Delai en ms
     * @returns {Function} Fonction debouncee
     */
    debounce(fn, delay = 300) {
        let timeoutId;
        return function (...args) {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => fn.apply(this, args), delay);
        };
    },

    /**
     * Genere un ID unique
     * @returns {string} ID unique
     */
    uniqueId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    },

    /**
     * Verifie si un element est visible dans le viewport
     * @param {HTMLElement} element - Element a verifier
     * @returns {boolean} Visibilite
     */
    isInViewport(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }
};

// ============================================
// ACCESSIBILITE
// ============================================
const A11y = {
    announcer: null,

    /**
     * Initialise la region d'annonces
     */
    init() {
        if (!this.announcer) {
            this.announcer = document.getElementById('a11y-announcer');
            if (!this.announcer) {
                this.announcer = document.createElement('div');
                this.announcer.id = 'a11y-announcer';
                this.announcer.className = 'sr-only';
                this.announcer.setAttribute('role', 'status');
                this.announcer.setAttribute('aria-live', 'polite');
                this.announcer.setAttribute('aria-atomic', 'true');
                document.body.appendChild(this.announcer);
            }
        }
    },

    /**
     * Annonce un message aux lecteurs d'ecran
     * @param {string} message - Message a annoncer
     */
    announce(message) {
        if (!this.announcer) this.init();
        this.announcer.textContent = '';
        setTimeout(() => {
            this.announcer.textContent = message;
        }, 100);
    },

    /**
     * Gere le focus trap dans un element
     * @param {HTMLElement} container - Conteneur du trap
     * @returns {Object} Controleur du trap
     */
    trapFocus(container) {
        const focusableSelectors = [
            'button:not([disabled])',
            '[href]',
            'input:not([disabled])',
            'select:not([disabled])',
            'textarea:not([disabled])',
            '[tabindex]:not([tabindex="-1"])'
        ].join(', ');

        const focusableElements = container.querySelectorAll(focusableSelectors);
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];
        const previousFocus = document.activeElement;

        const handleKeydown = (e) => {
            if (e.key === 'Tab') {
                if (e.shiftKey && document.activeElement === firstElement) {
                    e.preventDefault();
                    lastElement.focus();
                } else if (!e.shiftKey && document.activeElement === lastElement) {
                    e.preventDefault();
                    firstElement.focus();
                }
            }
        };

        container.addEventListener('keydown', handleKeydown);

        if (firstElement) {
            firstElement.focus();
        }

        return {
            release() {
                container.removeEventListener('keydown', handleKeydown);
                if (previousFocus) {
                    previousFocus.focus();
                }
            }
        };
    }
};

// ============================================
// EXPORT GLOBAL
// ============================================
window.DarDZ = window.DarDZ || {};
window.DarDZ.Utils = {
    Security,
    Storage,
    Format,
    Helpers,
    A11y,
    log
};

// Raccourcis globaux pour faciliter l'utilisation
window.escapeHTML = Security.escapeHTML.bind(Security);
window.escapeAttr = Security.escapeAttr.bind(Security);
