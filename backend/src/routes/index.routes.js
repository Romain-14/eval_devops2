import { Router } from "express";

import bookRouter from "./book.routes.js";

const router = Router();

router.get("/ping", (req, res) => {
  res.json({ message: "pong" });
});

router.use("/books", bookRouter);

export default router;
