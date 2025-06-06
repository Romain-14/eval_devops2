# 📦 Évaluation DevOps – API Backend (Node Express + MySQL) + Jenkins CI/CD

Ce projet a pour objectif de développer une API backend avec un pipeline CI/CD complet, fonctionnant **en local**.

L’environnement est entièrement conteneurisé via **Docker**, permettant d’isoler les différents services.

Un script d’initialisation (`/scripts/init-backend.sh`) est exécuté pour générer la structure du projet : dossiers, fichiers et leur contenu. Une fois le backend prêt, des tests unitaires sont mis en place (GET et POST `/books`) et déclenchés via Jenkins.

Un dépôt Git est ensuite initialisé. Grâce à un **webhook**, chaque `push` sur ce dépôt déclenche automatiquement le pipeline CI.

Pour permettre une connexion entre GitHub et Jenkins en local, **Ngrok** est utilisé afin d’exposer Jenkins via un tunnel sécurisé accessible par GitHub.

**Eslint** est également intégré pour garantir les bonnes pratiques de développement.

---

## 🧱 1. Initialisation du projet

Lancer manuellement le script `init-backend.sh` :

```sh
script/init-backend.sh
```

Ce script initialise les fichiers nécessaires dans le dossier `backend` :

- Structure de dossiers Clean-MVC (routes, controllers, etc.)
- Configuration ESLint avec support de Jest et Node
- Tests unitaires de base
- Dockerfile, .env et autres fichiers utiles

---

## 🚀 2. Démarrage en local

```sh
cd backend
npm run dev
```

Une fois lancé :
> `Backend running at http://localhost:3000`

Stopper le serveur avec `Ctrl + C`.

---

## 🧪 3. Lancer les tests localement

```sh
npm test
```

Résultat attendu :

```sh
PASS  src/tests/ping.test.js
```

---

## 🧹 4. Linter (ESLint)

```sh
npm run lint
```

ESLint est configuré via `.eslintrc.json` pour supporter :

- Node.js
- ES2021
- Jest
- `process` en global

---

## 🐳 5. Docker

```sh
docker compose build backend
docker compose up -d
```

---

## ⚙️ 6. Jenkins – Pipeline CI/CD

Créer un **Pipeline** Jenkins nommé par exemple `ci-backend`. Exemple de script :

```groovy
pipeline {
  agent any

  stages {
    stage('Clone') {
      steps {
        git url: 'https://github.com/Romain-14/eval_devops2.git', branch: 'main'
      }
    }
    stage('Install') {
      steps {
        dir('backend') {
          sh 'npm install'
        }
      }
    }
    stage('Lint') {
      steps {
        dir('backend') {
          sh 'npm run lint'
        }
      }
    }
    stage('Test') {
      steps {
        dir('backend') {
          sh 'npm test'
        }
      }
    }
  }
}
```

---

## 🌐 7. GitHub Webhook via Ngrok

### a. Démarrer Ngrok

```sh
ngrok http 8080
```

Repérer l’URL HTTPS du type :

```sh
https://xxxxx.ngrok-free.app
```

Ajoutez `/github-webhook/` à l’URL pour GitHub.

### b. Configurer le webhook GitHub

1. Aller dans les **Settings** du repo GitHub
2. Menu **Webhooks**
3. Ajouter un webhook :
   - Payload URL : `https://xxxxx.ngrok-free.app/github-webhook/`
   - Content type : `application/json`
   - Events : `Just the push event`

---

## ✅ Résultat CI attendu

```sh
> backend@1.0.0 test
> cross-env NODE_OPTIONS='--experimental-vm-modules' jest --config=jest.config.mjs

PASS src/tests/ping.test.js
```

## Ajout des Routes GET et POST + Tests

- Création des fichiers, ajout du code
- Push -> Automatisation du build Job `ci-backend`

## ✅ Résultat CI attendu

```sh
> backend@1.0.0 test
> cross-env NODE_OPTIONS='--experimental-vm-modules' jest --config=jest.config.mjs

PASS src/tests/ping.test.js
PASS src/tests/book.test.js
```

---

## 🔮 À venir

- Connexion réelle à la base de données MySQL dans les tests (tests d’intégration) et transition en MVC router -> controller -> model
- Utilisation de `supertest` + données insérées dans une base Docker
- Terminer le CRUD `book` en test unitaires puis d'intégrations
- Test `E2E` API
- Activation du service docker React
- Test `E2E` complet
- Tests d’erreurs et de validation des données (`400`, `500`)
- Pipeline de déploiement (CD) vers un environnement distant
