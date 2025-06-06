import { Router } from "express";

const router = Router();

router.get("/", (req, res) => {
	const fakedata = [
		{
			id: 1,
			title: "Bleach",
			author: "Tite Kubo",
			created_at: new Date().toISOString(),
			user_id: 1,
			booktype_id: 2,
		},
		{
			id: 1,
			title: "Dragon Ball",
			author: "Akira Toriyama",
			created_at: new Date().toISOString(),
			user_id: 3,
			booktype_id: 2,
		},
	];
	res.json(fakedata);
});

router.post("/", (req, res) => {
	const { title, author, user_id, booktype_id } = req.body;

	if (!title || !author || !user_id || !booktype_id) {
		return res.status(400).json({ error: "Missing required fields" });
	}

	const insertedBook = {
		id: 4,
		...req.body,
	};

	return res.status(201).json(insertedBook);
});

export default router;
