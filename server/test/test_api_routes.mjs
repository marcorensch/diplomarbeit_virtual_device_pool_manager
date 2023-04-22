import {expect} from "chai";
import request from "supertest";
import {app} from "../server.mjs";

const agent = request.agent(app);

const adminCredentials = {
    username: "administrator",
    password: "test"
}

describe("Test API Availability", () => {
    it("should return 200 for /", async () => {
        const response = await agent.get("/");
        expect(response.status).to.equal(200);
    });
    it("should return 401 for /api/admin/accounts", async () => {
        const response = await agent.get("/api/admin/accounts");
        expect(response.status).to.equal(401);
    });
    it("should return 401 for post on /api/admin/accounts", async () => {
        const data = {firstname: "test", lastname: "test", username: "test", password: "test", role_id: 1};
        const response = await agent.post("/api/admin/accounts", data);
        expect(response.status).to.equal(401);
    });
    it("should return 401 for delete on /api/admin/accounts", async () => {
        const response = await agent.delete("/api/admin/accounts/100");
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
        const response = await agent.post("/api/auth/login").send(adminCredentials);
        expect(response.status).to.equal(200);
        expect(response.body).to.have.property("user");
        expect(response.body).to.have.property("permissions");
        expect('set-cookie' in response.header).to.equal(true);
    });

    it("should return user data in body for /api/auth/login with correct credentials", async () => {
        const response = await agent.post("/api/auth/login").send(adminCredentials);
        expect(response.status).to.equal(200);
        expect(response.body).to.have.property("user");
    });

    it("should return permission data in body for /api/auth/login with correct credentials", async () => {
        const response = await agent.post("/api/auth/login").send(adminCredentials);
        expect(response.status).to.equal(200);
        expect(response.body).to.have.property("permissions");
    });

    it("should set cookies on /api/auth/login with correct credentials", async () => {
        const response = await agent.post("/api/auth/login").send(adminCredentials);
        expect(response.status).to.equal(200);
        expect('set-cookie' in response.header).to.equal(true);
    });

    it("should return 401 for /api/auth/login with wrong password", async () => {
        const wrongCredentials = {username: "administrator", password: "wrongPassword"};
        const response = await agent.post("/api/auth/login").send(wrongCredentials);
        expect(response.status).to.equal(401);
        expect(response.text).to.equal("Invalid Credentials");
    });

    it("should return 401 for /api/auth/login with non existing user", async () => {
        const wrongCredentials = {username: "admin", password: "test"};
        const response = await agent.post("/api/auth/login").send(wrongCredentials);
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

describe("Test Administrative Routes", () => {
    const newUsrAcc = {firstname: "test", lastname: "test", username: "test", password: "test", email:"", notes:"", hidden:"", role_id: 2};
    before(async () => {
        await agent.post("/api/auth/login").send(adminCredentials);
    });
    it("should return 200 for /api/users when logged in with ADMIN role", async () => {
        const response = await agent.get("/api/admin/accounts");
        expect(response.status).to.equal(200);
    });
    it("should return 201 for post on /api/admin/accounts when creating new account", async () => {
        const response = await agent.post("/api/admin/accounts").send(newUsrAcc);
        expect(response.status).to.equal(201);
    });
    it("should return 409 for post on /api/users when creating new account with existing username", async () => {
        const response = await agent.post("/api/admin/accounts").send(newUsrAcc);
        expect(response.status).to.equal(409);
    });

    it("should return 200 when deleting existing user", async () => {
        const data = await agent.get("/api/admin/accounts");
        const testUsr = data.body.users.find((usr) => usr.username === "test");
        const response = await agent.delete("/api/admin/accounts/" + testUsr.id);
        expect(response.status).to.equal(200);
    });

    it("should return 404 when deleting not existing user by id", async () => {
        const response = await agent.delete("/api/admin/accounts/999999999999999");
        expect(response.status).to.equal(404);
    });
    it("should return 401 on /api/admin/accounts when logged in with USER role", async () => {
        await agent.post("/api/auth/logout");
        const data = {username: "test", password: "test"};
        await agent.post("/api/auth/login").send(data);
        const response = await agent.get("/api/admin/accounts");
        expect(response.status).to.equal(401);
    });
});