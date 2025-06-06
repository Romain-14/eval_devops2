import request from "supertest";
import app from "../app.js";

describe("Books API", () => {
	it("GET /books should return an array", async () => {
		const res = await request(app).get("/books");

		expect(res.statusCode).toBe(200);
		expect(Array.isArray(res.body)).toBe(true);
	});

	it("POST /books should add a book", async () => {
		const newBook = {
			id: 1,
			title: "Bahamut, the new chaos",
			author: "Romain Fournier",
			created_at: new Date().toISOString(),
			user_id: 5,
			booktype_id: 3,
		};
		const res = await request(app).post("/books").send(newBook);

		expect(res.statusCode).toBe(201);
		expect(res.body).toMatchObject({
			id: 4,
			...newBook,
		});
	});
});
