import supertest from "supertest";
import chai from "chai";
const { expect } = chai;
import {app} from "../server.mjs";

const adminCredentials = {
    username: "administrator",
    password: "test"
}

describe("Test API Availability", () => {
    const agent = supertest.agent(app);
    it("should return 200 for get on  /", async () => {
        const response = await agent.get("/");
        expect(response.status).to.equal(200, response.text);
    });
});

describe("Test Login Route", () => {
    const agent = supertest.agent(app);
    it("should return 200 for get on /api/auth/login", async () => {
        const response = await agent.post("/api/auth/login").send(adminCredentials);
        expect(response.status).to.eql(200, response.text);
    });
});

describe("Test Logout Route", () => {
    const agent = supertest.agent(app);
    it("should return 200 for get on /api/auth/logout", async () => {
        await agent.post("/api/auth/login").send(adminCredentials);
        const response = await agent.get("/api/auth/logout");
        expect(response.status).to.eql(200, response.text);
    });
});

describe("Test Authentication Routes", () => {
    const agent = supertest.agent(app);
    afterEach(async () => {
        await agent.get("/api/auth/logout");
    });
    it("should return 200 for /api/auth/login with correct credentials", async () => {
        const response = await agent.post("/api/auth/login").send(adminCredentials);
        expect(response.status).to.eql(200, response.text);
    });

    it("should return user data in body for /api/auth/login with correct credentials", async () => {
        const response = await agent.post("/api/auth/login").send(adminCredentials);
        expect(response.status).to.eql(200, response.text);
        expect(response.body).to.have.property("user");
    });

    it("should return user data in body without password on login /api/auth/login", async () => {
        const response = await agent.post("/api/auth/login").send(adminCredentials);
        expect(response.status).to.eql(200, response.text);
        expect(response.body).to.have.property("user");
        expect(response.body.user).to.not.have.property("password");
    });

    it("should return permission data in body for /api/auth/login with correct credentials", async () => {
        const response = await agent.post("/api/auth/login").send(adminCredentials);
        expect(response.status).to.eql(200, response.text);
        expect(response.body).to.have.property("permissions");
    });

    it("should set cookies on /api/auth/login with correct credentials", async () => {
        const response = await agent.post("/api/auth/login").send(adminCredentials);
        expect(response.status).to.eql(200, response.text);
        expect('set-cookie' in response.header).to.equal(true, "Response Header has no set-cookie property");
    });

    it("should return 401 for /api/auth/login with wrong password", async () => {
        const wrongCredentials = {username: "administrator", password: "wrongPassword"};
        const response = await agent.post("/api/auth/login").send(wrongCredentials);
        expect(response.status).to.eql(401, response.text);
        expect(response.text).to.eql("Invalid Credentials", "Response Text is not 'Invalid Credentials'");
    });

    it("should return 401 for /api/auth/login with non existing user", async () => {
        const wrongCredentials = {username: "admin", password: "test"};
        const response = await agent.post("/api/auth/login").send(wrongCredentials);
        expect(response.status).to.equal(401, response.text);
        expect(response.text).to.equal("Invalid Credentials", "Response Text is not 'Invalid Credentials'");
    });

});

describe("Test Administrative Account Routes", () => {
    const newUsrAcc = {firstname: "test", lastname: "test", username: "test", password: "test", email:"", notes:"", hidden:"", role_id: 2};
    const agent = supertest.agent(app);
    it("should return 401 and text Missing token for get on /api/admin/accounts when not logged in", async () => {
        await agent.get("/api/auth/logout");
        const response = await agent.get("/api/admin/accounts");
        expect(response.status).to.eql(401, response.text);
        expect(response.text).to.eql("Missing tokens");

    });
    it("should return 200 for /api/admin/accounts when logged in with ADMIN role", async () => {
        await agent.get("/api/auth/logout");
        await agent.post("/api/auth/login").send(adminCredentials);
        const response = await agent.get("/api/admin/accounts");
        expect(response.status).to.eql(200, response.text);
    });
    it("should return 201 for post on /api/admin/accounts when creating new account with ADMIN role", async () => {
        await agent.get("/api/auth/logout");
        await agent.post("/api/auth/login").send(adminCredentials);
        const response = await agent.post("/api/admin/accounts").send(newUsrAcc);
        expect(response.status).to.eql(201, response.text);
    });
    it("should return 409 with message 'Username already in use' for post on /api/admin/accounts with existing username", async () => {
        await agent.get("/api/auth/logout");
        await agent.post("/api/auth/login").send(adminCredentials);
        const response = await agent.post("/api/admin/accounts").send(newUsrAcc);
        expect(response.status).to.eql(409, response.text);
        expect(response.text).to.eql("Username already in use");
    });

    it("should return 400 with message 'Username does not meet the requirements' when trying to set invalid username only containing spaces", async () => {
        await agent.get("/api/auth/logout");
        await agent.post("/api/auth/login").send(adminCredentials);
        const data = await agent.get("/api/admin/accounts");
        const testUsr = data.body.users.find((usr) => usr.username === "test");
        const response = await agent.put("/api/admin/accounts/" + testUsr.id).send({username: "      ", role_id: 2});
        expect(response.status).to.eql(400, response.text);
        expect(response.text).to.eql("Username does not meet the requirements");
    });
    it("should return 400 with message 'Username does not meet the requirements' when trying to set invalid username containing spaces", async () => {
        await agent.get("/api/auth/logout");
        await agent.post("/api/auth/login").send(adminCredentials);
        const data = await agent.get("/api/admin/accounts");
        const testUsr = data.body.users.find((usr) => usr.username === "test");
        const response = await agent.put("/api/admin/accounts/" + testUsr.id).send({username: " fooBiba  ", role_id: 2});
        expect(response.status).to.eql(400, response.text);
        expect(response.text).to.eql("Username does not meet the requirements");
    });

    it("should return 400 with message 'Username does not meet the requirements' when trying to set invalid username with three characters", async () => {
        await agent.get("/api/auth/logout");
        await agent.post("/api/auth/login").send(adminCredentials);
        const data = await agent.get("/api/admin/accounts");
        const testUsr = data.body.users.find((usr) => usr.username === "test");
        const response = await agent.put("/api/admin/accounts/" + testUsr.id).send({username: "dfu", role_id: 3});
        expect(response.status).to.eql(400, response.text);
        expect(response.text).to.eql("Username does not meet the requirements");
    });

    it("should return 403 when get on /api/admin/accounts when logged in with USER role", async () => {
        await agent.get("/api/auth/logout");
        const data = {username: "test", password: "test"};
        await agent.post("/api/auth/login").send(data);
        const response = await agent.get("/api/admin/accounts");
        expect(response.status).to.eql(403, response.text);
    })

    it("should return 200 when deleting existing user", async () => {
        await agent.get("/api/auth/logout");
        await agent.post("/api/auth/login").send(adminCredentials);
        const data = await agent.get("/api/admin/accounts");
        const testUsr = data.body.users.find((usr) => usr.username === "test");
        const response = await agent.delete("/api/admin/accounts/" + testUsr.id);
        expect(response.status).to.eql(200, response.text);
    });

    it("should return 404 when deleting not existing user by id", async () => {
        await agent.get("/api/auth/logout");
        await agent.post("/api/auth/login").send(adminCredentials);
        const response = await agent.delete("/api/admin/accounts/999999999999999");
        expect(response.status).to.eql(404, response.text);
    });

    it("should return 405 on /api/admin/accounts when logged in and trying to delete own account", async () => {
        await agent.get("/api/auth/logout");
        const auth = await agent.post("/api/auth/login").send(adminCredentials);
        const response = await agent.delete(`/api/admin/accounts/${auth.body.user.id}`);
        expect(response.status).to.eql(405, response.text);
        expect(response.text).to.eql("You cannot delete your own account here");
    });
});

describe("Test User available Account Routes", () => {
    const agent = supertest.agent(app);
    const newUsrAcc = {firstname: "", lastname: "", username: "accountTestsUser", password: "accountTestsUser", email:"", notes:"", hidden:"", role_id: 3};
    const secondUsrAcc = {firstname: "", lastname: "", username: "existingUserName", password: "accountTestsUser", email:"", notes:"", hidden:"", role_id: 3};
    const accountTestsUserAcc = {
        username: "accountTestsUser",
        password: "accountTestsUser",
    }
    const secondUsrAccCredentials = {
        username: "existingUserName",
        password: "accountTestsUser",
    }
    before(async () => {
        await agent.get("/api/auth/logout");
        await agent.post("/api/auth/login").send(adminCredentials);
        await agent.post("/api/admin/accounts").send(newUsrAcc);
        await agent.post("/api/admin/accounts").send(secondUsrAcc);
        await agent.get("/api/auth/logout");
    });
    after(async () => {
        await agent.get("/api/auth/logout");
        await agent.post("/api/auth/login").send(adminCredentials);
        const data = await agent.get("/api/admin/accounts");
        const testUsr = data.body.users.find((usr) => usr.username === "accountTestsUser");
        const testUsr2 = data.body.users.find((usr) => usr.username === "existingUserName");
        await agent.delete("/api/admin/accounts/" + testUsr.id);
        await agent.delete("/api/admin/accounts/" + testUsr2.id);
        await agent.get("/api/auth/logout");
    });

    describe("updating own account",  () => {
        beforeEach(async () => {
            await agent.get("/api/auth/logout");
        });
        it("should return 200 when updating firstname", async () => {
            const login = await agent.post("/api/auth/login").send(accountTestsUserAcc);
            const response = await agent.put(`/api/accounts/${login.body.user.id}`).send({firstname: "test"});
            expect(response.status).to.eql(200, response.text);
        });
        it("should return 200 when updating lastname", async () => {
            const login = await agent.post("/api/auth/login").send(accountTestsUserAcc);
            const response = await agent.put(`/api/accounts/${login.body.user.id}`).send({lastname: "test"});
            expect(response.status).to.eql(200, response.text);
        });
        it("should return 200 when updating email", async () => {
            const login = await agent.post("/api/auth/login").send(accountTestsUserAcc);
            const response = await agent.put(`/api/accounts/${login.body.user.id}`).send({email: "my@address.tld"});
            expect(response.status).to.eql(200, response.text);
        });
        it("should return 200 when updating email, firstname, lastname", async () => {
            const login = await agent.post("/api/auth/login").send(accountTestsUserAcc);
            const response = await agent.put(`/api/accounts/${login.body.user.id}`).send({lastname: "newLastname", firstname: "newFirstname", email: "my@address.tld"});
            expect(response.status).to.eql(200, response.text);
        });
        it("should return 200 when updating username (that is not already in use)", async () => {
            const login = await agent.post("/api/auth/login").send(accountTestsUserAcc);
            const response = await agent.put(`/api/accounts/${login.body.user.id}`).send({username: "newTestUsername"});
            const switchBack = await agent.put(`/api/accounts/${login.body.user.id}`).send({username: "accountTestsUser"});
            expect(response.status).to.eql(200, response.text);
            expect(switchBack.status).to.eql(200, switchBack.text);
        });
        it("should return 200 when updating password", async () => {
            const login = await agent.post("/api/auth/login").send(accountTestsUserAcc);
            const response = await agent.put(`/api/accounts/${login.body.user.id}`).send({password: "myNewPassword"});
            const switchBack = await agent.put(`/api/accounts/${login.body.user.id}`).send({password: "accountTestsUser"});
            expect(response.status).to.eql(200, response.text);
            expect(switchBack.status).to.eql(200, switchBack.text);
        });
        it("should return 400 when trying to delete last admin account", async () => {
            const login = await agent.post("/api/auth/login").send(adminCredentials);
            const response = await agent.delete(`/api/accounts/${login.body.user.id}`);
            expect(response.status).to.eql(409, response.text);
            expect(response.text).to.eql("You can not delete last Administrator account");
        });
    });

    describe("user account changes got stored in database",  () => {
        beforeEach(async () => {
            await agent.get("/api/auth/logout");
        });
        it('should have new firstname stored in database after change', async () => {
            const login = await agent.post("/api/auth/login").send(accountTestsUserAcc);
            await agent.put(`/api/accounts/${login.body.user.id}`).send({firstname: "test"});
            await agent.get("/api/auth/logout");
            const login2 = await agent.post("/api/auth/login").send(accountTestsUserAcc);
            expect(login2.body.user.firstname).to.eql("test", login2.body.user.firstname);
        });
        it('should have new firstname, lastname, email stored in database after change', async () => {
            const login = await agent.post("/api/auth/login").send(accountTestsUserAcc);
            await agent.put(`/api/accounts/${login.body.user.id}`).send({firstname: "testAgain", lastname: "testAgain", email: "foo@bar.tld"});
            await agent.get("/api/auth/logout");
            const login2 = await agent.post("/api/auth/login").send(accountTestsUserAcc);
            expect(login2.body.user.firstname).to.eql("testAgain", login2.body.user.firstname);
            expect(login2.body.user.lastname).to.eql("testAgain", login2.body.user.lastname);
            expect(login2.body.user.email).to.eql("foo@bar.tld", login2.body.user.email);
        });
    });
    describe("block changes for other accounts",  () => {
        it("should return 403 when trying to updating firstname of other account with message", async () => {
            const firstUserLogin = await agent.post("/api/auth/login").send(accountTestsUserAcc);
            await agent.get("/api/auth/logout");
            await agent.post("/api/auth/login").send(secondUsrAccCredentials);
            const response = await agent.put(`/api/accounts/${firstUserLogin.body.user.id}`).send({firstname: "test"});
            expect(response.status).to.eql(403, response.text);
            expect(response.text).to.eql("You are not allowed to update this account");
        });
        it("should return 403 when trying to updating firstname of other account as administrator with message", async () => {
            const firstUserLogin = await agent.post("/api/auth/login").send(accountTestsUserAcc);
            await agent.get("/api/auth/logout");
            await agent.post("/api/auth/login").send(adminCredentials);
            const response = await agent.put(`/api/accounts/${firstUserLogin.body.user.id}`).send({firstname: "test"});
            expect(response.status).to.eql(403, response.text);
            expect(response.text).to.eql("You are not allowed to update this account");
        });
        it("should return 403 when trying to updating firstname of non existing account with message", async () => {
            await agent.post("/api/auth/login").send(accountTestsUserAcc);
            const response = await agent.put(`/api/accounts/999999999`).send({firstname: "test"});
            expect(response.status).to.eql(403, response.text);
            expect(response.text).to.eql("You are not allowed to update this account");
        });
    });
    describe("updating own account with invalid data",  () => {
        it("should return 400 when updating username with empty string", async () => {
            const login = await agent.post("/api/auth/login").send(accountTestsUserAcc);
            const response = await agent.put(`/api/accounts/${login.body.user.id}`).send({username: ""});
            expect(response.status).to.eql(400, response.text);
            expect(response.text).to.eql("Username does not meet the requirements");
        });
        it("should return 400 when updating username with spaces only", async () => {
            const login = await agent.post("/api/auth/login").send(accountTestsUserAcc);
            const response = await agent.put(`/api/accounts/${login.body.user.id}`).send({username: "                "});
            expect(response.status).to.eql(400, response.text);
            expect(response.text).to.eql("Username does not meet the requirements");
        });
        it("should return 400 when updating username containing spaces", async () => {
            const login = await agent.post("/api/auth/login").send(accountTestsUserAcc);
            const response = await agent.put(`/api/accounts/${login.body.user.id}`).send({username: "      newTestUsername      "});
            expect(response.status).to.eql(400, response.text);
            expect(response.text).to.eql("Username does not meet the requirements");
        });
        it("should return 400 when updating username with less than 7 characters", async () => {
            const login = await agent.post("/api/auth/login").send(accountTestsUserAcc);
            const response = await agent.put(`/api/accounts/${login.body.user.id}`).send({username: "foo"});
            expect(response.status).to.eql(400, response.text);
            expect(response.text).to.eql("Username does not meet the requirements");
        });
        it("should return 400 when updating password with spaces only", async () => {
            const login = await agent.post("/api/auth/login").send(accountTestsUserAcc);
            const response = await agent.put(`/api/accounts/${login.body.user.id}`).send({password: "                "});
            expect(response.status).to.eql(400, response.text);
            expect(response.text).to.eql("Password does not meet the requirements");
        });
        it("should return 400 when updating password containing spaces", async () => {
            const login = await agent.post("/api/auth/login").send(accountTestsUserAcc);
            const response = await agent.put(`/api/accounts/${login.body.user.id}`).send({password: "      newTestUsersPWD      "});
            expect(response.status).to.eql(400, response.text);
            expect(response.text).to.eql("Password does not meet the requirements");
        });
        it("should return 400 when updating password with less than 8 characters", async () => {
            const login = await agent.post("/api/auth/login").send(accountTestsUserAcc);
            const response = await agent.put(`/api/accounts/${login.body.user.id}`).send({password: "foo"});
            expect(response.status).to.eql(400, response.text);
            expect(response.text).to.eql("Password does not meet the requirements");
        });
    });
});