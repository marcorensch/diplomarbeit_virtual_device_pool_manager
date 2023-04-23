import supertest from "supertest";
import chai from "chai";
const { expect } = chai;
import {app} from "../server.mjs";

const agent = supertest.agent(app);

const adminCredentials = {
    username: "administrator",
    password: "test"
}

const userCredentials = {
    username: "test",
    password: "test"
}

describe("Test API Availability", () => {
    it("should return 200 for get on  /", async () => {
        const response = await agent.get("/");
        expect(response.status).to.equal(200, "Response status should be 200");
    });
});

describe("Test Authentication Routes", () => {
    it("should return 200 for /api/auth/login with correct credentials", async () => {
        const response = await agent.post("/api/auth/login").send(adminCredentials);
        expect(response.status).to.eql(200);
    });

    it("should return user data in body for /api/auth/login with correct credentials", async () => {
        const response = await agent.post("/api/auth/login").send(adminCredentials);
        expect(response.status).to.eql(200);
        expect(response.body).to.have.property("user");
    });

    it("should return permission data in body for /api/auth/login with correct credentials", async () => {
        const response = await agent.post("/api/auth/login").send(adminCredentials);
        expect(response.status).to.eql(200);
        expect(response.body).to.have.property("permissions");
    });

    it("should set cookies on /api/auth/login with correct credentials", async () => {
        const response = await agent.post("/api/auth/login").send(adminCredentials);
        expect(response.status).to.eql(200);
        expect('set-cookie' in response.header).to.equal(true);
    });

    it("should return 401 for /api/auth/login with wrong password", async () => {
        const wrongCredentials = {username: "administrator", password: "wrongPassword"};
        const response = await agent.post("/api/auth/login").send(wrongCredentials);
        expect(response.status).to.eql(401);
        expect(response.text).to.eql("Invalid Credentials");
    });

    it("should return 401 for /api/auth/login with non existing user", async () => {
        const wrongCredentials = {username: "admin", password: "test"};
        const response = await agent.post("/api/auth/login").send(wrongCredentials);
        expect(response.status).to.equal(401);
        expect(response.text).to.equal("Invalid Credentials");
    });

    it("should return 200 for /api/auth/logout", async () => {
        const response = await agent.get("/api/auth/logout");
        expect(response.status).to.equal(200);
        expect(response.text).to.equal("Logout successful");
        expect('set-cookie' in response.header).to.equal(true);
    });

});

describe("Test Administrative Account Routes", () => {
    const newUsrAcc = {firstname: "test", lastname: "test", username: "test", password: "test", email:"", notes:"", hidden:"", role_id: 2};
    it("should return 401 and text Missing token for get on /api/admin/accounts when not logged in", async () => {
        const response = await agent.get("/api/admin/accounts");
        expect(response.status).to.eql(401);
        expect(response.text).to.eql("Missing token");

    });
    it("should return 200 for /api/admin/accounts when logged in with ADMIN role", async () => {
        await agent.post("/api/auth/login").send(adminCredentials);
        const response = await agent.get("/api/admin/accounts");
        expect(response.status).to.eql(200);
    });
    it("should return 201 for post on /api/admin/accounts when creating new account with ADMIN role", async () => {
        await agent.post("/api/auth/login").send(adminCredentials);
        const response = await agent.post("/api/admin/accounts").send(newUsrAcc);
        expect(response.status).to.eql(201);
    });
    it("should return 409 for post on /api/users when creating new account with existing username", async () => {
        await agent.post("/api/auth/login").send(adminCredentials);
        const response = await agent.post("/api/admin/accounts").send(newUsrAcc);
        expect(response.status).to.eql(409);
    });

    it("should return 200 when deleting existing user", async () => {
        await agent.post("/api/auth/login").send(adminCredentials);
        const data = await agent.get("/api/admin/accounts");
        const testUsr = data.body.users.find((usr) => usr.username === "test");
        const response = await agent.delete("/api/admin/accounts/" + testUsr.id);
        expect(response.status).to.equal(200);
    });

    it("should return 404 when deleting not existing user by id", async () => {
        await agent.post("/api/auth/login").send(adminCredentials);
        const response = await agent.delete("/api/admin/accounts/999999999999999");
        expect(response.status).to.equal(404);
    });
    it("should return 401 on /api/admin/accounts when logged in with USER role", async () => {
        const data = {username: "test", password: "test"};
        await agent.get("/api/auth/logout");
        await agent.post("/api/auth/login").send(data);
        const response = await agent.get("/api/admin/accounts");
        expect(response.status).to.eql(401);
    });
    it("should return 400 on /api/admin/accounts when logged in and trying to delete own account", async () => {
        await agent.get("/api/auth/logout");
        await agent.post("/api/auth/login").send(adminCredentials);
        const response = await agent.delete("/api/admin/accounts/1");
        expect(response.status).to.eql(403);
        expect(response.text).to.eql("You cannot delete your own account here");
    });
});