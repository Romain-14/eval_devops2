#!/bin/bash

set -e

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$PROJECT_ROOT"

echo "📁 Création des dossiers backend..."

mkdir -p backend/src/{config,controllers,routes,services,models,tests}
cd backend

echo "📦 Initialisation de npm + dépendances..."

npm init -y

# Ajout du type: module + scripts
node -e "
const fs = require('fs');
const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
pkg.type = 'module';
pkg.scripts = {
  start: 'node src/server.js',
  dev: 'nodemon src/server.js',
  test: \"cross-env NODE_OPTIONS='--experimental-vm-modules' jest --config=jest.config.mjs\",
  lint: 'eslint .'
};
fs.writeFileSync('package.json', JSON.stringify(pkg, null, 2));
"

npm install express dotenv mysql2 cors
npm install -D jest supertest cross-env nodemon eslint
npx eslint --init

echo "📄 Création des fichiers avec contenu..."

# server.js
cat > src/server.js <<'EOF'
import "dotenv/config";
import app from "./app.js";

const PORT = process.env.PORT || 9000;

app.listen(PORT, () => {
  console.log(`Backend running at http://localhost:${PORT}`);
});
EOF

# app.js
cat > src/app.js <<'EOF'
import "dotenv/config";
import express from "express";
import cors from "cors";
import routes from "./routes/index.routes.js";
//import pool from "./config/db.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use(routes);

export default app;
EOF

# routes/index.routes.js
cat > src/routes/index.routes.js <<'EOF'
import { Router } from "express";

const router = Router();

router.get("/ping", (req, res) => {
  res.json({ message: "pong" });
});

export default router;
EOF

# config/db.js
cat > src/config/db.js <<EOF
import mysql from "mysql2/promise";

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

pool.getConnection()
  .then((res) => console.log(\`Connected to \${res.config.database} database\`))
  .catch((err) => console.log(err));

export default pool;
EOF

# ping.test.js
cat > src/tests/ping.test.js <<'EOF'
import request from "supertest";
import app from "../app.js";

describe("GET /ping", () => {
  it("should return pong", async () => {
    const res = await request(app).get("/ping");
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("pong");
  });
});
EOF

# jest.config.mjs
cat > jest.config.mjs <<'EOF'
export default {
  testEnvironment: "node",
  roots: ["src/tests"],
  transform: {}
};
EOF

# .env
cat > .env <<'EOF'
PORT=3000
DB_HOST="db"
DB_PORT=3306
DB_USER="dev"
DB_PASSWORD="khyndev"
DB_NAME="bookstore"
EOF

# Dockerfile
cat > Dockerfile <<'EOF'
FROM node:lts
WORKDIR /app
COPY . .
RUN npm install
CMD ["npm", "run", "dev"]
EOF

# .dockerignore
cat > .dockerignore <<'EOF'
node_modules
npm-debug.log
.env
.vscode
coverage
Dockerfile*
.dockerignore
.git
EOF

echo "✅ Backend initialisé et prêt dans ./backend/"
