# 📦 Évaluation DevOps – API Backend (Node Express + MySQL) + Jenkins CI/CD

Ce projet a pour objectif de développer une API backend avec un pipeline CI/CD complet, fonctionnant **en local**.

L’environnement est entièrement conteneurisé via **Docker**, permettant d’isoler les différents services.

Un script d’initialisation (`/scripts/init-backend.sh`) est exécuté pour générer la structure du projet : dossiers, fichiers et leur contenu. Une fois le backend prêt, un test Jest simple (`/ping`) est mis en place et déclenché via Jenkins.

Un dépôt Git est ensuite initialisé. Grâce à un **webhook**, chaque `push` sur ce dépôt déclenche automatiquement le job Jenkins `test-backend`.

Pour permettre une connexion entre GitHub et Jenkins en local, **Ngrok** est utilisé afin d’exposer Jenkins via un tunnel sécurisé accessible par GitHub.

**Eslint** est également de la partie afin de permettre les bonnes pratiques.

## 🧱 1. Initialisation du projet

Lancer manuellement le script `init-backend.sh` :

```sh
script/init-backend.sh
```

> Ce script initialise les fichiers nécessaires dans le dossier `backend`.

---

## 🚀 2. Démarrage en local

```sh
cd backend
npm run dev
```

Une fois lancé :
> `Backend running at http://localhost:3000`

Stopper ensuite le serveur avec `Ctrl + C`.

---

## 🧪 3. Lancer les tests localement

```sh
npm test
```

Résultat attendu :

```sh
PASS  src/tests/ping.test.js
  GET /ping
    √ should return pong (32 ms)

Test Suites: 1 passed, 1 total                         
Tests:       1 passed, 1 total                                         
Snapshots:   0 total
Time:        3.362 s
```

---

## 🐳 4. Construction Docker et lancement de l'infra

```sh
docker-compose build backend
docker compose up -d
```

---

## ⚙️ 5. Configuration Jenkins

Aller sur : [http://localhost:8080](http://localhost:8080)

Créer un **nouveau pipeline** nommé `test-backend`.

Ajouter ce script dans le **Pipeline Script** :

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
    stage('Test route ping') {
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

## 🌐 6. GitHub Webhook via Ngrok


### a. Démarrer Ngrok

```sh
ngrok http 8080
```

Repérer l’URL HTTPS du type :

```sh
https://xxxxx.ngrok-free.app
# Il faudra rajouter /github-webhook/ à la fin de l'url
```

### b. Configurer le webhook GitHub

Créer un repo git si pas déjà fait, et initialiser-push votre projet local.

1. Aller dans les **Settings** du repo GitHub
2. Menu **Webhooks**
3. Ajouter un nouveau webhook :
   - Payload URL : `https://xxxxx.ngrok-free.app/github-webhook/`
   - Content type : `application/json`
   - Events : `Just the push event`
   - Secret : (laissez vide ou définissez-en une)

---

## 🔁 7. Tester le pipeline en CI

1. Commit et push une modification sur `main`
2. Aller dans Jenkins, le job doit s’exécuter automatiquement
3. Voir les logs pour valider que le test `ping` passe

---

## ✅ Résultat attendu

```sh
> backend@1.0.0 test
> cross-env NODE_OPTIONS='--experimental-vm-modules' jest --config=jest.config.mjs

PASS src/tests/ping.test.js
  GET /ping
    ✓ should return pong

Test Suites: 1 passed, 1 total
Tests:       1 passed, 1 total
```

---
