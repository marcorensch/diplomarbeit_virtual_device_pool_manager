import * as assert from "assert";
import {expect} from "chai";
import supertest from "supertest";
import {app} from "../server.mjs";

describe("Test API Availability", () => {
    it("should return 200 for /", async () => {
        const response = await supertest(app).get("/");
        expect(response.status).to.equal(200);
    });
    it("should return 401 for /api/users", async () => {
        const response = await supertest(app).get("/api/users");
        expect(response.status).to.equal(401);
    });
    it("should return 401 for post on /api/users", async () => {
        const data = {firstname: "test", lastname: "test", username: "test", password: "test", role_id: 1};
        const response = await supertest(app).post("/api/users", data);
        expect(response.status).to.equal(401);
    });
    it("should return 401 for delete on /api/users", async () => {
        const response = await supertest(app).delete("/api/users/100");
        expect(response.status).to.equal(401);
    });
    it("should return 401 for put on /api/users", async () => {
        const data = {firstname: "test", lastname: "test", username: "test", password: "test", role_id: 1};
        const response = await supertest(app).put("/api/users/100", data);
        expect(response.status).to.equal(401);
    });
});

describe("Test Authentication Routes", () => {
    it("should return 200 for /api/auth/login", async () => {
        const data = {username: "admin", password: "test"};
        const response = await supertest(app).post("/api/auth/login", data);
        expect(response.status).to.equal(200);
    });
    it("should return 200 for /api/auth/logout", async () => {
        const response = await supertest(app).get("/api/auth/logout");
        expect(response.status).to.equal(200);
    });
});