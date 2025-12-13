import request from "supertest";
import app from "../server/app.js";
import Sweet from "../models/Sweet.js";
import User from "../models/User.js";
import jwt from "jsonwebtoken";
import { jest } from "@jest/globals";
import {
    connectDBForTesting,
    closeDBForTesting,
    clearDB
} from "./setup.js";

// Create real JWT cookie
const createAuthCookie = async (role = "user") => {
    const user = await User.create({
        name: "Test User",
        email: `${role}@mail.com`,
        password: "hashed",
        role
    });

    const token = jwt.sign(
        { id: user._id },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
    );

    return `userToken=${token}`;
};

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



/* -------------------------------------------------------------
   PUBLIC ROUTES
-------------------------------------------------------------- */

// GET ALL
describe("GET /api/v1/sweet/", () => {

    it("returns empty list when no sweets exist", async () => {
        const res = await request(app).get("/api/v1/sweet/");
        expect(res.status).toBe(200);
        expect(res.body.sweets).toEqual([]);
    });

    it("returns all sweets", async () => {
        await Sweet.create({
            name: "Jalebi",
            category: "Indian",
            price: 20,
            quantity: 10,
            image: "img.jpg",
            rating: 4.5,
            description: "Sweet and crispy"
        });

        const res = await request(app).get("/api/v1/sweet/");
        expect(res.status).toBe(200);
        expect(res.body.sweets.length).toBe(1);
    });

    it("returns 500 when DB throws error", async () => {
        jest.spyOn(Sweet, "find").mockRejectedValue(new Error("DB error"));
        const res = await request(app).get("/api/v1/sweet/");
        expect(res.status).toBe(500);
    });

});



// SEARCH
describe("GET /api/v1/sweet/search", () => {

    it("filters by name", async () => {
        await Sweet.create({
            name: "Barfi",
            category: "Classic",
            price: 15,
            quantity: 5,
            image: "img.jpg",
            rating: 4.2,
            description: "Delicious"
        });

        const res = await request(app).get("/api/v1/sweet/search?name=bar");
        expect(res.status).toBe(200);
        expect(res.body.sweets.length).toBe(1);
    });

    it("filters by category", async () => {
        await Sweet.create({
            name: "Ladoo",
            category: "Indian",
            price: 10,
            quantity: 8,
            image: "img.jpg",
            rating: 4.7,
            description: "Soft and sweet"
        });

        const res = await request(app).get("/api/v1/sweet/search?category=Indian");
        expect(res.status).toBe(200);
        expect(res.body.sweets.length).toBe(1);
    });

    it("filters by price range", async () => {
        await Sweet.create({
            name: "Halwa",
            category: "Indian",
            price: 30,
            quantity: 5,
            image: "img.jpg",
            rating: 4.0,
            description: "Rich taste"
        });

        const res = await request(app).get("/api/v1/sweet/search?minPrice=20&maxPrice=40");
        expect(res.status).toBe(200);
        expect(res.body.sweets.length).toBe(1);
    });

    it("returns 500 on DB error", async () => {
        jest.spyOn(Sweet, "find").mockRejectedValue(new Error("DB error"));
        const res = await request(app).get("/api/v1/sweet/search");
        expect(res.status).toBe(500);
    });

});



/* -------------------------------------------------------------
   ADMIN PROTECTED ROUTES
-------------------------------------------------------------- */

// ADD
describe("POST /api/v1/sweet/ (Admin only)", () => {

    it("blocks unauthenticated user", async () => {
        const res = await request(app)
            .post("/api/v1/sweet/")
            .send({
                name: "Ladoo",
                category: "Indian",
                price: 10,
                quantity: 5,
                image: "img.jpg"
            });

        expect(res.status).toBe(401);
    });

    it("blocks normal user", async () => {
        const cookie = await createAuthCookie("user");

        const res = await request(app)
            .post("/api/v1/sweet/")
            .set("Cookie", cookie)
            .send({
                name: "Ladoo",
                category: "Indian",
                price: 10,
                quantity: 5,
                image: "img.jpg"
            });

        expect(res.status).toBe(403);
    });

    it("allows admin to create sweet", async () => {
        const cookie = await createAuthCookie("admin");

        const res = await request(app)
            .post("/api/v1/sweet/")
            .set("Cookie", cookie)
            .send({
                name: "Ladoo",
                category: "Indian",
                price: 10,
                quantity: 5,
                image: "img.jpg",
                rating: 4.5,
                description: "Tasty"
            });

        expect(res.status).toBe(201);
        expect(res.body.sweet.name).toBe("Ladoo");
    });

    it("requires all mandatory fields", async () => {
        const cookie = await createAuthCookie("admin");

        const res = await request(app)
            .post("/api/v1/sweet/")
            .set("Cookie", cookie)
            .send({ name: "Incomplete", image: "" });

        expect(res.status).toBe(400);
    });

    it("returns 500 on DB error", async () => {
        jest.spyOn(Sweet, "create").mockRejectedValue(new Error("fail"));

        const cookie = await createAuthCookie("admin");

        const res = await request(app)
            .post("/api/v1/sweet/")
            .set("Cookie", cookie)
            .send({
                name: "Barfi",
                category: "Classic",
                price: 20,
                quantity: 10,
                image: "img.jpg"
            });

        expect(res.status).toBe(500);
    });

});



// UPDATE
describe("PUT /api/v1/sweet/:id (Admin only)", () => {

    it("blocks non-admin user", async () => {
        const cookie = await createAuthCookie("user");

        const res = await request(app)
            .put("/api/v1/sweet/123")
            .set("Cookie", cookie)
            .send({ name: "Update" });

        expect(res.status).toBe(403);
    });

    it("returns 404 when sweet not found", async () => {
        const cookie = await createAuthCookie("admin");

        const res = await request(app)
            .put("/api/v1/sweet/507f191e810c19729de860ea")
            .set("Cookie", cookie)
            .send({ name: "New Name" });

        expect(res.status).toBe(404);
    });

    it("updates sweet when admin", async () => {
        const sweet = await Sweet.create({
            name: "Peda",
            category: "Indian",
            price: 10,
            quantity: 3,
            image: "img.jpg",
            rating: 4,
            description: "Soft Peda"
        });

        const cookie = await createAuthCookie("admin");

        const res = await request(app)
            .put(`/api/v1/sweet/${sweet._id}`)
            .set("Cookie", cookie)
            .send({ name: "Updated Peda", rating: 5 });

        expect(res.status).toBe(200);
        expect(res.body.sweet.name).toBe("Updated Peda");
        expect(res.body.sweet.rating).toBe(5);
    });

    it("returns 500 on DB error", async () => {
        jest.spyOn(Sweet, "findByIdAndUpdate").mockRejectedValue(new Error("fail"));

        const cookie = await createAuthCookie("admin");

        const res = await request(app)
            .put("/api/v1/sweet/123")
            .set("Cookie", cookie)
            .send({ name: "Test" });

        expect(res.status).toBe(500);
    });

});



// DELETE
describe("DELETE /api/v1/sweet/:id (Admin only)", () => {

    it("blocks non-admin user", async () => {
        const cookie = await createAuthCookie("user");

        const res = await request(app)
            .delete("/api/v1/sweet/123")
            .set("Cookie", cookie);

        expect(res.status).toBe(403);
    });

    it("returns 404 when deleting non-existing sweet", async () => {
        const cookie = await createAuthCookie("admin");

        const res = await request(app)
            .delete("/api/v1/sweet/507f191e810c19729de860ea")
            .set("Cookie", cookie);

        expect(res.status).toBe(404);
    });

    it("deletes sweet when admin", async () => {
        const sweet = await Sweet.create({
            name: "Halwa",
            category: "Indian",
            price: 12,
            quantity: 5,
            image: "img.jpg",
            rating: 4,
            description: "Best Halwa"
        });

        const cookie = await createAuthCookie("admin");

        const res = await request(app)
            .delete(`/api/v1/sweet/${sweet._id}`)
            .set("Cookie", cookie);

        expect(res.status).toBe(200);
        expect(res.body.message).toBe("Sweet deleted successfully");
    });

    it("returns 500 on DB error", async () => {
        jest.spyOn(Sweet, "findByIdAndDelete").mockRejectedValue(new Error("fail"));

        const cookie = await createAuthCookie("admin");

        const res = await request(app)
            .delete("/api/v1/sweet/123")
            .set("Cookie", cookie);

        expect(res.status).toBe(500);
    });

});
