# Evaluation module 2 - DevOps

Création de la structure backend
Lancer manuellement le script `init-backend.sh` :

```sh
script/init-backend.sh
```

> Le script génère le contenu des fichiers !

Lancer le serveur en local maintenant avec `npm run dev`.
Dans le terminal :
> Backend running at [http://localhost:3000]

Couper le serveur.
Testons notre test :p

Rentrer la commande :
> npm test

La sortie en terminal  :

```sh
PASS  src/tests/ping.test.js
  GET /ping
    √ should return pong (32 ms)

Test Suites: 1 passed, 1 total                         
Tests:       1 passed, 1 total                                         
Snapshots:   0 total
Time:        3.362 s
```

> Coupons le terminal `ctrl + c` ; la suite se passera dans Jenkins !

7. D'abord il faut build l'infrastructure complète

```sh
docker-compose up --build -d
```

8. Dans Jenkins [http://localhost:8080], créer un pipeline pour les tests.

```groovy
pipeline {
  agent any

  environment {
    COMPOSE_PROJECT_NAME = "eval"
  }

  stages {
    stage('Build Backend + DB') {
      steps {
        dir('/home/jenkins/_eval') {
          sh 'docker-compose up --build -d backend db'
        }
      }
    }

    stage('Test /ping') {
      steps {
        dir('/home/jenkins/_eval') {
          sh '''
            sleep 5
            curl -s -o /dev/null -w "%{http_code}" http://backend:3000/ping | grep 200
          '''
        }
      }
    }

    stage('Tests unitaires') {
      steps {
        dir('/home/jenkins/_eval/backend') {
          sh 'docker exec backend npm test'
        }
      }
    }
  }
}

```
