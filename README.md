# Price Quest - DFS 25-26

Application de jeu de devinettes de prix IKEA.

## Architecture

```
projet-dfs/
├── backend/          # Node.js + Express
│   ├── server.js     # Point d'entrée + routes
│   ├── data.js       # Données (produits, utilisateurs, sessions)
│   ├── middleware/
│   │   └── auth.js   # JWT middleware
│   └── package.json
└── frontend-src/     # Angular 21 (standalone)
    ├── main.ts
    ├── index.html
    ├── angular.json
    ├── tsconfig.json
    ├── package.json
    └── app/
        ├── app.component.ts
        ├── app.config.ts
        ├── app.routes.ts
        ├── auth.interceptor.ts
        ├── guards/
        │   └── auth.guard.ts
        ├── services/
        │   ├── auth.service.ts
        │   └── session.service.ts
        └── components/
            ├── login/
            ├── sessions/
            ├── create-session/
            ├── game/
            └── classement/
```

## Installation & Lancement

### Backend

```bash
cd backend
npm install
npm start
# Serveur sur http://localhost:3000
```

### Frontend

```bash
cd frontend-src
npm install
npm start
# App sur http://localhost:4200
```

## Comptes de test

| Email     | Mot de passe | Rôle  |
|-----------|-------------|-------|
| a@a.com   | root        | Admin |
| b@b.com   | azerty      | User  |
| c@c.com   | qwerty      | User  |

## Fonctionnalités implémentées

### ✅ Fonctionnalités principales
- **Créer une session** (admin uniquement) — sélection aléatoire de 4 produits
- **Rejoindre une session** — tout utilisateur connecté
- **Proposer un prix** — formulaire validé en front et back
- **Voir le prix réel + points** — affichage après chaque réponse (score = max(0, 100 - |différence|))
- **Classement** — accessible une fois toutes les questions répondues
- **Reprise de session** — si l'utilisateur revient, il reprend là où il s'est arrêté

### ✅ Sécurité
- JWT pour l'authentification
- Routes frontend protégées par guards (authGuard, adminGuard, guestGuard)
- Endpoints backend protégés (middleware authenticate + requireAdmin)
- Classement accessible uniquement aux participants ayant tout répondu

### ✅ Bonnes pratiques Angular
- Composants standalone
- Signals (`signal()`, `computed()`)
- Syntaxe `@if`, `@else`, `@for`
- Intercepteur HTTP pour le token JWT
- Lazy loading des composants

### ✅ Validation
- **Front** : Reactive Forms avec Validators (required, email, min, minLength)
- **Back** : Validation explicite dans chaque endpoint

## Endpoints API

| Méthode | Route | Auth | Description |
|---------|-------|------|-------------|
| POST | /auth/login | ❌ | Connexion |
| GET | /produits | ✅ | Liste des produits |
| GET | /sessions | ✅ | Liste des sessions |
| POST | /sessions | ✅ Admin | Créer une session |
| GET | /sessions/:id | ✅ | Détail session + progression |
| POST | /sessions/:id/rejoindre | ✅ | Rejoindre |
| POST | /sessions/:id/repondre | ✅ | Soumettre un prix |
| GET | /sessions/:id/classement | ✅ (si terminé) | Classement |
