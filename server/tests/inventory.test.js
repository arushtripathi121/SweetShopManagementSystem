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

const createAuthCookie = async (role = "user") => {
    const user = await User.create({
        name: "Tester",
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
   PURCHASE SWEET
-------------------------------------------------------------- */

describe("POST /api/v1/inventory/:id/purchase", () => {

    it("blocks unauthenticated user", async () => {
        const sweet = await Sweet.create({
            name: "Ladoo", category: "Indian", price: 5, quantity: 10, image: "img.jpg"
        });

        const res = await request(app)
            .post(`/api/v1/inventory/${sweet._id}/purchase`)
            .send({ quantity: 2 });

        expect(res.status).toBe(401);
    });

    it("validates purchase quantity", async () => {
        const cookie = await createAuthCookie("user");

        const sweet = await Sweet.create({
            name: "Barfi", category: "Classic", price: 10, quantity: 20, image: "img.jpg"
        });

        const res = await request(app)
            .post(`/api/v1/inventory/${sweet._id}/purchase`)
            .set("Cookie", cookie)
            .send({ quantity: 0 });

        expect(res.status).toBe(400);
    });

    it("returns 404 if sweet does not exist", async () => {
        const cookie = await createAuthCookie();

        const res = await request(app)
            .post("/api/v1/inventory/507f191e810c19729de860ea/purchase")
            .set("Cookie", cookie)
            .send({ quantity: 2 });

        expect(res.status).toBe(404);
    });

    it("fails purchase due to insufficient stock", async () => {
        const cookie = await createAuthCookie("user");

        const sweet = await Sweet.create({
            name: "Halwa", category: "Indian", price: 15, quantity: 3, image: "img.jpg"
        });

        const res = await request(app)
            .post(`/api/v1/inventory/${sweet._id}/purchase`)
            .set("Cookie", cookie)
            .send({ quantity: 5 });

        expect(res.status).toBe(400);
    });

    it("reduces stock on success", async () => {
        const cookie = await createAuthCookie("user");

        const sweet = await Sweet.create({
            name: "Peda", category: "Indian", price: 10, quantity: 10, image: "img.jpg"
        });

        const res = await request(app)
            .post(`/api/v1/inventory/${sweet._id}/purchase`)
            .set("Cookie", cookie)
            .send({ quantity: 4 });

        expect(res.status).toBe(200);
        expect(res.body.sweet.quantity).toBe(6);
    });

    it("returns 500 on DB error", async () => {
        const cookie = await createAuthCookie();

        jest.spyOn(Sweet, "findById").mockRejectedValue(new Error("DB fail"));

        const res = await request(app)
            .post("/api/v1/inventory/507f191e810c19729de860ea/purchase")
            .set("Cookie", cookie)
            .send({ quantity: 2 });

        expect(res.status).toBe(500);
    });

});


/* -------------------------------------------------------------
   RESTOCK SWEET (ADMIN ONLY)
-------------------------------------------------------------- */

describe("POST /api/v1/inventory/:id/restock", () => {

    it("blocks unauthenticated user", async () => {
        const sweet = await Sweet.create({
            name: "Gulab Jamun", category: "Indian", price: 10, quantity: 5, image: "img.jpg"
        });

        const res = await request(app)
            .post(`/api/v1/inventory/${sweet._id}/restock`)
            .send({ quantity: 5 });

        expect(res.status).toBe(401);
    });

    it("blocks non-admin user", async () => {
        const cookie = await createAuthCookie("user");

        const sweet = await Sweet.create({
            name: "Rasgulla", category: "Indian", price: 10, quantity: 10, image: "img.jpg"
        });

        const res = await request(app)
            .post(`/api/v1/inventory/${sweet._id}/restock`)
            .set("Cookie", cookie)
            .send({ quantity: 5 });

        expect(res.status).toBe(403);
    });

    it("validates restock quantity", async () => {
        const cookie = await createAuthCookie("admin");

        const sweet = await Sweet.create({
            name: "Kaju Katli", category: "Classic", price: 20, quantity: 10, image: "img.jpg"
        });

        const res = await request(app)
            .post(`/api/v1/inventory/${sweet._id}/restock`)
            .set("Cookie", cookie)
            .send({ quantity: 0 });

        expect(res.status).toBe(400);
    });

    it("returns 404 if sweet does not exist", async () => {
        const cookie = await createAuthCookie("admin");

        const res = await request(app)
            .post("/api/v1/inventory/507f191e810c19729de860ea/restock")
            .set("Cookie", cookie)
            .send({ quantity: 5 });

        expect(res.status).toBe(404);
    });

    it("increases stock on success", async () => {
        const cookie = await createAuthCookie("admin");

        const sweet = await Sweet.create({
            name: "Cham Cham", category: "Bengali", price: 12, quantity: 8, image: "img.jpg"
        });

        const res = await request(app)
            .post(`/api/v1/inventory/${sweet._id}/restock`)
            .set("Cookie", cookie)
            .send({ quantity: 7 });

        expect(res.status).toBe(200);
        expect(res.body.sweet.quantity).toBe(15);
    });

    it("returns 500 on DB error", async () => {
        const cookie = await createAuthCookie("admin");

        jest.spyOn(Sweet, "findById").mockRejectedValue(new Error("DB fail"));

        const res = await request(app)
            .post("/api/v1/inventory/507f191e810c19729de860ea/restock")
            .set("Cookie", cookie)
            .send({ quantity: 3 });

        expect(res.status).toBe(500);
    });

});
