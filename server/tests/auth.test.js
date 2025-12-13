import request from "supertest";
import app from "../server/app.js";
import User from "../models/User.js";
import {
    connectDBForTesting,
    closeDBForTesting,
    clearDB
} from "./setup.js";

beforeAll(async () => {
    await connectDBForTesting();
});

afterEach(async () => {
    await clearDB();
});

afterAll(async () => {
    await closeDBForTesting();
});

describe("POST /api/v1/auth/signup", () => {

    it("should return 400 if required fields are missing", async () => {
        const res = await request(app).post("/api/v1/auth/signup").send({});
        expect(res.status).toBe(400);
    });

    it("should return 400 if name is empty or whitespace", async () => {
        const res = await request(app).post("/api/v1/auth/signup").send({
            name: "   ",
            email: "john@mail.com",
            password: "123456"
        });
        expect(res.status).toBe(400);
    });

    it("should return 400 for invalid email format", async () => {
        const res = await request(app).post("/api/v1/auth/signup").send({
            name: "John",
            email: "johnmail.com",
            password: "123456"
        });
        expect(res.status).toBe(400);
    });

    it("should return 400 for short passwords (<6 chars)", async () => {
        const res = await request(app).post("/api/v1/auth/signup").send({
            name: "John",
            email: "john@mail.com",
            password: "123"
        });
        expect(res.status).toBe(400);
    });

    it("should trim name and email before saving", async () => {
        const res = await request(app).post("/api/v1/auth/signup").send({
            name: "   John   ",
            email: "   john@mail.com   ",
            password: "123456"
        });

        const user = await User.findOne({ email: "john@mail.com" });
        expect(user.name).toBe("John");
    });

    it("should create a new user successfully", async () => {
        const res = await request(app).post("/api/v1/auth/signup").send({
            name: "John",
            email: "john@mail.com",
            password: "123456"
        });

        expect(res.status).toBe(201);
        expect(res.body.success).toBe(true);
    });

    it("should reject duplicate email registration", async () => {
        await User.create({
            name: "John",
            email: "john@mail.com",
            password: "hashed"
        });

        const res = await request(app).post("/api/v1/auth/signup").send({
            name: "John",
            email: "john@mail.com",
            password: "123456"
        });

        expect(res.status).toBe(409);
    });

    it("should hash password before saving", async () => {
        await request(app).post("/api/v1/auth/signup").send({
            name: "John",
            email: "john@mail.com",
            password: "123456"
        });

        const user = await User.findOne({ email: "john@mail.com" });
        expect(user.password).not.toBe("123456");
    });

    it("should not store plaintext password", async () => {
        await request(app).post("/api/v1/auth/signup").send({
            name: "John",
            email: "john@mail.com",
            password: "123456"
        });

        const user = await User.findOne({ email: "john@mail.com" });
        expect(user.password.includes("123456")).toBe(false);
    });

    it("should set user role to user by default", async () => {
        await request(app).post("/api/v1/auth/signup").send({
            name: "John",
            email: "john@mail.com",
            password: "123456"
        });

        const user = await User.findOne({ email: "john@mail.com" });
        expect(user.role).toBe("user");
    });

    it("should set cookie with JWT token", async () => {
        const res = await request(app).post("/api/v1/auth/signup").send({
            name: "John",
            email: "john@mail.com",
            password: "123456"
        });

        expect(res.headers["set-cookie"]).toBeDefined();
    });

    it("should create JWT containing id and email", async () => {
        const res = await request(app).post("/api/v1/auth/signup").send({
            name: "John",
            email: "john@mail.com",
            password: "123456"
        });

        const cookie = res.headers["set-cookie"][0];
        expect(cookie.includes("userToken=")).toBe(true);
    });

    it("cookie should be httpOnly", async () => {
        const res = await request(app).post("/api/v1/auth/signup").send({
            name: "John",
            email: "john@mail.com",
            password: "123456"
        });

        expect(res.headers["set-cookie"][0]).toContain("HttpOnly");
    });

    it("should return consistent response structure", async () => {
        const res = await request(app).post("/api/v1/auth/signup").send({
            name: "John",
            email: "john@mail.com",
            password: "123456"
        });

        expect(res.body).toHaveProperty("success");
        expect(res.body).toHaveProperty("message");
    });

});
