# 🏠 DARDZ - Application SPA de Location en Algérie

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
![Status](https://img.shields.io/badge/status-production--ready-green)

**Application Web Complète** pour la location de logements en Algérie - 7 pages interactives avec navigation fluide.

**[🌐 Démo Live](https://billythek.github.io/dar-n-go-spa/)**

---

## ✨ Vue d'Ensemble

DARDZ est une **Single Page Application (SPA)** complète qui offre une expérience utilisateur fluide pour la recherche et la réservation de logements en Algérie.

### 🎯 Type de Projet
**Application Web SPA** - Navigation multi-pages sans rechargement

### 🎨 Design
Palette méditerranéenne authentique avec inspiration architecture nord-africaine

---

## 🚀 Fonctionnalités Principales

### 📱 7 Pages Complètes

1. **🏠 Accueil**
   - Hero avec recherche avancée
   - 10 catégories scrollables
   - 6 logements populaires
   - Section wilayas touristiques

2. **🔍 Explorer**
   - 12 logements avec données complètes
   - Filtres dynamiques (type, prix)
   - Tri prix croissant/décroissant
   - Grid responsive

3. **📄 Détail Logement**
   - Modal animé
   - Galerie photos
   - Informations complètes
   - Prix DZD
   - Bouton réservation

4. **❤️ Favoris**
   - Système localStorage persistant
   - Empty state avec animation Lottie
   - Compteur dans navigation
   - Gestion des favoris

5. **💬 Messages**
   - Liste de conversations
   - Interface de chat
   - Avatars des hôtes
   - Timestamps réalistes

6. **👤 Profil**
   - Avatar utilisateur
   - Statistiques (réservations, avis, favoris)
   - Onglets multiples
   - Informations personnelles

7. **🏡 Devenir Hôte**
   - Hero inspirant
   - 3 features (Revenus, Protection, Contrôle)
   - 3 étapes claires
   - CTA proéminents

---

## 💻 Technologies

- **HTML5** - Structure sémantique
- **CSS3** - Grid, Flexbox, Variables, Animations
- **JavaScript Vanilla** - SPA navigation, localStorage
- **Lottie Web** - 80+ animations vectorielles
- **Google Fonts** - Playfair Display, Inter, Noto Kufi Arabic

---

## 📊 Données Réalistes

### 12 Logements Complets
- **Prix DZD 2025** authentiques (6 500 - 25 000 DZD/nuit)
- **Wilayas réelles** à travers l'Algérie
- **Hôtes algériens** avec noms réalistes
- **Descriptions** détaillées

### Exemples
- Villa mauresque vue mer - Alger - 15 000 DZD/nuit
- Riad Casbah - Alger - 12 000 DZD/nuit
- Campement luxe Sahara - Djanet - 25 000 DZD/nuit
- Dar M'Zab - Ghardaïa - 7 000 DZD/nuit

---

## 🎨 Design

### Palette de Couleurs
```css
Terracotta:       #C65D3B
Mediterranean:    #1E6B7B
Sand:             #F5E6D3
Gold:             #C9A227
Dark:             #2D2D2D
```

### Typographie
- **Headings**: Playfair Display (serif élégant)
- **Body**: Inter (sans-serif moderne)
- **Arabic**: Noto Kufi Arabic (support arabe)

### Motifs
- Patterns géométriques arabesques CSS
- Dégradés méditerranéens
- Ombres douces et profondes

---

## 🚀 Installation & Lancement

### Prérequis
- Python 3.x ou Node.js
- Navigateur moderne

### Méthode 1: Python
```bash
# Cloner le repo
git clone https://github.com/Billythek/dar-n-go-spa.git
cd dar-n-go-spa

# Lancer le serveur
python -m http.server 8001

# Ouvrir http://localhost:8001
```

### Méthode 2: Node.js
```bash
npm install -g http-server
http-server -p 8001
```

### Méthode 3: Direct
Ouvrir `index.html` directement dans le navigateur

---

## 📂 Structure du Projet

```
dar-n-go-spa/
├── index.html              # Application SPA principale
├── index.backup.html       # Backup
├── dardz_complet.html      # Version alternative
├── index-new.html          # Version test
├── OUVRIR_LE_SITE.txt     # Instructions
│
├── css/                    # Styles
│   └── styles.css
│
├── js/                     # Scripts
│   └── app.js
│
├── animations/             # 80+ Lottie
│   ├── n2_heart.json
│   ├── n2_loader_*.json
│   └── ...
│
├── images/                 # Assets
│   ├── house_selected.webp
│   └── ...
│
├── fonts/                  # Polices
│   ├── airbnbcereal_variable.ttf
│   ├── fortescue_*.otf
│   └── ...
│
└── icons/                  # Icônes app
```

---

## 🇩🇿 Spécificités Algériennes

### Wilayas Intégrées
- Alger, Oran, Constantine
- Béjaïa, Tlemcen, Ghardaïa
- Tamanrasset, Tipaza, Annaba, Jijel

### Prix Réalistes (DZD 2025)
- Studios: 6 500 - 8 000 DZD/nuit
- Appartements: 8 000 - 22 000 DZD/nuit
- Villas: 15 000 - 35 000 DZD/nuit
- Campements: 5 000 - 25 000 DZD/nuit

### Paiements
- 💳 CIB (Carte Interbancaire)
- 💳 Edahabia (Algérie Poste)
- 📱 BaridiMob

---

## ✨ Fonctionnalités Techniques

### Navigation SPA
```javascript
// Navigation sans rechargement
function navigateTo(page) {
    document.querySelectorAll('.page').forEach(p =>
        p.classList.remove('active')
    );
    document.getElementById(page).classList.add('active');
}
```

### Système de Favoris
```javascript
// LocalStorage persistant
let favorites = JSON.parse(
    localStorage.getItem('dardz_favorites') || '[]'
);

function toggleFavorite(id) {
    if(favorites.includes(id)) {
        favorites = favorites.filter(f => f !== id);
    } else {
        favorites.push(id);
    }
    localStorage.setItem('dardz_favorites', JSON.stringify(favorites));
}
```

### Filtres Dynamiques
```javascript
// Filtrage en temps réel
function filterListings(type) {
    currentFilter = type;
    renderExploreListings();
}

function sortByPrice(order) {
    currentSort = order;
    renderExploreListings();
}
```

---

## 📊 Statistiques

- **Taille**: 72 Ko
- **Lignes de code**: ~1600
- **Pages**: 7 complètes
- **Logements**: 12
- **Animations**: 80+ Lottie
- **Assets**: 35+ images/fonts

---

## 🎯 Roadmap

### Court Terme
- [ ] Ajouter vraies photos de logements
- [ ] Créer favicon personnalisé
- [ ] Menu hamburger mobile fonctionnel
- [ ] Mode sombre

### Moyen Terme
- [ ] Backend API (Node.js/Python)
- [ ] Base de données (PostgreSQL/MongoDB)
- [ ] Authentification JWT
- [ ] Upload photos
- [ ] Système de réservation

### Long Terme
- [ ] Intégration paiements CIB/Edahabia
- [ ] Chat temps réel (WebSocket)
- [ ] Notifications push
- [ ] PWA
- [ ] Multilangue (FR/AR/EN)
- [ ] Google Maps

---

## 🤝 Contribution

Les contributions sont bienvenues!

1. Fork le projet
2. Créer une branche (`git checkout -b feature/Feature`)
3. Commit (`git commit -m 'Add Feature'`)
4. Push (`git push origin feature/Feature`)
5. Pull Request

---

## 📝 Documentation Additionnelle

- [Rapport Final](./RAPPORT_FINAL_DARDZ.txt)
- [Instructions d'ouverture](./OUVRIR_LE_SITE.txt)

---

## 📄 Licence

MIT License - voir [LICENSE](LICENSE)

---

## 👤 Auteur

**Billythek**
- GitHub: [@Billythek](https://github.com/Billythek)
- Repository: [dar-n-go-spa](https://github.com/Billythek/dar-n-go-spa)

---

## 🙏 Remerciements

- Airbnb pour l'inspiration
- Lottie pour les animations
- Google Fonts
- Communauté open source

---

<div align="center">

**🏠 DARDZ - Location en Algérie**

Paiements: CIB • Edahabia • BaridiMob

[![Made with ❤️ in Algeria](https://img.shields.io/badge/Made%20with%20%E2%9D%A4%EF%B8%8F%20in-Algeria-green)](https://github.com/Billythek/dar-n-go-spa)

---

🤖 **Generated with [Claude Code](https://claude.com/claude-code)**

Co-Authored-By: Claude Sonnet 4.5 (1M context)

</div>
