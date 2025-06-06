import { Router } from "express";

const router = Router();

router.get("/", (req, res) => {
	const fakedata = [
		{
			id: 1,
			title: "Bleach",
			author: "Tite Kubo",
			created_at: new Date(),
			user_id: 1,
			booktype_id: 2,
		},
		{
			id: 1,
			title: "Dragon Ball",
			author: "Akira Toriyama",
			created_at: new Date(),
			user_id: 3,
			booktype_id: 2,
		},
	];
	res.json(fakedata);
});

router.post("/", (req, res) => {
    const insertedId = 4;

    return res.status(201).json(insertedId);
});

export default router;
