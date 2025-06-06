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
