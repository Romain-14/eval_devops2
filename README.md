# 🎯 Évaluation Module 2 - DevOps

Projet d’évaluation visant à mettre en place une chaîne d’intégration continue (CI) simple avec Jenkins pour un backend Node.js.

---

## 🧱 Étape 1 – Génération de la structure backend

Lancer le script `init-backend.sh` pour initialiser la structure et les fichiers :

```sh
script/init-backend.sh
```

> Le script génère automatiquement les fichiers nécessaires (structure, dépendances, tests, Dockerfile…).

Une fois terminé, lance le serveur pour tester rapidement :

```sh
npm run dev
```

Si tout fonctionne, tu verras dans le terminal :
> `Backend running at http://localhost:3000`

---

## 🧪 Étape 2 – Test manuel

Coupe le serveur (`Ctrl + C`), puis exécute les tests unitaires :

```sh
npm test
```

Résultat attendu :

```sh
PASS  src/tests/ping.test.js
  GET /ping
    ✓ should return pong (32 ms)

Test Suites: 1 passed, 1 total                         
Tests:       1 passed, 1 total                         
Snapshots:   0 total
Time:        3.362 s
```

> Parfait, maintenant direction Jenkins pour automatiser tout ça !

---

## 🐳 Étape 3 – Lancer l’infrastructure Docker

Il est temps de builder tous les services nécessaires (Jenkins, DB, backend...) :

```sh
docker-compose build backend
docker compose up -d
```

Vérifie ensuite que les conteneurs sont bien lancés :

```sh
docker ps
```

Tu devrais voir :

- `jenkins-docker`
- `my-jenkins`
- `backend`
- `db`

---

## 🛠️ Étape 4 – Configuration du pipeline Jenkins

1. Rendez-vous sur [http://localhost:8080](http://localhost:8080)  
2. Connecte-toi, puis :
   - Clique sur **"Nouveau Item"**
   - Choisis **"Pipeline"**
   - Nomme le projet (ex. : `test-backend`)
   - Dans l’onglet **Pipeline**, colle le script suivant :

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

3. Clique sur **"Build Now"**  
4. Tu devrais voir les étapes s’exécuter avec succès ✅

---

## ✅ Résultat attendu

Ton pipeline Jenkins exécute désormais automatiquement les tests après avoir cloné le repo.  


