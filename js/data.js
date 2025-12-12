// DarDZ - Données des logements
const WILAYAS = [
    'Alger', 'Oran', 'Constantine', 'Annaba', 'Béjaïa', 'Tlemcen',
    'Sétif', 'Batna', 'Blida', 'Tizi Ouzou', 'Tipaza', 'Jijel',
    'Skikda', 'Mostaganem', 'Chlef', 'Médéa', 'Ghardaïa', 'Tamanrasset',
    'Djelfa', 'Ouargla'
];

const LOGEMENTS = [
    {
        id: 1,
        titre: "Villa mauresque avec vue mer panoramique",
        wilaya: "Alger",
        quartier: "Sidi Fredj",
        type: "villa",
        prix: 25000,
        images: [
            "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800",
            "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=800",
            "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800",
            "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800",
            "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800"
        ],
        voyageurs: 8,
        chambres: 4,
        lits: 6,
        sallesBain: 3,
        note: 4.95,
        nbAvis: 127,
        superhote: true,
        animauxAcceptes: true,
        equipements: ["WiFi", "Piscine privée", "Climatisation", "Cuisine équipée", "Parking gratuit", "Vue mer", "Jardin", "Barbecue", "Terrasse"],
        description: "Magnifique villa de style mauresque avec architecture traditionnelle et confort moderne. Profitez d'une vue imprenable sur la Méditerranée depuis la terrasse et la piscine privée. À seulement 5 minutes de la plage de Sidi Fredj. Idéal pour les familles.",
        hote: {
            nom: "Karim Benali",
            photo: "https://i.pravatar.cc/150?img=12",
            inscription: "2019",
            note: 4.9,
            superhote: true
        },
        avis: [
            {auteur: "Amina L.", date: "Novembre 2024", texte: "Villa exceptionnelle ! La vue est à couper le souffle et l'accueil de Karim est chaleureux. Nous avons passé un séjour inoubliable.", note: 5},
            {auteur: "Marc D.", date: "Octobre 2024", texte: "Parfait pour notre famille. Les enfants ont adoré la piscine. Quartier calme et sécurisé.", note: 5},
            {auteur: "Yasmine K.", date: "Septembre 2024", texte: "Magnifique propriété, très propre et bien équipée. Je recommande vivement !", note: 5}
        ],
        regles: {
            fumeur: false,
            fetes: false,
            animaux: true
        }
    },
    {
        id: 2,
        titre: "Appartement moderne au cœur d'Alger",
        wilaya: "Alger",
        quartier: "Didouche Mourad",
        type: "appartement",
        prix: 12000,
        images: [
            "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800",
            "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800",
            "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800",
            "https://images.unsplash.com/photo-1556912167-f556f1f39faa?w=800",
            "https://images.unsplash.com/photo-1574643156929-51fa098b0394?w=800"
        ],
        voyageurs: 4,
        chambres: 2,
        lits: 3,
        sallesBain: 1,
        note: 4.85,
        nbAvis: 89,
        superhote: true,
        animauxAcceptes: false,
        equipements: ["WiFi", "Climatisation", "Cuisine équipée", "Lave-linge", "Ascenseur", "TV", "Bureau"],
        description: "Appartement entièrement rénové au cœur d'Alger, idéal pour les voyages d'affaires ou de loisirs. Proche des restaurants, commerces et transports. Vue sur la ville depuis le balcon.",
        hote: {
            nom: "Leila Meziane",
            photo: "https://i.pravatar.cc/150?img=45",
            inscription: "2020",
            note: 4.88,
            superhote: true
        },
        avis: [
            {auteur: "Thomas B.", date: "Décembre 2024", texte: "Emplacement parfait, appartement propre et confortable. Leila est très réactive.", note: 5},
            {auteur: "Nassim A.", date: "Novembre 2024", texte: "Très bien situé, tout est accessible à pied. Je recommande.", note: 5},
            {auteur: "Sophie M.", date: "Octobre 2024", texte: "Séjour agréable, l'appartement est conforme aux photos.", note: 4}
        ],
        regles: {
            fumeur: false,
            fetes: false,
            animaux: false
        }
    },
    {
        id: 3,
        titre: "Riad authentique dans la Casbah",
        wilaya: "Alger",
        quartier: "Casbah",
        type: "riad",
        prix: 18000,
        images: [
            "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800",
            "https://images.unsplash.com/photo-1615874694520-474822394e73?w=800",
            "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800",
            "https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=800",
            "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=800"
        ],
        voyageurs: 6,
        chambres: 3,
        lits: 4,
        sallesBain: 2,
        note: 4.92,
        nbAvis: 156,
        superhote: true,
        animauxAcceptes: false,
        equipements: ["WiFi", "Climatisation", "Cuisine traditionnelle", "Terrasse panoramique", "Décoration authentique", "Vue Casbah"],
        description: "Riad traditionnel restauré au cœur de la mythique Casbah d'Alger, classée au patrimoine mondial de l'UNESCO. Architecture mauresque authentique avec patio central et terrasse offrant une vue exceptionnelle sur la baie d'Alger.",
        hote: {
            nom: "Ahmed Djilali",
            photo: "https://i.pravatar.cc/150?img=33",
            inscription: "2018",
            note: 4.93,
            superhote: true
        },
        avis: [
            {auteur: "Claire F.", date: "Décembre 2024", texte: "Expérience unique ! Le riad est magnifique et Ahmed nous a fait découvrir la Casbah.", note: 5},
            {auteur: "Mehdi R.", date: "Novembre 2024", texte: "Authenticité garantie. Un vrai voyage dans le temps. La terrasse est incroyable.", note: 5},
            {auteur: "Isabella G.", date: "Octobre 2024", texte: "Beautiful place, amazing host. Highly recommended!", note: 5}
        ],
        regles: {
            fumeur: false,
            fetes: false,
            animaux: false
        }
    },
    {
        id: 4,
        titre: "Maison kabyle traditionnelle",
        wilaya: "Tizi Ouzou",
        quartier: "Village Aït Yenni",
        type: "maison",
        prix: 8500,
        images: [
            "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800",
            "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800",
            "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800",
            "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800",
            "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800"
        ],
        voyageurs: 5,
        chambres: 2,
        lits: 3,
        sallesBain: 1,
        note: 4.88,
        nbAvis: 64,
        superhote: false,
        animauxAcceptes: true,
        equipements: ["WiFi", "Chauffage", "Cuisine traditionnelle", "Jardin", "Vue montagne", "Calme absolu", "Randonnées"],
        description: "Découvrez l'hospitalité kabyle dans cette maison traditionnelle au cœur du Djurdjura. Parfait pour les amoureux de nature et d'authenticité. Randonnées, artisanat local et cuisine kabyle au programme.",
        hote: {
            nom: "Malika Ait Said",
            photo: "https://i.pravatar.cc/150?img=48",
            inscription: "2021",
            note: 4.85
        },
        avis: [
            {auteur: "Pierre L.", date: "Novembre 2024", texte: "Accueil chaleureux, cadre magnifique. Les plats de Malika sont délicieux !", note: 5},
            {auteur: "Fatima Z.", date: "Octobre 2024", texte: "Calme et ressourçant. Parfait pour se déconnecter.", note: 5},
            {auteur: "David M.", date: "Septembre 2024", texte: "Belle expérience, maison authentique avec vue superbe.", note: 4}
        ],
        regles: {
            fumeur: false,
            fetes: false,
            animaux: true
        }
    },
    {
        id: 5,
        titre: "Bungalow pieds dans l'eau",
        wilaya: "Béjaïa",
        quartier: "Tigzirt-sur-Mer",
        type: "bungalow",
        prix: 15000,
        images: [
            "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=800",
            "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800",
            "https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?w=800",
            "https://images.unsplash.com/photo-1540541338287-41700207dee6?w=800",
            "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800"
        ],
        voyageurs: 4,
        chambres: 2,
        lits: 2,
        sallesBain: 1,
        note: 4.78,
        nbAvis: 78,
        superhote: false,
        animauxAcceptes: true,
        equipements: ["WiFi", "Climatisation", "Cuisine", "Accès plage privé", "Vue mer", "Terrasse", "Barbecue"],
        description: "Bungalow avec accès direct à la plage de Tigzirt. Réveillez-vous au son des vagues et profitez du soleil de la Méditerranée. Plage de sable fin à 20 mètres. Parfait pour un séjour farniente.",
        hote: {
            nom: "Rachid Hamani",
            photo: "https://i.pravatar.cc/150?img=51",
            inscription: "2020",
            note: 4.75
        },
        avis: [
            {auteur: "Samia B.", date: "Novembre 2024", texte: "Emplacement exceptionnel ! La plage est magnifique.", note: 5},
            {auteur: "Alexandre P.", date: "Octobre 2024", texte: "Parfait pour des vacances relaxantes. Bungalow simple mais confortable.", note: 4},
            {auteur: "Nadia K.", date: "Septembre 2024", texte: "Très bon séjour, la vue est superbe depuis la terrasse.", note: 5}
        ],
        regles: {
            fumeur: false,
            fetes: true,
            animaux: true
        }
    },
    {
        id: 6,
        titre: "Campement de luxe au Sahara",
        wilaya: "Tamanrasset",
        quartier: "Hoggar",
        type: "campement",
        prix: 35000,
        images: [
            "https://images.unsplash.com/photo-1542401886-65d6c61db217?w=800",
            "https://images.unsplash.com/photo-1509023464722-18d996393ca8?w=800",
            "https://images.unsplash.com/photo-1584714268709-c3dd9c92b378?w=800",
            "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800",
            "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=800"
        ],
        voyageurs: 4,
        chambres: 2,
        lits: 4,
        sallesBain: 1,
        note: 5.0,
        nbAvis: 43,
        superhote: true,
        animauxAcceptes: false,
        equipements: ["Tentes luxueuses", "Cuisine touarègue", "Excursions 4x4", "Randonnées", "Nuits étoilées", "Guide local", "Feu de camp"],
        description: "Vivez une expérience unique au cœur du Tassili n'Ajjer. Campement de luxe avec tentes traditionnelles touarègues aménagées. Nuits sous les étoiles, excursions en 4x4, randonnées et découverte de la culture touarègue authentique.",
        hote: {
            nom: "Mohamed Ag Intalla",
            photo: "https://i.pravatar.cc/150?img=68",
            inscription: "2017",
            note: 5.0,
            superhote: true
        },
        avis: [
            {auteur: "Laurent D.", date: "Décembre 2024", texte: "Expérience magique ! Mohamed est un guide exceptionnel. Le désert sous les étoiles, inoubliable.", note: 5},
            {auteur: "Emma R.", date: "Novembre 2024", texte: "Un rêve devenu réalité. Le Sahara est grandiose et l'accueil chaleureux.", note: 5},
            {auteur: "Kamel A.", date: "Octobre 2024", texte: "Moment unique de ma vie. Je recommande à 1000% !", note: 5}
        ],
        regles: {
            fumeur: true,
            fetes: false,
            animaux: false
        }
    },
    {
        id: 7,
        titre: "Studio cosy centre Constantine",
        wilaya: "Constantine",
        quartier: "Koudiat Aty",
        type: "studio",
        prix: 6500,
        images: [
            "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800",
            "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800",
            "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800",
            "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800",
            "https://images.unsplash.com/photo-1556020685-ae41abfc9365?w=800"
        ],
        voyageurs: 2,
        chambres: 1,
        lits: 1,
        sallesBain: 1,
        note: 4.72,
        nbAvis: 95,
        superhote: false,
        animauxAcceptes: true,
        equipements: ["WiFi", "Climatisation", "Cuisine équipée", "TV", "Ascenseur", "Vue ponts"],
        description: "Studio moderne idéal pour un couple ou voyageur solo. Vue sur les célèbres ponts suspendus de Constantine. Proche du centre-ville et des sites touristiques. Quartier calme et sécurisé.",
        hote: {
            nom: "Salim Boudjemaa",
            photo: "https://i.pravatar.cc/150?img=14",
            inscription: "2022",
            note: 4.7
        },
        avis: [
            {auteur: "Marie C.", date: "Décembre 2024", texte: "Studio bien situé et propre. Salim est disponible et serviable.", note: 5},
            {auteur: "Farid M.", date: "Novembre 2024", texte: "Bon rapport qualité-prix. La vue sur les ponts est jolie.", note: 4},
            {auteur: "Lucie P.", date: "Octobre 2024", texte: "Séjour correct, studio fonctionnel.", note: 4}
        ],
        regles: {
            fumeur: false,
            fetes: false,
            animaux: true
        }
    },
    {
        id: 8,
        titre: "Villa avec piscine Tlemcen",
        wilaya: "Tlemcen",
        quartier: "Imama",
        type: "villa",
        prix: 28000,
        images: [
            "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800",
            "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800",
            "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800",
            "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=800",
            "https://images.unsplash.com/photo-1600607687644-c7171b42498b?w=800"
        ],
        voyageurs: 10,
        chambres: 5,
        lits: 8,
        sallesBain: 3,
        note: 4.91,
        nbAvis: 112,
        superhote: true,
        animauxAcceptes: true,
        equipements: ["WiFi", "Piscine chauffée", "Climatisation", "Cuisine équipée", "Jardin 1000m²", "Parking 3 voitures", "Barbecue", "Salle de jeux"],
        description: "Magnifique villa spacieuse idéale pour grands groupes et familles. Piscine chauffée, grand jardin arboré. Proche des sites historiques de Tlemcen (Mansourah, Mosquée de Sidi Boumediene). Quartier résidentiel haut standing.",
        hote: {
            nom: "Yasmine Benabdallah",
            photo: "https://i.pravatar.cc/150?img=47",
            inscription: "2019",
            note: 4.9,
            superhote: true
        },
        avis: [
            {auteur: "Karim T.", date: "Décembre 2024", texte: "Villa parfaite pour notre réunion de famille. Tout est impeccable !", note: 5},
            {auteur: "Isabelle L.", date: "Novembre 2024", texte: "Magnifique propriété, très bien entretenue. Yasmine est une hôte formidable.", note: 5},
            {auteur: "Omar B.", date: "Octobre 2024", texte: "Spacieux, propre et bien situé. Les enfants ont adoré la piscine.", note: 5}
        ],
        regles: {
            fumeur: false,
            fetes: true,
            animaux: true
        }
    },
    {
        id: 9,
        titre: "Dar traditionnel Ghardaïa",
        wilaya: "Ghardaïa",
        quartier: "M'Zab",
        type: "dar",
        prix: 10000,
        images: [
            "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800",
            "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800",
            "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=800",
            "https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=800",
            "https://images.unsplash.com/photo-1615874694520-474822394e73?w=800"
        ],
        voyageurs: 6,
        chambres: 3,
        lits: 5,
        sallesBain: 2,
        note: 4.87,
        nbAvis: 71,
        superhote: false,
        animauxAcceptes: false,
        equipements: ["WiFi", "Climatisation", "Cuisine", "Patio intérieur", "Terrasse", "Architecture mozabite", "Vue ksar"],
        description: "Dar traditionnelle au cœur de la vallée du M'Zab, patrimoine mondial UNESCO. Architecture mozabite authentique avec patio central. Découvrez l'art de vivre mozabite et visitez les ksour historiques.",
        hote: {
            nom: "Ibrahim Berriane",
            photo: "https://i.pravatar.cc/150?img=60",
            inscription: "2020",
            note: 4.85
        },
        avis: [
            {auteur: "Sophie G.", date: "Novembre 2024", texte: "Maison magnifique, architecture unique. Ibrahim nous a fait visiter la palmeraie.", note: 5},
            {auteur: "Ahmed S.", date: "Octobre 2024", texte: "Très authentique, j'ai beaucoup appris sur la culture mozabite.", note: 5},
            {auteur: "Marie T.", date: "Septembre 2024", texte: "Belle découverte, le dar est charmant et bien situé.", note: 4}
        ],
        regles: {
            fumeur: false,
            fetes: false,
            animaux: false
        }
    },
    {
        id: 10,
        titre: "Résidence bord de mer Tipaza",
        wilaya: "Tipaza",
        quartier: "Chenoua",
        type: "appartement",
        prix: 16000,
        images: [
            "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800",
            "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=800",
            "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800",
            "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800",
            "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?w=800"
        ],
        voyageurs: 6,
        chambres: 3,
        lits: 4,
        sallesBain: 2,
        note: 4.83,
        nbAvis: 104,
        superhote: false,
        animauxAcceptes: true,
        equipements: ["WiFi", "Climatisation", "Cuisine", "Piscine résidence", "Parking", "Vue mer", "Plage 100m", "Tennis"],
        description: "Appartement spacieux dans résidence sécurisée avec piscine. Vue panoramique sur la mer. Proche des ruines romaines de Tipaza (UNESCO). Plage de sable à 100 mètres. Idéal vacances familiales.",
        hote: {
            nom: "Nadia Cherif",
            photo: "https://i.pravatar.cc/150?img=32",
            inscription: "2021",
            note: 4.8
        },
        avis: [
            {auteur: "Hamza K.", date: "Décembre 2024", texte: "Très bon séjour, l'appartement est bien équipé et la vue magnifique.", note: 5},
            {auteur: "Julie M.", date: "Novembre 2024", texte: "Résidence calme et agréable, proche de la plage. Parfait !", note: 5},
            {auteur: "Riad B.", date: "Octobre 2024", texte: "Bel appartement, spacieux. Nadia est accueillante.", note: 4}
        ],
        regles: {
            fumeur: false,
            fetes: false,
            animaux: true
        }
    },
    {
        id: 11,
        titre: "Duplex moderne Oran",
        wilaya: "Oran",
        quartier: "Canastel",
        type: "duplex",
        prix: 22000,
        images: [
            "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800",
            "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800",
            "https://images.unsplash.com/photo-1600607687644-c7171b42498b?w=800",
            "https://images.unsplash.com/photo-1556020685-ae41abfc9365?w=800",
            "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=800"
        ],
        voyageurs: 6,
        chambres: 3,
        lits: 4,
        sallesBain: 2,
        note: 4.89,
        nbAvis: 138,
        superhote: true,
        animauxAcceptes: false,
        equipements: ["WiFi haut débit", "Climatisation", "Cuisine moderne", "Lave-linge", "Parking", "Vue mer", "Balcon", "TV smart"],
        description: "Duplex lumineux et moderne avec vue sur la baie d'Oran. Design contemporain, équipements haut de gamme. Proche de la corniche, plages et restaurants. Quartier résidentiel calme.",
        hote: {
            nom: "Sofiane Belkacemi",
            photo: "https://i.pravatar.cc/150?img=56",
            inscription: "2018",
            note: 4.92,
            superhote: true
        },
        avis: [
            {auteur: "Assia D.", date: "Décembre 2024", texte: "Duplex magnifique, très bien décoré. Sofiane est un hôte parfait.", note: 5},
            {auteur: "Nicolas P.", date: "Novembre 2024", texte: "Excellent séjour ! Vue superbe et logement impeccable.", note: 5},
            {auteur: "Lynda M.", date: "Octobre 2024", texte: "Très confortable, bien situé. Je recommande vivement.", note: 5}
        ],
        regles: {
            fumeur: false,
            fetes: false,
            animaux: false
        }
    },
    {
        id: 12,
        titre: "Maison de charme Jijel",
        wilaya: "Jijel",
        quartier: "Corniche jijelienne",
        type: "maison",
        prix: 14000,
        images: [
            "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800",
            "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800",
            "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800",
            "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800",
            "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800"
        ],
        voyageurs: 5,
        chambres: 2,
        lits: 3,
        sallesBain: 2,
        note: 4.76,
        nbAvis: 82,
        superhote: false,
        animauxAcceptes: true,
        equipements: ["WiFi", "Climatisation", "Cuisine", "Jardin", "Barbecue", "Vue mer", "Plage 200m", "Parking"],
        description: "Charmante maison traditionnelle sur la corniche jijelienne. Jardin avec vue mer, à 200m de la plage. Découvrez les grottes merveilleuses et les plages paradisiaques de Jijel. Calme et repos garantis.",
        hote: {
            nom: "Djamel Zitouni",
            photo: "https://i.pravatar.cc/150?img=70",
            inscription: "2022",
            note: 4.73
        },
        avis: [
            {auteur: "Farida A.", date: "Novembre 2024", texte: "Maison agréable avec un joli jardin. Djamel est sympathique.", note: 5},
            {auteur: "Yacine B.", date: "Octobre 2024", texte: "Bien située, proche de la plage. Séjour reposant.", note: 4},
            {auteur: "Céline R.", date: "Septembre 2024", texte: "Maison simple mais confortable. Vue jolie depuis le jardin.", note: 4}
        ],
        regles: {
            fumeur: true,
            fetes: false,
            animaux: true
        }
    },
    {
        id: 13,
        titre: "Penthouse Annaba vue panoramique",
        wilaya: "Annaba",
        quartier: "Seraïdi",
        type: "penthouse",
        prix: 20000,
        images: [
            "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=800",
            "https://images.unsplash.com/photo-1600607687644-c7171b42498b?w=800",
            "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800",
            "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=800",
            "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?w=800"
        ],
        voyageurs: 4,
        chambres: 2,
        lits: 3,
        sallesBain: 2,
        note: 4.94,
        nbAvis: 126,
        superhote: true,
        animauxAcceptes: false,
        equipements: ["WiFi haut débit", "Climatisation", "Cuisine luxe", "Terrasse 80m²", "Jacuzzi", "Vue 360°", "Parking", "Conciergerie"],
        description: "Penthouse d'exception avec terrasse panoramique et jacuzzi. Vue à 360° sur Annaba, la mer et les montagnes. Standing haut de gamme, finitions luxueuses. Service conciergerie disponible.",
        hote: {
            nom: "Malik Boudinar",
            photo: "https://i.pravatar.cc/150?img=15",
            inscription: "2017",
            note: 4.95,
            superhote: true
        },
        avis: [
            {auteur: "Sandra M.", date: "Décembre 2024", texte: "WOW ! Un penthouse de rêve. La terrasse et le jacuzzi sont incroyables.", note: 5},
            {auteur: "Karim F.", date: "Novembre 2024", texte: "Luxe et confort au rendez-vous. Malik est aux petits soins.", note: 5},
            {auteur: "Elena B.", date: "Octobre 2024", texte: "Magnifique ! La vue est à couper le souffle. Service impeccable.", note: 5}
        ],
        regles: {
            fumeur: false,
            fetes: false,
            animaux: false
        }
    },
    {
        id: 14,
        titre: "Chalet montagne Batna",
        wilaya: "Batna",
        quartier: "Monts Aurès",
        type: "chalet",
        prix: 12000,
        images: [
            "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800",
            "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=800",
            "https://images.unsplash.com/photo-1600566753151-384129cf4e3e?w=800",
            "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=800",
            "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800"
        ],
        voyageurs: 6,
        chambres: 3,
        lits: 4,
        sallesBain: 2,
        note: 4.81,
        nbAvis: 67,
        superhote: false,
        animauxAcceptes: true,
        equipements: ["WiFi", "Chauffage central", "Cheminée", "Cuisine", "Terrasse bois", "Vue montagne", "Randonnées", "Parking"],
        description: "Chalet confortable dans les Aurès avec vue sur les montagnes. Idéal pour les amoureux de randonnée et de nature. Proximité de Timgad (ruines romaines UNESCO). Air pur et calme absolu.",
        hote: {
            nom: "Tahar Chaoui",
            photo: "https://i.pravatar.cc/150?img=71",
            inscription: "2021",
            note: 4.78
        },
        avis: [
            {auteur: "Lucas D.", date: "Novembre 2024", texte: "Chalet chaleureux, parfait pour un séjour montagne. Tahar est accueillant.", note: 5},
            {auteur: "Amel K.", date: "Octobre 2024", texte: "Très agréable, la cheminée est top en soirée. Belle région.", note: 5},
            {auteur: "Patrick R.", date: "Septembre 2024", texte: "Bien pour randonner, chalet simple mais confortable.", note: 4}
        ],
        regles: {
            fumeur: true,
            fetes: false,
            animaux: true
        }
    },
    {
        id: 15,
        titre: "Loft industriel Sétif",
        wilaya: "Sétif",
        quartier: "Centre-ville",
        type: "loft",
        prix: 10000,
        images: [
            "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800",
            "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800",
            "https://images.unsplash.com/photo-1556020685-ae41abfc9365?w=800",
            "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800",
            "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800"
        ],
        voyageurs: 3,
        chambres: 1,
        lits: 2,
        sallesBain: 1,
        note: 4.69,
        nbAvis: 54,
        superhote: false,
        animauxAcceptes: false,
        equipements: ["WiFi", "Climatisation", "Cuisine ouverte", "Style industriel", "Grande hauteur", "Bureau", "TV"],
        description: "Loft au design industriel en plein centre de Sétif. Espace ouvert avec grande hauteur sous plafond. Idéal pour digital nomads et voyageurs d'affaires. Proche commerces et restaurants.",
        hote: {
            nom: "Rym Benali",
            photo: "https://i.pravatar.cc/150?img=44",
            inscription: "2023",
            note: 4.65
        },
        avis: [
            {auteur: "Mehdi A.", date: "Décembre 2024", texte: "Loft original et bien situé. Rym est réactive.", note: 5},
            {auteur: "Camille F.", date: "Novembre 2024", texte: "Sympa pour un court séjour, bien équipé.", note: 4},
            {auteur: "Samir B.", date: "Octobre 2024", texte: "Correct pour le prix, emplacement pratique.", note: 4}
        ],
        regles: {
            fumeur: false,
            fetes: false,
            animaux: false
        }
    },
    {
        id: 16,
        titre: "Villa luxe avec spa Skikda",
        wilaya: "Skikda",
        quartier: "Stora",
        type: "villa",
        prix: 45000,
        images: [
            "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800",
            "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800",
            "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=800",
            "https://images.unsplash.com/photo-1600566753151-384129cf4e3e?w=800",
            "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800"
        ],
        voyageurs: 12,
        chambres: 6,
        lits: 10,
        sallesBain: 5,
        note: 4.97,
        nbAvis: 89,
        superhote: true,
        animauxAcceptes: false,
        equipements: ["WiFi", "Piscine chauffée", "Spa", "Sauna", "Jacuzzi", "Salle sport", "Cinéma", "Cuisine chef", "Personnel"],
        description: "Villa d'exception avec spa privatif et services haut de gamme. Piscine à débordement chauffée, jacuzzi, sauna, salle de sport, home cinéma. Chef cuisinier et personnel disponibles. Vue mer exceptionnelle sur la baie de Stora.",
        hote: {
            nom: "Samira Benmessaoud",
            photo: "https://i.pravatar.cc/150?img=29",
            inscription: "2016",
            note: 4.98,
            superhote: true
        },
        avis: [
            {auteur: "François L.", date: "Décembre 2024", texte: "Villa de prestige absolue ! Service 5 étoiles, tout est parfait.", note: 5},
            {auteur: "Amira T.", date: "Novembre 2024", texte: "Incroyable ! Un séjour de rêve pour notre mariage. Samira est extraordinaire.", note: 5},
            {auteur: "Marco R.", date: "Octobre 2024", texte: "Luxe, confort et service impeccable. Une expérience inoubliable.", note: 5}
        ],
        regles: {
            fumeur: false,
            fetes: true,
            animaux: false
        }
    },
    {
        id: 17,
        titre: "Appartement cosy Blida",
        wilaya: "Blida",
        quartier: "Centre-ville",
        type: "appartement",
        prix: 7500,
        images: [
            "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800",
            "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800",
            "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800",
            "https://images.unsplash.com/photo-1556912167-f556f1f39faa?w=800",
            "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800"
        ],
        voyageurs: 3,
        chambres: 1,
        lits: 2,
        sallesBain: 1,
        note: 4.71,
        nbAvis: 48,
        superhote: false,
        animauxAcceptes: true,
        equipements: ["WiFi", "Climatisation", "Cuisine", "Balcon", "Proche Chréa", "Parking", "TV"],
        description: "Appartement confortable au pied de l'Atlas blidéen. Idéal pour découvrir Blida et faire des excursions au parc national de Chréa. Centre-ville accessible à pied. Calme et fonctionnel.",
        hote: {
            nom: "Hamza Guerrout",
            photo: "https://i.pravatar.cc/150?img=55",
            inscription: "2022",
            note: 4.68
        },
        avis: [
            {auteur: "Lynda M.", date: "Novembre 2024", texte: "Bien pour visiter Chréa. Hamza est sympa et serviable.", note: 5},
            {auteur: "Younes K.", date: "Octobre 2024", texte: "Appartement simple mais propre. Bon emplacement.", note: 4},
            {auteur: "Nora B.", date: "Septembre 2024", texte: "Correct pour le prix. Proche de tout.", note: 4}
        ],
        regles: {
            fumeur: false,
            fetes: false,
            animaux: true
        }
    },
    {
        id: 18,
        titre: "Maison d'hôtes Mostaganem",
        wilaya: "Mostaganem",
        quartier: "Salamandre",
        type: "maison",
        prix: 11000,
        images: [
            "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800",
            "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800",
            "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800",
            "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800",
            "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800"
        ],
        voyageurs: 5,
        chambres: 3,
        lits: 4,
        sallesBain: 2,
        note: 4.86,
        nbAvis: 93,
        superhote: false,
        animauxAcceptes: true,
        equipements: ["WiFi", "Climatisation", "Cuisine", "Jardin", "Vue mer", "Plage 300m", "Barbecue", "Parking"],
        description: "Maison d'hôtes chaleureuse à Salamandre, quartier balnéaire de Mostaganem. Ambiance familiale, jardin fleuri, proche de la plage. Découvrez la gastronomie locale et les plages de sable fin.",
        hote: {
            nom: "Nabil Cherchali",
            photo: "https://i.pravatar.cc/150?img=62",
            inscription: "2020",
            note: 4.83
        },
        avis: [
            {auteur: "Khadija S.", date: "Décembre 2024", texte: "Accueil très chaleureux ! Nabil nous a fait découvrir les spécialités locales.", note: 5},
            {auteur: "Pierre M.", date: "Novembre 2024", texte: "Maison agréable, proche de la plage. Ambiance conviviale.", note: 5},
            {auteur: "Latifa A.", date: "Octobre 2024", texte: "Très bon séjour, le jardin est joli et la maison confortable.", note: 4}
        ],
        regles: {
            fumeur: true,
            fetes: false,
            animaux: true
        }
    },
    {
        id: 19,
        titre: "Appartement vue Méditerranée",
        wilaya: "Oran",
        quartier: "Ain El Turck",
        type: "appartement",
        prix: 13500,
        images: [
            "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800",
            "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800",
            "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800",
            "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=800",
            "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?w=800"
        ],
        voyageurs: 4,
        chambres: 2,
        lits: 3,
        sallesBain: 1,
        note: 4.79,
        nbAvis: 107,
        superhote: false,
        animauxAcceptes: false,
        equipements: ["WiFi", "Climatisation", "Cuisine", "Balcon vue mer", "Piscine résidence", "Parking", "Plage 50m"],
        description: "Appartement lumineux avec vue directe sur la mer. Balcon spacieux parfait pour les couchers de soleil. Résidence sécurisée avec piscine. Plage à 50 mètres. Restaurants et cafés à proximité.",
        hote: {
            nom: "Djamila Boutarfa",
            photo: "https://i.pravatar.cc/150?img=38",
            inscription: "2021",
            note: 4.76
        },
        avis: [
            {auteur: "Rachid M.", date: "Décembre 2024", texte: "Vue superbe ! L'appartement est bien situé et propre.", note: 5},
            {auteur: "Sandrine L.", date: "Novembre 2024", texte: "Très agréable, on entend les vagues depuis le balcon.", note: 5},
            {auteur: "Kamel B.", date: "Octobre 2024", texte: "Bon séjour, la vue est magnifique comme sur les photos.", note: 4}
        ],
        regles: {
            fumeur: false,
            fetes: false,
            animaux: false
        }
    },
    {
        id: 20,
        titre: "Villa familiale Djelfa",
        wilaya: "Djelfa",
        quartier: "Périphérie",
        type: "villa",
        prix: 9000,
        images: [
            "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800",
            "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800",
            "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800",
            "https://images.unsplash.com/photo-1600607687644-c7171b42498b?w=800",
            "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800"
        ],
        voyageurs: 8,
        chambres: 4,
        lits: 6,
        sallesBain: 2,
        note: 4.68,
        nbAvis: 39,
        superhote: false,
        animauxAcceptes: true,
        equipements: ["WiFi", "Chauffage", "Cuisine", "Grand jardin", "Barbecue", "Parking 3 voitures", "Calme"],
        description: "Grande villa familiale idéale pour groupes. Grand jardin avec arbres fruitiers. Calme absolu, air pur des hauts plateaux. Parfait pour se ressourcer loin de la ville. Idéal pour familles nombreuses.",
        hote: {
            nom: "Boualem Hadji",
            photo: "https://i.pravatar.cc/150?img=67",
            inscription: "2023",
            note: 4.64
        },
        avis: [
            {auteur: "Fouad K.", date: "Novembre 2024", texte: "Maison spacieuse, parfaite pour notre grande famille. Boualem est accueillant.", note: 5},
            {auteur: "Aicha M.", date: "Octobre 2024", texte: "Calme et reposant. Le jardin est agréable pour les enfants.", note: 4},
            {auteur: "Hassan B.", date: "Septembre 2024", texte: "Bien pour un séjour en famille, maison simple mais fonctionnelle.", note: 4}
        ],
        regles: {
            fumeur: true,
            fetes: true,
            animaux: true
        }
    }
];
