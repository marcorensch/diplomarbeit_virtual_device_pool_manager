import {expect} from "chai";
import request from "supertest";
import {app} from "../server.mjs";

const agent = request.agent(app);
const username = "administrator";
const password = "test";

describe("Test API Availability", () => {
    it("should return 200 for /", async () => {
        const response = await agent.get("/");
        expect(response.status).to.equal(200);
    });
    it("should return 401 for /api/users", async () => {
        const response = await agent.get("/api/users");
        expect(response.status).to.equal(401);
    });
    it("should return 401 for post on /api/users", async () => {
        const data = {firstname: "test", lastname: "test", username: "test", password: "test", role_id: 1};
        const response = await agent.post("/api/users", data);
        expect(response.status).to.equal(401);
    });
    it("should return 401 for delete on /api/users", async () => {
        const response = await agent.delete("/api/users/100");
        expect(response.status).to.equal(401);
    });
    // it("should return 401 for put on /api/users", async () => {
    //     const data = {firstname: "test", lastname: "test", username: "test", password: "test", role_id: 1};
    //     const response = await supertest(app).put("/api/users/100", data);
    //     expect(response.status).to.equal(401);
    // });
});

describe("Test Authentication Routes", () => {
    it("should return 200 for /api/auth/login with correct credentials", async () => {
        const data = {username, password};
        const response = await agent.post("/api/auth/login").send(data);
        expect(response.status).to.equal(200);
        expect(response.body).to.have.property("user");
        expect(response.body).to.have.property("permissions");
        expect('set-cookie' in response.header).to.equal(true);
    });

    it("should return user data in body for /api/auth/login with correct credentials", async () => {
        const data = {username, password};
        const response = await agent.post("/api/auth/login").send(data);
        expect(response.status).to.equal(200);
        expect(response.body).to.have.property("user");
    });

    it("should return permission data in body for /api/auth/login with correct credentials", async () => {
        const data = {username, password};
        const response = await agent.post("/api/auth/login").send(data);
        expect(response.status).to.equal(200);
        expect(response.body).to.have.property("permissions");
    });

    it("should set cookies on /api/auth/login with correct credentials", async () => {
        const data = {username, password};
        const response = await agent.post("/api/auth/login").send(data);
        expect(response.status).to.equal(200);
        expect('set-cookie' in response.header).to.equal(true);
    });

    it("should return 401 for /api/auth/login with wrong password", async () => {
        const data = {username: "administrator", password: "wrongPassword"};
        const response = await agent.post("/api/auth/login").send(data);
        expect(response.status).to.equal(401);
        expect(response.text).to.equal("Invalid Credentials");
    });

    it("should return 401 for /api/auth/login with non existing user", async () => {
        const data = {username: "admin", password: "test"};
        const response = await agent.post("/api/auth/login").send(data);
        expect(response.status).to.equal(401);
        expect(response.text).to.equal("Invalid Credentials");
    });

    it("should return 200 for /api/auth/logout", async () => {
        const response = await agent.post("/api/auth/logout");
        expect(response.status).to.equal(200);
        expect(response.text).to.equal("Logout successful");
        expect('set-cookie' in response.header).to.equal(true);
    });

});

describe("Test Secured Routes", () => {
    const userAccount = {firstname: "test", lastname: "test", username: "test", password: "test", email:"", notes:"", hidden:"", role_id: 2};
    it("should return 201 for post on /api/users when adding new account", async () => {
        const data = userAccount;
        await agent.post("/api/auth/login").send({username, password});
        const response = await agent.post("/api/users").send(data);
        console.log(response.body);
        expect(response.status).to.equal(201);
    });
    it("should return 200 for /api/users when logged in with ADMIN role", async () => {
        const data = {username: "administrator", password: "test"};
        await agent.post("/api/auth/login").send(data);
        const response = await agent.get("/api/users");
        expect(response.status).to.equal(200);
    });
    it("should return 403 for /api/users when logged in with USER role", async () => {
        const data = {username: "test", password: "test"};
        await agent.post("/api/auth/login").send(data);
        const response = await agent.get("/api/users");
        expect(response.status).to.equal(403);
    });
});