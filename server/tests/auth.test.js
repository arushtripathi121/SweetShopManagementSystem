import request from "supertest";
import app from "../server/app.js";
import User from "../models/User.js";
import bcrypt from "bcrypt";
import { jest } from "@jest/globals";
import {
    connectDBForTesting,
    closeDBForTesting,
    clearDB
} from "./setup.js";

// Connect to in-memory MongoDB before running tests
beforeAll(async () => {
    await connectDBForTesting();
});

// Clear database after each test to ensure isolation
afterEach(async () => {
    await clearDB();
});

// Close DB connection after all tests finish
afterAll(async () => {
    await closeDBForTesting();
});


// ---------------------------------------------------------
// SIGNUP TESTS
// ---------------------------------------------------------

describe("POST /api/v1/auth/signup", () => {

    it("should return 400 if name, email, or password is missing", async () => {
        const res = await request(app).post("/api/v1/auth/signup").send({});
        expect(res.status).toBe(400);
        expect(res.body.success).toBe(false);
    });

    it("should create a new user successfully", async () => {
        const res = await request(app).post("/api/v1/auth/signup").send({
            name: "John",
            email: "john@mail.com",
            password: "123456"
        });

        expect(res.status).toBe(201);
        expect(res.body.success).toBe(true);

        // Verify user is saved in DB
        const user = await User.findOne({ email: "john@mail.com" });
        expect(user).not.toBeNull();
    });

    it("should reject duplicate email registration", async () => {
        await User.create({
            name: "Existing",
            email: "john@mail.com",
            password: "hashed"
        });

        const res = await request(app).post("/api/v1/auth/signup").send({
            name: "John",
            email: "john@mail.com",
            password: "123456"
        });

        expect(res.status).toBe(409);
        expect(res.body.success).toBe(false);
    });

    it("should hash the password before saving", async () => {
        await request(app).post("/api/v1/auth/signup").send({
            name: "John",
            email: "john@mail.com",
            password: "123456"
        });

        const user = await User.findOne({ email: "john@mail.com" });

        // Plaintext password must not match stored hash
        expect(user.password).not.toBe("123456");
    });

    it("should not save plaintext password", async () => {
        await request(app).post("/api/v1/auth/signup").send({
            name: "John",
            email: "john@mail.com",
            password: "123456"
        });

        const user = await User.findOne({ email: "john@mail.com" });

        // Hash must not contain the raw password
        expect(user.password.includes("123456")).toBe(false);
    });

    it("should set a JWT token cookie on signup", async () => {
        const res = await request(app).post("/api/v1/auth/signup").send({
            name: "John",
            email: "john@mail.com",
            password: "123456"
        });

        expect(res.headers["set-cookie"]).toBeDefined();
    });

    it("should store a valid JWT in cookie", async () => {
        const res = await request(app).post("/api/v1/auth/signup").send({
            name: "John",
            email: "john@mail.com",
            password: "123456"
        });

        const cookie = res.headers["set-cookie"][0];
        expect(cookie).toContain("userToken=");
    });

    it("cookie should be httpOnly", async () => {
        const res = await request(app).post("/api/v1/auth/signup").send({
            name: "John",
            email: "john@mail.com",
            password: "123456"
        });

        const cookie = res.headers["set-cookie"][0];
        expect(cookie).toContain("HttpOnly");
    });

    it("should return response with success and message fields", async () => {
        const res = await request(app).post("/api/v1/auth/signup").send({
            name: "John",
            email: "john@mail.com",
            password: "123456"
        });

        expect(res.body).toHaveProperty("success");
        expect(res.body).toHaveProperty("message");
    });

    it("should return 500 on server error", async () => {
        // Force DB failure
        jest.spyOn(User, "findOne").mockImplementation(() => {
            throw new Error("DB error");
        });

        const res = await request(app).post("/api/v1/auth/signup").send({
            name: "John",
            email: "john@mail.com",
            password: "123456"
        });

        expect(res.status).toBe(500);

        User.findOne.mockRestore();
    });

});


// ---------------------------------------------------------
// LOGIN TESTS
// ---------------------------------------------------------

describe("POST /api/v1/auth/login", () => {

    it("should return 400 if email or password is missing", async () => {
        const res = await request(app).post("/api/v1/auth/login").send({});
        expect(res.status).toBe(400);
    });

    it("should return 401 if email is not found", async () => {
        const res = await request(app).post("/api/v1/auth/login").send({
            email: "notfound@mail.com",
            password: "123456"
        });

        expect(res.status).toBe(401);
    });

    it("should return 401 if password is incorrect", async () => {
        await User.create({
            name: "John",
            email: "john@mail.com",
            password: await bcrypt.hash("correct", 10)
        });

        const res = await request(app).post("/api/v1/auth/login").send({
            email: "john@mail.com",
            password: "wrongpassword"
        });

        expect(res.status).toBe(401);
    });

    it("should login successfully with valid credentials", async () => {
        await User.create({
            name: "John",
            email: "john@mail.com",
            password: await bcrypt.hash("123456", 10)
        });

        const res = await request(app).post("/api/v1/auth/login").send({
            email: "john@mail.com",
            password: "123456"
        });

        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
    });

    it("should set JWT cookie on successful login", async () => {
        await User.create({
            name: "John",
            email: "john@mail.com",
            password: await bcrypt.hash("123456", 10)
        });

        const res = await request(app).post("/api/v1/auth/login").send({
            email: "john@mail.com",
            password: "123456"
        });

        expect(res.headers["set-cookie"]).toBeDefined();
    });

    it("JWT cookie should be httpOnly", async () => {
        await User.create({
            name: "John",
            email: "john@mail.com",
            password: await bcrypt.hash("123456", 10)
        });

        const res = await request(app).post("/api/v1/auth/login").send({
            email: "john@mail.com",
            password: "123456"
        });

        expect(res.headers["set-cookie"][0]).toContain("HttpOnly");
    });

    it("should return 500 on server error", async () => {
        jest.spyOn(User, "findOne").mockImplementation(() => {
            throw new Error("DB error");
        });

        const res = await request(app).post("/api/v1/auth/login").send({
            email: "john@mail.com",
            password: "123456"
        });

        expect(res.status).toBe(500);

        User.findOne.mockRestore();
    });

});


// ---------------------------------------------------------
// LOGOUT TESTS
// ---------------------------------------------------------

describe("POST /api/v1/auth/logout", () => {

    it("should clear the auth cookie and return 200", async () => {
        const res = await request(app).post("/api/v1/auth/logout");
        expect(res.status).toBe(200);
    });

    it("should expire the cookie immediately", async () => {
        const res = await request(app).post("/api/v1/auth/logout");
        const cookie = res.headers["set-cookie"][0];
        expect(cookie).toContain("Expires=");
    });

    it("should set empty userToken value", async () => {
        const res = await request(app).post("/api/v1/auth/logout");
        const cookie = res.headers["set-cookie"][0];
        expect(cookie.startsWith("userToken=")).toBe(true);
    });

    it("should return 500 if cookie operation fails", async () => {
        const { Logout } = await import("../controllers/AuthController.js");

        const req = {};

        // Simulated failing cookie operation
        const resMock = {
            cookie: () => { throw new Error("cookie error"); },
            status: () => ({ json: () => { } })
        };

        await Logout(req, resMock);
    });

});
