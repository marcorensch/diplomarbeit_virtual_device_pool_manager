import supertest from "supertest";
import chai from "chai";

const {expect} = chai;
import {app} from "../server.mjs";
import path from "path";
import {fileURLToPath} from "url";
import {describe} from "mocha";

import GuideMeItem from "../../client/src/models/GuideMeItem.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const adminCredentials = {
    username: "administrator",
    password: "test"
}

const guestCredentials = {
    username: "guest",
    password: "test"
}

const userCredentials = {
    username: "user",
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

    it("should return 200 for get on /api/auth/logout-everywhere", async () => {
        await agent.post("/api/auth/login").send(adminCredentials);
        const response = await agent.get("/api/auth/logout-everywhere");
        expect(response.status).to.eql(200, response.text);
    });

    it("should return 401 on agent2 / agent3 after /api/auth/logout-everywhere is used on agent1", async () => {
        const agent1 = supertest.agent(app);
        const agent2 = supertest.agent(app);
        const agent3 = supertest.agent(app);

        await agent1.post("/api/auth/login").send(adminCredentials);
        await agent2.post("/api/auth/login").send(adminCredentials);
        await agent3.post("/api/auth/login").send(adminCredentials);

        const response = await agent1.get("/api/auth/logout-everywhere");
        expect(response.status).to.eql(200);

        const response2 = await agent2.get("/api/admin/msisdns");
        expect(response2.status).to.eql(401);

        const response3 = await agent3.get("/api/admin/msisdns");
        expect(response3.status).to.eql(401);

        const response4 = await agent1.get("/api/admin/msisdns");
        expect(response4.status).to.eql(401);

    });
});

describe("Test Authentication Endpoints", () => {
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

    it("should return permission data in user object for /api/auth/login with correct credentials", async () => {
        const response = await agent.post("/api/auth/login").send(adminCredentials);
        expect(response.status).to.eql(200, response.text);
        expect(response.body.user).to.have.property("permissions");
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

describe("Test administrative Account Endpoints", () => {
    const newUsrAcc = {
        firstname: "test",
        lastname: "test",
        username: "test",
        password: "test",
        email: "",
        notes: "",
        hidden: "",
        role_id: 2
    };
    const agent = supertest.agent(app);
    it("should return 401 and text Missing token for get on /api/admin/accounts when not logged in", async () => {
        await agent.get("/api/auth/logout");
        const response = await agent.get("/api/admin/accounts");
        expect(response.status).to.eql(401, response.text);
        expect(response.body).to.have.property("message");
        expect(response.body.message).to.eql("Unauthorized");

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
        const response = await agent.put("/api/admin/accounts/" + testUsr.id).send({
            username: " fooBiba  ",
            role_id: 2
        });
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
        expect(response.status).to.eql(403);
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

describe("Test User available Account Endpoints", () => {
    const agent = supertest.agent(app);
    const newUsrAcc = {
        firstname: "",
        lastname: "",
        username: "accountTestsUser",
        password: "accountTestsUser",
        email: "",
        notes: "",
        hidden: "",
        role_id: 3
    };
    const secondUsrAcc = {
        firstname: "",
        lastname: "",
        username: "existingUserName",
        password: "accountTestsUser",
        email: "",
        notes: "",
        hidden: "",
        role_id: 3
    };
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

    describe("updating own account", () => {
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
            const response = await agent.put(`/api/accounts/${login.body.user.id}`).send({
                lastname: "newLastname",
                firstname: "newFirstname",
                email: "my@address.tld"
            });
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

    describe("user account changes got stored in database", () => {
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
            await agent.put(`/api/accounts/${login.body.user.id}`).send({
                firstname: "testAgain",
                lastname: "testAgain",
                email: "foo@bar.tld"
            });
            await agent.get("/api/auth/logout");
            const login2 = await agent.post("/api/auth/login").send(accountTestsUserAcc);
            expect(login2.body.user.firstname).to.eql("testAgain", login2.body.user.firstname);
            expect(login2.body.user.lastname).to.eql("testAgain", login2.body.user.lastname);
            expect(login2.body.user.email).to.eql("foo@bar.tld", login2.body.user.email);
        });
    });
    describe("block changes for other accounts", () => {
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
    describe("updating own account with invalid data", () => {
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

describe("Test MSISDN Manager API Endpoints", () => {
    const agent = supertest.agent(app);
    const validData = {
        msisdn: "41790001122",
        sim_number: "89410112345678909876",
        sim_type_id: 1,
        abonnement: "Abonnement Name",
        scn: "1234567",
        notes: "Some notes",
        hidden: "Hidden notes"
    };
    let validMainId;
    let validSubId;

    before(async () => {
        await agent.post("/api/auth/login").send(adminCredentials);
    });

    after(async () => {
        await agent.get("/api/auth/logout");
    });

    it("should store new MSISDN in database", async () => {
        const response = await agent.post("/api/admin/msisdns").send(validData);
        expect(response.body).to.have.property("id");
        expect(response.body).to.have.property("message");
        expect(response.status).to.eql(201, response.text);
        validMainId = response.body.id;
    });

    it("should exactly return one MSISDN after storing it", async () => {
        const response = await agent.get("/api/admin/msisdns");
        expect(response.body).to.have.lengthOf(1);
        expect(response.status).to.eql(200, response.text);
    });

    it("should return 201 when creating new Sub MSISDN (Multi Device SIM) for existing MSISDN", async () => {
        const mdSim = validData;
        mdSim.msisdn = "41750001123";
        mdSim.parent_id = validMainId;
        delete mdSim.abonnement;
        delete mdSim.scn;
        const response = await agent.post("/api/admin/msisdns").send(mdSim);
        expect(response.body).to.have.property("id");
        expect(response.body).to.have.property("message");
        expect(response.status).to.eql(201, response.text);
        validSubId = response.body.id;
    });

    it("should return 400 when trying to store MSISDN with less than 11 characters", async () => {
        const invalidData = {...validData};
        invalidData.msisdn = "123456789";
        const response = await agent.post("/api/admin/msisdns").send(invalidData);
        expect(response.status).to.eql(400, response.text);
    });
    it("should return 400 when trying to store MSISDN with more than 11 characters", async () => {
        const invalidData = {...validData};
        invalidData.msisdn = "12345678901234567890123456";
        const response = await agent.post("/api/admin/msisdns").send(invalidData);
        expect(response.status).to.eql(400, response.text);
    });
    it("should return 400 when trying to store MSISDN with SIM number with more than 20 characters", async () => {
        const invalidData = {...validData};
        invalidData.sim_number = "8941010000";
        const response = await agent.post("/api/admin/msisdns").send(invalidData);
        expect(response.status).to.eql(400, response.text);
    });

    it("should return 400 when trying to store MSISDN with SIM number with less than 20 characters", async () => {
        const invalidData = {...validData};
        invalidData.sim_number = "89410112345678909876543234453221";
        const response = await agent.post("/api/admin/msisdns").send(invalidData);
        expect(response.status).to.eql(400, response.text);
    });

    it("should return 400 when trying to store MSISDN with SIM number in wrong format", async () => {
        const invalidData = {...validData};
        invalidData.sim_number = "8941011234567890987a";
        const response = await agent.post("/api/admin/msisdns").send(invalidData);
        expect(response.status).to.eql(400, response.text);
    });
    it("should return 400 when trying to store MSISDN with SIM number that does not start with '894101", async () => {
        const invalidData = {...validData};
        invalidData.sim_number = "89510112345678909870";
        const response = await agent.post("/api/admin/msisdns").send(invalidData);
        expect(response.status).to.eql(400, response.text);
    });

    it("should return 400 when updating MSISDN without complete set of data", async () => {
        const response = await agent.put(`/api/admin/msisdns/${validMainId}`).send({notes: "Updated notes"});
        expect(response.status).to.eql(400);
    });

    it("should return 200 when updating MSISDN with complete set of data", async () => {
        validData.notes = "Updated notes";
        const response = await agent.put(`/api/admin/msisdns/${validMainId}`).send(validData);
        expect(response.status).to.eql(200);
    });

    it("should return 200 when updating Sub MSISDN with complete set of data", async () => {
        validData.notes = "Updated notes in MD SIM";
        const response = await agent.put(`/api/admin/msisdns/${validSubId}`).send(validData);
        expect(response.status).to.eql(200);
    });

    it("should return 200 when deleting Main MSISDN and Multi Device SIM should be deleted aswell", async () => {
        const response = await agent.delete(`/api/admin/msisdns/${validMainId}`);
        expect(response.status).to.eql(200);
        const response2 = await agent.get(`/api/admin/msisdns/${validSubId}`);
        expect(response2.body).to.eql(null);
    });

});

describe("Test FileManager API Endpoints", () => {
    const agent = supertest.agent(app);
    afterEach(async () => {
        await agent.get("/api/auth/logout");
    });
    it("should return 400 when loading list of files without path", async () => {
        await agent.post("/api/auth/login").send(adminCredentials);
        const response = await agent.get("/api/filemanager");
        expect(response.status).to.eql(400);
    });
    it("should return 200 when loading list of files from logos path", async () => {
        await agent.post("/api/auth/login").send(adminCredentials);
        const response = await agent.get("/api/filemanager?path=logos");
        expect(response.status).to.eql(200);
    });
    it("should return stored files and folders when loading contents of logos path", async () => {
        await agent.post("/api/auth/login").send(adminCredentials);
        const response = await agent.get("/api/filemanager?path=logos");
        expect(response.body).to.have.property("folders");
        expect(response.body).to.have.property("files");
    });
    it("should return 400 when loading contents from outside of root path", async () => {
        await agent.post("/api/auth/login").send(adminCredentials);
        const response = await agent.get("/api/filemanager?path=../../../");
        expect(response.status).to.eql(400);
        expect(response.body).to.have.property("message");
        expect(response.body.message).to.eql("Invalid path");
    });
    it("should return 400 when loading contents from parent", async () => {
        await agent.post("/api/auth/login").send(adminCredentials);
        const response = await agent.get("/api/filemanager?path=logos/../");
        expect(response.status).to.eql(400);
    });
    it("should return 401 when trying access File Manager without being logged in", async () => {
        const response = await agent.get("/api/filemanager?path=logos");
        expect(response.status).to.eql(401);
    });
    it("should return 403 when trying access File Manager with wrong permissions", async () => {
        await agent.post("/api/auth/login").send({username: "guest", password: "test"});
        const response = await agent.get("/api/filemanager?path=logos");
        expect(response.status).to.eql(403);
    });
    it("should return 201 when uploading file to server", async () => {
        await agent.post("/api/auth/login").send(adminCredentials);
        const pathToLocalFile = path.join(__dirname, "nxd-logo.png");
        const response = await agent.post("/api/filemanager/upload?path=test").attach("file", pathToLocalFile);
        expect(response.status).to.eql(201);
    });
    it("should return 403 when trying to delete a file with guest permissions", async () => {
        const existingFileData = {name: "nxd-logo.png", relativePath: "test", fullPath: "test/nxd-logo.png"};
        await agent.post("/api/auth/login").send({username: "guest", password: "test"});
        const response = await agent.delete("/api/filemanager").send({files: [existingFileData]});
        expect(response.status).to.eql(403);
    });

    it("should return 403 when trying to delete a file with user permissions", async () => {
        const existingFileData = {name: "nxd-logo.png", relativePath: "test", fullPath: "test/nxd-logo.png"};
        await agent.post("/api/auth/login").send(userCredentials);
        const response = await agent.delete("/api/filemanager").send({files: [existingFileData]});
        expect(response.status).to.eql(403);
    });

    it("should return 403 when trying to rename file with guest permissions", async () => {
        await agent.post("/api/auth/login").send({username: "guest", password: "test"});
        const response = await agent.put("/api/filemanager/rename").send({
            oldName: "nxd-logo.png",
            newName: "nxd-logo2.png",
            parentDir: "test"
        });
        expect(response.status).to.eql(403);
    });

    it("should return 403 when trying to rename file with user permissions", async () => {
        await agent.post("/api/auth/login").send(userCredentials);
        const response = await agent.put("/api/filemanager/rename").send({
            oldName: "nxd-logo.png",
            newName: "nxd-logo2.png",
            parentDir: "test"
        });
        expect(response.status).to.eql(403);
    });

    it("should return 200 when trying to rename file with manager permissions", async () => {
        await agent.post("/api/auth/login").send({username: "manager", password: "test"});
        const response = await agent.put("/api/filemanager/rename").send({
            oldName: "nxd-logo.png",
            newName: "nxd-logo2.png",
            parentDir: "test"
        });
        expect(response.status).to.eql(200);
    });

    it("should return 404 when deleting file from server that does not exist", async () => {
        const nonExistingFileData = {name: "nxd-logo.png", relativePath: "test", fullPath: "test/thisisNotHere.png"};
        await agent.post("/api/auth/login").send(adminCredentials);
        const response = await agent.delete("/api/filemanager").send({files: [nonExistingFileData]});
        expect(response.status).to.eql(404);
    });

    it("should return 200 when deleting file from server", async () => {
        const existingFileData = {name: "nxd-logo.png", relativePath: "test", fullPath: "test/nxd-logo2.png"};
        await agent.post("/api/auth/login").send(adminCredentials);
        const response = await agent.delete("/api/filemanager").send({files: [existingFileData]});
        expect(response.status).to.eql(200);
    });
    it("should return 400 with correct message when uploading file to server without relativePath", async () => {
        await agent.post("/api/auth/login").send(adminCredentials);
        const pathToLocalFile = path.join(__dirname, "nxd-logo.png");
        const response = await agent.post("/api/filemanager/upload").attach("file", pathToLocalFile);

        expect(response.status).to.eql(400);
        expect(response.body).to.have.property("message");
        expect(response.body.message).to.eql("Path is required");
    });
    it("should return 400 with correct message when using upload route without file", async () => {
        await agent.post("/api/auth/login").send(adminCredentials);
        const response = await agent.post("/api/filemanager/upload?path=test");

        expect(response.status).to.eql(400);
        expect(response.body).to.have.property("message");
        expect(response.body.message).to.eql("No file was uploaded");
    });
    it("should return 400 with correct message when uploading file to server with invalid relativePath", async () => {
        await agent.post("/api/auth/login").send(adminCredentials);
        const pathToLocalFile = path.join(__dirname, "nxd-logo.png");
        const response = await agent.post("/api/filemanager/upload?path=test/../../").attach("file", pathToLocalFile);

        expect(response.status).to.eql(400);
        expect(response.body).to.have.property("message");
        expect(response.body.message).to.eql("Invalid path");
    });
    it("should return 403 with correct message when trying to create a folder with guest permissions", async () => {
        await agent.post("/api/auth/login").send({username: "guest", password: "test"});
        const response = await agent.post("/api/filemanager/folders").send({
            newFolderName: "subTest",
            parentFolder: "test"
        });
        expect(response.status).to.eql(403);
    });
    it("should return 201 with correct message when trying to create a folder with guest permissions", async () => {
        await agent.post("/api/auth/login").send(adminCredentials);
        const response = await agent.post("/api/filemanager/folders").send({
            newFolderName: "adminCreatedFolder",
            parentFolder: "test"
        });
        expect(response.status).to.eql(201);
    });
    it("should return 200 when trying to delete a folder with manager permissions", async () => {
        await agent.post("/api/auth/login").send({username: "manager", password: "test"});
        const response = await agent.delete("/api/filemanager").send({
            folders: [{
                name: "adminCreatedFolder",
                relativePath: "test",
                fullPath: "test/adminCreatedFolder"
            }]
        });
        expect(response.status).to.eql(200);
    });
    it("should return 403 when trying to delete a folder out of public scope by relative Path", async () => {
        await agent.post("/api/auth/login").send(adminCredentials);
        const response = await agent.delete("/api/filemanager").send({
            folders: [{
                name: "public",
                relativePath: "/../../../",
                fullPath: "server/public/../../../"
            }]
        });
        expect(response.status).to.eql(403);
    });
    it("should return 403 when trying to delete a folder out of public scope by full path", async () => {
        await agent.post("/api/auth/login").send(adminCredentials);
        const response = await agent.delete("/api/filemanager").send({
            folders: [{
                name: "public",
                relativePath: "test",
                fullPath: "/../../"
            }]
        });
        expect(response.status).to.eql(403);
    });
    after(async () => {
        await agent.post("/api/auth/login").send(adminCredentials);
        await agent.delete("/api/filemanager").send({
            folders: [{
                name: "test",
                relativePath: "test",
                fullPath: "test"
            }]
        });
    });
});

describe("Test administrative PoolBuilder API Endpoints", () => {
    const agent = supertest.agent(app);

    before(async () => {
        await agent.post("/api/auth/login").send(adminCredentials);
    });

    describe("Test Authorization", () => {
        beforeEach(async () => {
            await agent.get("/api/auth/logout");
        });
        after(async () => {
            await agent.post("/api/auth/login").send(adminCredentials);
        });
        it("should return 401 Unauthorized when trying to get all categories without authorization", async () => {
            const response = await agent.get("/api/admin/poolbuilder/categories");
            expect(response.status).to.eql(401);
        });
        it("should return 401 Unauthorized when trying to get all items without authorization", async () => {
            const response = await agent.get("/api/admin/poolbuilder/items");
            expect(response.status).to.eql(401);
        });
        it("should return 403 Unauthorized when trying to get all items with insufficient permissions", async () => {
            await agent.post("/api/auth/login").send({username: "user", password: "test"});
            const response = await agent.get("/api/admin/poolbuilder/items?category_id=1");
            agent.get("/api/auth/logout");

            expect(response.status).to.eql(403);
        });
    });
    describe("Test creation", () => {

        it("should return 400 with correct message when trying to create a location without name", async () => {
            const response = await agent.post("/api/admin/poolbuilder/items").send({
                name: "",
                description: "test",
                category_id: 1
            });
            expect(response.status).to.eql(400);
            expect(response.body).to.have.property("message");
            expect(response.body.message).to.eql("Name must be at least 1 character long");
        });

        it("should return 400 with correct message when trying to create a location with non existing category_id", async () => {
            const response = await agent.post("/api/admin/poolbuilder/items").send({
                name: "My Test Item",
                description: "test",
                category_id: 99
            });
            expect(response.status).to.eql(400);
            expect(response.body).to.have.property("message");
            expect(response.body.message).to.eql("Invalid category specified");
        });
    });

    describe("Test Successfully creation & deletion of Location item", () => {
        let createdItem;

        it("should return 201 and the created item when create a location", async () => {
            const response = await agent.post("/api/admin/poolbuilder/items").send({
                name: "test A",
                description: "test",
                category_id: 1
            });
            expect(response.status).to.eql(201);
            expect(response.body).to.have.property("id");
            expect(response.body).to.have.property("name");
            expect(response.body.name).to.eql("test A");
            createdItem = response.body;
        });
        it("should return 200 with correct message when deleting the before created item", async () => {
            const response = await agent.delete(`/api/admin/poolbuilder/items/${createdItem.id}`);
            expect(response.status).to.eql(200);
            expect(response.body).to.have.property("message");
            expect(response.body.message).to.eql("Item deleted successfully");
        });

    });

    describe("Test cascading deletion of Slot & Row linked to Location item", () => {
        let createdLocationItem, createdRowItem, createdSlotItem;
        before(async () => {
            const locationResponse = await agent.post("/api/admin/poolbuilder/items").send({
                name: "test B",
                description: "test",
                category_id: 1
            });
            createdLocationItem = locationResponse.body;
            const rowResponse = await agent.post(`/api/admin/poolbuilder/items/`).send({
                name: "test B ROW",
                description: "test b row",
                category_id: 2,
                parent_id: createdLocationItem.id
            });
            createdRowItem = rowResponse.body;
            const slotResponse = await agent.post(`/api/admin/poolbuilder/items/`).send({
                name: "test B SLOT",
                description: "test b slot",
                category_id: 3,
                parent_id: createdRowItem.id
            });
            createdSlotItem = slotResponse.body;
        });

        it("should return 404 with correct message when trying to get the row item that was linked to the before deleted location", async () => {
            await agent.delete(`/api/admin/poolbuilder/items/${createdLocationItem.id}`);
            const response = await agent.get(`/api/admin/poolbuilder/items/${createdRowItem.id}`);
            expect(response.status).to.eql(404);
            expect(response.body).to.have.property("message");
            expect(response.body.message).to.eql("Item not found");
        });

        it("should return 404 with correct message when trying to get the slot item that was linked to the before deleted row", async () => {
            const response = await agent.get(`/api/admin/poolbuilder/items/${createdSlotItem.id}`);
            expect(response.status).to.eql(404);
            expect(response.body).to.have.property("message");
            expect(response.body.message).to.eql("Item not found");
        });

    });

    describe("Test Sorting of Builder Items", () => {
        let createdLocationItems = [];
        before(async () => {
            await agent.post("/api/auth/login").send(adminCredentials);

            const locationResponse = await agent.post("/api/admin/poolbuilder/items").send({
                name: "test C",
                description: "test",
                category_id: 1
            });
            createdLocationItems.push(locationResponse.body);
            const locationResponse2 = await agent.post("/api/admin/poolbuilder/items").send({
                name: "test D",
                description: "test",
                category_id: 1
            });
            createdLocationItems.push(locationResponse2.body);
            const locationResponse3 = await agent.post("/api/admin/poolbuilder/items").send({
                name: "test E",
                description: "test",
                category_id: 1
            });
            createdLocationItems.push(locationResponse3.body);
        });

        it("all created locations should have a sorting value of 999", async () => {
            for (let location of createdLocationItems) {
                expect(location.sorting).to.eql(0);
            }
        });

        it("should return 200 when updating the sorting of items", async () => {
            createdLocationItems[0].sorting = 12;
            createdLocationItems[1].sorting = 5;
            createdLocationItems[2].sorting = 1;
            const sortingMap = createdLocationItems.map((item) => {
                return {id: item.id, sorting: item.sorting};
            });
            const response = await agent.post("/api/admin/poolbuilder/items/sort").send(sortingMap);
            expect(response.status).to.eql(200);
            expect(response.body).to.have.property("message");
            expect(response.body.message).to.eql("Items sorted successfully");
        });

        it("First item should have sorting value of 12", async () => {
            const response = await agent.get(`/api/admin/poolbuilder/items/${createdLocationItems[0].id}`);
            expect(response.status).to.eql(200);
            expect(response.body).to.have.property("sorting");
            expect(response.body.sorting).to.eql(12);
        });

        it("Second item should have sorting value of 5", async () => {
            const response = await agent.get(`/api/admin/poolbuilder/items/${createdLocationItems[1].id}`);
            expect(response.status).to.eql(200);
            expect(response.body).to.have.property("sorting");
            expect(response.body.sorting).to.eql(5);
        });

        it("Third item should have sorting value of 1", async () => {
            const response = await agent.get(`/api/admin/poolbuilder/items/${createdLocationItems[2].id}`);
            expect(response.status).to.eql(200);
            expect(response.body).to.have.property("sorting");
            expect(response.body.sorting).to.eql(1);
        });
    });

});

describe("Test Devices Route", () => {
    const agent = supertest.agent(app);
    let createdItem;
    let itemFromDb;
    before(async () => {
        await agent.post("/api/auth/login").send(adminCredentials);
    });

    it("should return 201 when creating a virtual device", async () => {
        const deviceData = {
            name: "test device",
            description: "test device",
            device_type_id: 1,
            added: new Date().toISOString(),
        }
        const response = await agent.post("/api/devices").send(deviceData);
        expect(response.status).to.eql(201);
        expect(response.body).to.have.property("id");
        createdItem = {id: response.body.id, ...deviceData};
    });

    it("should return 200 when getting the before created device", async () => {
        const response = await agent.get(`/api/devices/${createdItem.id}`);
        expect(response.status).to.eql(200);
        expect(response.body).to.have.property("id");
        expect(response.body.id).to.eql(createdItem.id);
        itemFromDb = response.body;
    });

    it("should return 200 when updating the before created device", async () => {
        const deviceData = {
            name: "test device updated",
            notes: "test device updated",
            device_type_id: 2,
            added: new Date().toISOString()
        }
        const newDataSet = {...itemFromDb, ...deviceData};
        const response = await agent.put(`/api/devices/${newDataSet.id}`).send(newDataSet);
        expect(response.status).to.eql(200);
        expect(response.body).to.have.property("id");
        expect(response.body.id).to.eql(createdItem.id);
        expect(response.body.name).to.eql(deviceData.name);
        expect(response.body.notes).to.eql(deviceData.notes);
        expect(response.body.device_type_id).to.eql(deviceData.device_type_id);
    });

    it("should return 200 with correct message when deleting the before created device", async () => {
        const response = await agent.delete(`/api/devices/${createdItem.id}`);
        expect(response.status).to.eql(200);
        expect(response.body).to.have.property("message");
        expect(response.body.message).to.eql("Device deleted");
    });

    it("should return 404 when trying to get not existing device", async () => {
        const response = await agent.get(`/api/devices/999999999999`);
        expect(response.status).to.eql(404);
    });

    it("should return 404 when trying to update not existing device", async () => {
        const deviceData = {
            name: "test device updated",
            notes: "test device updated",
            device_type_id: 2,
            added: new Date().toISOString()
        }
        const newDataSet = {...itemFromDb, ...deviceData};
        const response = await agent.put(`/api/devices/999999999`).send(newDataSet);
        expect(response.status).to.eql(404);
    });

    it("should return 404 when trying to delete not existing device", async () => {
        const response = await agent.delete(`/api/devices/999999999`);
        expect(response.status).to.eql(404);
    });

    it("should return 400 when trying to create a device with missing data", async () => {
        const deviceData = {
            name: "test device",
            description: "test device",
        }
        const response = await agent.post("/api/devices").send(deviceData);
        expect(response.status).to.eql(400);
    });

    it("should return 403 when trying to create a physical device with missing (user) permissions", async () => {
        const userTest = supertest.agent(app);
        await userTest.post("/api/auth/login").send(userCredentials);
        const deviceData = {
            name: "test device",
            description: "test device",
            device_type_id: 1,
            slot_id: 1,
            added: new Date().toISOString(),
        }
        const response = await userTest.post("/api/devices").send(deviceData);
        expect(response.status).to.eql(403);
    });

    it("should return 403 when trying to create a physical device with missing (guest) permissions", async () => {
        const userTest = supertest.agent(app);
        await userTest.post("/api/auth/login").send(guestCredentials);
        const deviceData = {
            name: "test device",
            description: "test device",
            device_type_id: 1,
            slot_id: 1,
            added: new Date().toISOString(),
        }
        const response = await userTest.post("/api/devices").send(deviceData);
        expect(response.status).to.eql(403);
    });

    it("should return 403 when trying to create a virtual device with missing (guest) permissions", async () => {
        const userTest = supertest.agent(app);
        await userTest.post("/api/auth/login").send(guestCredentials);
        const deviceData = {
            name: "test device",
            description: "test device",
            device_type_id: 1,
            added: new Date().toISOString(),
        }
        const response = await userTest.post("/api/devices").send(deviceData);
        expect(response.status).to.eql(403);
    });

});
describe("Test Weblinks Route", () => {
    const agent = supertest.agent(app);
    let createdItem;
    before(async () => {
        await agent.post("/api/auth/login").send(adminCredentials);
        const deviceData = {
            name: "test device",
            notes: "test device",
            device_type_id: 1,
            added: new Date().toISOString(),
        }
        const response = await agent.post("/api/devices").send(deviceData);
        createdItem = {id: response.body.id, ...deviceData};
    });
    it("should return 201 when creating a weblink for an existing device", async () => {
        const weblinkData = {
            name: "test weblink for existing device",
            description: "test weblink",
            uri: "https://example.com"
        }
        const response = await agent.post(`/api/devices/${createdItem.id}/weblinks`).send(weblinkData);
        expect(response.status).to.eql(201);
        expect(response.body).to.have.property("id");
    });

    it("should return 404 when creating a weblink for a non existing device", async () => {
        const weblinkData = {
            name: "test weblink for non existing device",
            description: "test weblink",
            uri: "https://example.com"
        }
        const response = await agent.post(`/api/devices/999999/weblinks`).send(weblinkData);
        expect(response.status).to.eql(404);
        expect(response.body).to.have.property("message");
        expect(response.body.message).to.eql("Device not found");
    });

    it("should return 403 when trying to create a weblink using an account with insufficient permissions", async () => {
        const guestSession = supertest.agent(app);
        await guestSession.post("/api/auth/login").send(guestCredentials);
        const weblinkData = {
            name: "test weblink in guest session",
            description: "test weblink",
            uri: "https://example.com"
        }
        const response = await guestSession.post(`/api/devices/${createdItem.id}/weblinks`).send(weblinkData);
        expect(response.status).to.eql(403);
        expect(response.body).to.have.property("message");
        expect(response.body.message).to.eql("Forbidden");
    });

    it("should return 401 when trying to create a weblink without login", async () => {
        const noAuthSession = supertest.agent(app);
        const weblinkData = {
            name: "test weblink in no auth session",
            description: "test weblink",
            uri: "https://example.com"
        }
        const response = await noAuthSession.post(`/api/devices/${createdItem.id}/weblinks`).send(weblinkData);
        expect(response.status).to.eql(401);
        expect(response.body).to.have.property("message");
        expect(response.body.message).to.eql("Unauthorized");
    });

    it("should delete linked weblinks when deleting a device", async () => {
        const response = await agent.delete(`/api/devices/${createdItem.id}`);
        expect(response.status).to.eql(200);
        expect(response.body).to.have.property("message");
        expect(response.body.message).to.eql("Device deleted");
        const response2 = await agent.get(`/api/devices/${createdItem.id}/weblinks`);
        expect(response2.status).to.eql(404);
    });
});

describe("Test Device CheckIn / Out Routes", () => {
    const agent = supertest.agent(app);
    let createdItem;
    before(async () => {
        await agent.post("/api/auth/login").send(adminCredentials);
        const deviceData = {
            name: "test device for checkin / checkout",
            notes: "test device",
            device_type_id: 1,
            added: new Date().toISOString(),
        }
        const response = await agent.post("/api/devices").send(deviceData);
        createdItem = {id: response.body.id, ...deviceData};
    });
    after(async () => {
        await agent.delete(`/api/devices/${createdItem.id}`);
    });

    it("should return 200 when checking out a device", async () => {
        const response = await agent.post(`/api/devices/${createdItem.id}/checkout`).send({notes: "test checkout"});
        expect(response.status).to.eql(200);
        expect(response.body).to.have.property("message");
        expect(response.body.message).to.eql("Device checked out");
        expect(response.body).to.have.property("checked_out_by")
    });
    it('should return 403 with message Device is already checked out when trying to checkout the device again', function () {
        return agent.post(`/api/devices/${createdItem.id}/checkout`).send({notes: "test checkout"});
        expect(response.status).to.eql(403);
        expect(response.body).to.have.property("message");
        expect(response.body.message).to.eql("Device is already checked out");
    });
    it('should return 200 when checking in a device', function () {
        return agent.post(`/api/devices/${createdItem.id}/checkin`);
        expect(response.status).to.eql(200);
        expect(response.body).to.have.property("message");
        expect(response.body.message).to.eql("Device checked in");
    });

    it("should return 403 when trying to check in a device that is not checked out", async () => {
        const response = await agent.post(`/api/devices/${createdItem.id}/checkin`);
        expect(response.status).to.eql(403);
        expect(response.body).to.have.property("message");
        expect(response.body.message).to.eql("Device is not checked out");
    });

    it("should return 200 when checking out device again after checking in", async () => {
        const response = await agent.post(`/api/devices/${createdItem.id}/checkout`).send({notes: "test checkout 2"});
        expect(response.status).to.eql(200);
        expect(response.body).to.have.property("message");
        expect(response.body.message).to.eql("Device checked out");
        expect(response.body).to.have.property("checked_out_by")

        await agent.post(`/api/devices/${createdItem.id}/checkout`);
    });

    it("should return 40x when another user (without forced permissions) tries to check in the device", async () => {
        await agent.post(`/api/devices/${createdItem.id}/checkin`);
        const userSession = supertest.agent(app);
        await userSession.post("/api/auth/login").send(userCredentials);

        const response = await userSession.post(`/api/devices/${createdItem.id}/checkin`);
        expect(response.status).to.eql(403);
        expect(response.body).to.have.property("message");
        expect(response.body.message).to.eql("Forbidden");

        await agent.post(`/api/devices/${createdItem.id}/checkout`);
    });

    it("should return 200 when an admin checks in the device (Forced CheckIn)", async () => {
        const userSession = supertest.agent(app);
        await userSession.post("/api/auth/login").send(userCredentials);
        await userSession.post(`/api/devices/${createdItem.id}/checkout`).send({notes: "test checkout for forced checkin"});

        const response = await agent.post(`/api/devices/${createdItem.id}/checkin`);
        expect(response.status).to.eql(200);
        expect(response.body).to.have.property("message");
        expect(response.body.message).to.eql("Device checked in");
    });

});

describe("Test GuideMe Manager administrative Routes", () => {
    const agent = supertest.agent(app);
    before(async () => {
        await agent.post("/api/auth/login").send(adminCredentials);
    });
    describe("Test Guides Management", () => {
        let createdGuideItemId;
        // Create a guide
        it("should return 200 when creating a guide", async () => {
            const guideData = {name:"GuideMe Test Name", description:"Test GuideMe Description", visible:1};
            const guideItem = new GuideMeItem();
            guideItem.setData(guideData);
            const response = await agent.post("/api/admin/guides").send(guideData);
            expect(response.status).to.eql(200);
            expect(response.body).to.have.property("id");
            createdGuideItemId = response.body.id;
        });
        // Get all guides
        it("should return 200 and an array containing exactly one guide when getting all guides", async () => {
            const response = await agent.get("/api/admin/guides");
            expect(response.status).to.eql(200);
            expect(response.body).to.have.property("guides");
            expect(response.body.guides).to.be.an("array").and.have.lengthOf(1);
            expect(response.body.guides[0]).to.have.property("id");
        });
        // Get a guide
        it("should return 200 and a guide when getting a guide by its id", async () => {
            const response = await agent.get(`/api/admin/guides/${createdGuideItemId}`);
            expect(response.status).to.eql(200);
            expect(response.body).to.have.property("guide");
            expect(response.body.guide).to.have.property("id");
            expect(response.body.guide.id).to.eql(createdGuideItemId);
        });
        // Update a guide
        it("should return 200 when updating a guide", async () => {
            const guideData = {id: createdGuideItemId, name:"GuideMe New Test Name", description:"Updated Test GuideMe Description", visible:0};
            const response = await agent.put(`/api/admin/guides/${createdGuideItemId}`).send(guideData);
            expect(response.status).to.eql(200);
        });
        // Delete a guide
        it("should return 200 when deleting a guide", async () => {
            const response = await agent.delete(`/api/admin/guides/${createdGuideItemId}`);
            expect(response.status).to.eql(200);
        });
    });

    describe("Test Guide Slides Management", () => {
        let createdGuideItemId;
        before(async () => {
            // Create a guide
        });
        after(async () => {
            // Delete the guide
        });
        // Create a slide
        // Get all slides
        // Get a slide
        // Update a slide
        // Delete a slide
    });
});