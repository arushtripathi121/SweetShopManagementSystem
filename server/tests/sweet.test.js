import request from "supertest";
import app from "../server/app.js";
import Sweet from "../models/Sweet.js";
import { jest } from "@jest/globals";

import {
    connectDBForTesting,
    closeDBForTesting,
    clearDB
} from "./setup.js";

// Fake cookies for middleware (you will replace these later)
const adminCookie = "userToken=admin";
const userCookie = "userToken=user";

beforeAll(async () => {
    await connectDBForTesting();
});

afterEach(async () => {
    await clearDB();
    jest.restoreAllMocks();
});

afterAll(async () => {
    await closeDBForTesting();
});


/* ----------------------------------------------------------
   PUBLIC ROUTES — NO AUTH REQUIRED
----------------------------------------------------------- */

// GET ALL
describe("GET /api/v1/sweet/", () => {

    it("returns an empty list when no sweets exist", async () => {
        const res = await request(app).get("/api/v1/sweet/");
        expect(res.status).toBe(200);
        expect(res.body.sweets).toEqual([]);
    });

    it("returns all sweets without authentication", async () => {
        await Sweet.create({ name: "Jalebi", category: "Indian", price: 20, quantity: 10 });

        const res = await request(app).get("/api/v1/sweet/");
        expect(res.status).toBe(200);
        expect(res.body.sweets.length).toBe(1);
    });

    it("returns 500 when DB fails", async () => {
        jest.spyOn(Sweet, "find").mockRejectedValue(new Error("DB error"));
        const res = await request(app).get("/api/v1/sweet/");
        expect(res.status).toBe(500);
    });
});



// SEARCH
describe("GET /api/v1/sweet/search", () => {

    it("searches sweets by name", async () => {
        await Sweet.create({ name: "Barfi", category: "Classic", price: 15, quantity: 5 });

        const res = await request(app).get("/api/v1/sweet/search?name=bar");
        expect(res.status).toBe(200);
        expect(res.body.sweets.length).toBe(1);
    });

    it("searches by category", async () => {
        await Sweet.create({ name: "Ladoo", category: "Indian", price: 10, quantity: 8 });

        const res = await request(app).get("/api/v1/sweet/search?category=Indian");
        expect(res.status).toBe(200);
        expect(res.body.sweets.length).toBe(1);
    });

    it("filters by price range", async () => {
        await Sweet.create({ name: "Jalebi", category: "Indian", price: 25, quantity: 10 });

        const res = await request(app).get("/api/v1/sweet/search?minPrice=20&maxPrice=30");
        expect(res.status).toBe(200);
        expect(res.body.sweets.length).toBe(1);
    });

    it("returns 500 on DB error", async () => {
        jest.spyOn(Sweet, "find").mockRejectedValue(new Error("DB error"));
        const res = await request(app).get("/api/v1/sweet/search");
        expect(res.status).toBe(500);
    });
});



/* ----------------------------------------------------------
   ADMIN PROTECTED ROUTES
----------------------------------------------------------- */

// ADD
describe("POST /api/v1/sweet/ (Admin)", () => {

    it("blocks unauthenticated user", async () => {
        const res = await request(app).post("/api/v1/sweet/").send({
            name: "Ladoo",
            category: "Indian",
            price: 10,
            quantity: 5
        });

        // real middleware will give 401 or 403
        expect([401, 403]).toContain(res.status);
    });

    it("blocks normal user", async () => {
        const res = await request(app)
            .post("/api/v1/sweet/")
            .set("Cookie", userCookie)
            .send({
                name: "Ladoo",
                category: "Indian",
                price: 10,
                quantity: 5
            });

        expect([403]).toContain(res.status);
    });

    it("allows admin to create sweet", async () => {
        const res = await request(app)
            .post("/api/v1/sweet/")
            .set("Cookie", adminCookie)
            .send({
                name: "Ladoo",
                category: "Indian",
                price: 10,
                quantity: 5
            });

        expect(res.status).toBe(201);
        expect(res.body.sweet.name).toBe("Ladoo");
    });

    it("requires all fields", async () => {
        const res = await request(app)
            .post("/api/v1/sweet/")
            .set("Cookie", adminCookie)
            .send({ name: "Incomplete" });

        expect(res.status).toBe(400);
    });

    it("returns 500 on DB error", async () => {
        jest.spyOn(Sweet, "create").mockRejectedValue(new Error("DB error"));

        const res = await request(app)
            .post("/api/v1/sweet/")
            .set("Cookie", adminCookie)
            .send({
                name: "Barfi",
                category: "Classic",
                price: 20,
                quantity: 10
            });

        expect(res.status).toBe(500);
    });
});



// UPDATE
describe("PUT /api/v1/sweet/:id (Admin)", () => {

    it("blocks non-admin", async () => {
        const res = await request(app)
            .put("/api/v1/sweet/123")
            .set("Cookie", userCookie)
            .send({ name: "New" });

        expect([403]).toContain(res.status);
    });

    it("returns 404 when sweet not found", async () => {
        const res = await request(app)
            .put("/api/v1/sweet/507f191e810c19729de860ea")
            .set("Cookie", adminCookie)
            .send({ name: "New Sweet" });

        expect(res.status).toBe(404);
    });

    it("updates sweet when admin", async () => {
        const sweet = await Sweet.create({
            name: "Peda",
            category: "Indian",
            price: 15,
            quantity: 10
        });

        const res = await request(app)
            .put(`/api/v1/sweet/${sweet._id}`)
            .set("Cookie", adminCookie)
            .send({ name: "Updated Peda" });

        expect(res.status).toBe(200);
        expect(res.body.sweet.name).toBe("Updated Peda");
    });

    it("returns 500 on DB error", async () => {
        jest.spyOn(Sweet, "findByIdAndUpdate").mockRejectedValue(new Error("DB error"));

        const res = await request(app)
            .put("/api/v1/sweet/123")
            .set("Cookie", adminCookie)
            .send({ name: "Test" });

        expect(res.status).toBe(500);
    });
});



// DELETE
describe("DELETE /api/v1/sweet/:id (Admin)", () => {

    it("blocks non-admin users", async () => {
        const res = await request(app)
            .delete("/api/v1/sweet/123")
            .set("Cookie", userCookie);

        expect([403]).toContain(res.status);
    });

    it("returns 404 when trying to delete non-existing sweet", async () => {
        const res = await request(app)
            .delete("/api/v1/sweet/507f191e810c19729de860ea")
            .set("Cookie", adminCookie);

        expect(res.status).toBe(404);
    });

    it("deletes sweet when admin", async () => {
        const sweet = await Sweet.create({
            name: "Halwa",
            category: "Indian",
            price: 12,
            quantity: 5
        });

        const res = await request(app)
            .delete(`/api/v1/sweet/${sweet._id}`)
            .set("Cookie", adminCookie);

        expect(res.status).toBe(200);
        expect(res.body.message).toBe("Sweet deleted successfully");
    });

    it("returns 500 on DB error", async () => {
        jest.spyOn(Sweet, "findByIdAndDelete").mockRejectedValue(new Error("DB error"));

        const res = await request(app)
            .delete("/api/v1/sweet/123")
            .set("Cookie", adminCookie);

        expect(res.status).toBe(500);
    });
});
