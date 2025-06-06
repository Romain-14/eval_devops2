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
	const newBook = req.body;
	const insertedId = null; // sera récupéré par la requete sql
    if(!insertedId){
        res.status(500).json({message: "Error while inserting data"})
    }
	return res.status(201).json({ id: insertedId, ...newBook });
});

export default router;
