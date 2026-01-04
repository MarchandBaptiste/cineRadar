# CineRadar - Explorateur de Films & Séries

![Ce projet est une application web permettant d'explorer le catalogue mondial de films et de séries en temps réel, en exploitant les données de l'API TMDB ([The movie Database](https://www.themoviedb.org/)).](./assets/img/Capture%20d'écran%202026-01-04%20132454.png)

## 🚀 Fonctionnalités

Données en Temps Réel : Récupération des affiches, synopsis, notes et dates de sortie directement depuis les serveurs de TMDB.

Filtrage Dynamique : Exploration par popularité, tendances ou genres.

Interface Responsive : Design optimisé pour une consultation fluide sur desktop et mobile.

## 🛠️ Stack Technique

Frontend : HTML5 / CSS3 / JavaScript (ES6+)

API : ([TMDB API v3](https://developer.themoviedb.org/docs/getting-started))

Déploiement : GitHub Pages

## 📂 Structure du Code

Le projet est structuré pour maximiser l'efficacité des appels API :

Logic de Récupération : Scripts JavaScript gérant les requêtes asynchrones (fetch) vers les endpoints de TMDB.

Composants UI : Système de cartes dynamiques pour l'affichage des médias.

Gestion des Assets : Traitement des chemins d'images (posters et backdrops) fournis par l'API.

## 📊 Aperçu des Tests

Validation des Requêtes : Test de la gestion des erreurs (clés API invalides, limites de débit, résultats vides).

Performance : Optimisation du temps de chargement des images via le lazy loading.

Compatibilité : Vérification du rendu sur les navigateurs majeurs (Chrome, Firefox, Safari).