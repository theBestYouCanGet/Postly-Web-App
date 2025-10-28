# Postly - Gestion de contenu pour réseaux sociaux

**Postly** est une application web tout-en-un conçue pour aider les créateurs de contenu (influenceurs, artistes, freelances et petites entreprises) à gérer et créer leurs publications pour les réseaux sociaux.

## Fonctionnalités

*   **Planification :** Planification des posts sur plusieurs plateformes (Instagram, TikTok, YouTube).
*   **Rédaction assistée par IA :** Génération ou amélioration des légendes, hashtags et descriptions.
*   **Création de visuels :** Outil simple pour la création de visuels (éditeur de templates ou de texte sur image).
*   **Statistiques :** Suivi de statistiques clés (engagement, vues, abonnés).
*   **Multi-comptes :** Gestion de plusieurs plateformes par utilisateur.
*   **Authentification :** Système d’authentification sécurisé via Supabase Auth.
*   **Interface :** Dashboard clair avec navigation latérale et cartes statistiques.
*   **Page d'accueil :** Page publique de présentation avec un bouton "Commencer maintenant".

## Architecture Technique

| Composant | Technologie | Détails |
| :--- | :--- | :--- |
| **Frontend** | React.js | Interface utilisateur moderne et responsive, construite avec Tailwind CSS et Shadcn/ui. |
| **Backend** | Node.js / Express | API REST pour gérer la logique métier et les interactions avec la base de données. |
| **Base de données** | Supabase | PostgreSQL pour la base de données et Supabase Auth pour l'authentification. |
| **Déploiement** | Vercel | Hébergement gratuit compatible avec l'architecture monorepo. |

## Instructions d'installation et de lancement locales

Ce projet est structuré en monorepo avec un dossier `frontend` (React) et un dossier `backend` (Node.js/Express).

### Prérequis

*   Node.js (version 18+)
*   pnpm (gestionnaire de paquets recommandé)
*   Un projet Supabase configuré (avec URL et clés API).

### 1. Configuration de l'environnement

1.  **Cloner le dépôt :**
    \`\`\`bash
    git clone https://github.com/theBestYouCanGet/Postly-Web-App.git
    cd Postly-Web-App
    \`\`\`

2.  **Configuration du Backend :**
    a. Naviguez vers le dossier `backend` :
    \`\`\`bash
    cd backend
    \`\`\`
    b. Installez les dépendances :
    \`\`\`bash
    npm install
    \`\`\`
    c. Créez un fichier `.env` dans le dossier `backend` et remplissez-le avec vos clés Supabase :
    \`\`\`
    SUPABASE_URL=VOTRE_URL_SUPABASE
    SUPABASE_ANON_KEY=VOTRE_CLE_ANON_SUPABASE
    SUPABASE_JWT_SECRET=VOTRE_JWT_SECRET_SUPABASE
    \`\`\`

3.  **Configuration du Frontend :**
    a. Naviguez vers le dossier `frontend` :
    \`\`\`bash
    cd ../frontend
    \`\`\`
    b. Installez les dépendances :
    \`\`\`bash
    pnpm install
    \`\`\`
    c. **Note :** Les clés Supabase sont déjà intégrées dans `frontend/src/lib/supabaseClient.js` pour simplifier les tests locaux, mais il est recommandé d'utiliser des variables d'environnement pour une application en production.

### 2. Lancement des serveurs

Vous devez lancer le backend et le frontend séparément.

1.  **Lancer le Backend (API) :**
    Dans le dossier `backend`, exécutez :
    \`\`\`bash
    npm start
    # Le serveur démarrera sur http://localhost:5000
    \`\`\`

2.  **Lancer le Frontend (React) :**
    Dans le dossier `frontend`, exécutez :
    \`\`\`bash
    pnpm run dev
    # L'application démarrera sur http://localhost:5173 (ou un autre port)
    \`\`\`

L'application sera accessible dans votre navigateur à l'adresse indiquée par le lancement du frontend (généralement `http://localhost:5173`).

## Déploiement sur Vercel

Le projet est configuré pour un déploiement sur Vercel en tant que monorepo.

### 1. Lier le dépôt GitHub

Le code source est disponible sur GitHub :

**[https://github.com/theBestYouCanGet/Postly-Web-App](https://github.com/theBestYouCanGet/Postly-Web-App)**

### 2. Procédure de déploiement

1.  **Importez le projet** sur Vercel depuis votre compte GitHub.
2.  **Configuration de construction :** Vercel détectera la configuration dans `vercel.json` et le projet React dans le dossier `frontend`.
3.  **Variables d'environnement :** Pour le backend (qui utilise Node.js), vous devez configurer les variables d'environnement de Supabase directement dans les paramètres du projet Vercel (dans la section **Settings > Environment Variables**) :
    *   `SUPABASE_URL`
    *   `SUPABASE_ANON_KEY`
    *   `SUPABASE_JWT_SECRET`
4.  **Déployez** le projet. Vercel gérera la construction du frontend (statique) et le déploiement du backend (fonctions serverless) selon les règles définies dans `vercel.json`.

---
*Ce projet a été généré par **Manus AI**.*
