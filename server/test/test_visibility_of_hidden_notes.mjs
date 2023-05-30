import supertest from "supertest";
import chai from "chai";
import {describe} from "mocha";
import {app} from "../server.mjs";

const {expect} = chai;

const adminCredentials = {
    username: "administrator",
    password: "test"
}

const guestsAgent = supertest.agent(app);
const registeredUserAgent = supertest.agent(app);
const managerAgent = supertest.agent(app);
const adminAgent = supertest.agent(app);
let createdDeviceID;
let createdManufacturerID;
let createdMsisdnID;
describe("Test visibility of hidden notes", () => {
    before(async () => {
        await adminAgent.get("/api/auth/logout");
        await adminAgent.post("/api/auth/login").send(adminCredentials);
        // Store new device
        const deviceData = {
            name: "test device for hidden notes",
            description: "test device",
            device_type_id: 1,
            added: new Date().toISOString(),
        }
        // Store new manufacturer
        const manuData = {
            name: "test manufacturer for hidden notes",
            notes: "test manufacturer",
            hidden: "test manufacturer hidden notes",
        }
        const msisdnData = {
            msisdn: "41790001122",
            sim_number: "89410112345678909876",
            sim_type_id: 1,
            abonnement: "HIDDEN NOTES TEST",
            scn: "1234567",
            notes: "Some notes for hidden notes test",
            hidden: "Hidden notes for hidden notes test",
        }
        const cm_response = await adminAgent.post("/api/manufacturers").send(manuData);
        createdManufacturerID = cm_response.body.id;
        const cd_response = await adminAgent.post("/api/devices").send(deviceData);
        createdDeviceID = cd_response.body.id;
        const cn_response = await adminAgent.post("/api/admin/msisdns").send(msisdnData);
        createdMsisdnID = cn_response.body.id;
        await adminAgent.get("/api/auth/logout");
    });
    after(async () => {
        await adminAgent.post("/api/auth/login").send(adminCredentials);
        await adminAgent.delete(`/api/devices/${createdDeviceID}`);
        await adminAgent.delete(`/api/manufacturers/${createdManufacturerID}`);
        await adminAgent.delete(`/api/admin/msisdns/${createdMsisdnID}`);
    });
    describe("Guests should not see hidden notes", () => {
        before(async () => {
            await guestsAgent.get("/api/auth/logout");
            await guestsAgent.post("/api/auth/login").send({username: "guest", password: "test"});
        });
        describe("Test devices routes for hidden notes", () => {
            it("return value should not contain hidden notes for device listing", async () => {
                const response = await guestsAgent.get("/api/devices?limit=1&offset=0");
                expect(response.status).to.equal(200);
                expect(response.body).to.be.an("object");
                expect(response.body).to.have.property("devices");
                response.body.devices.forEach(device => {
                    expect(device).to.not.have.property("hidden");
                });
            });
            it("return value should not contain hidden notes for single device", async () => {
                const response = await guestsAgent.get(`/api/devices/${createdDeviceID}`);
                expect(response.status).to.equal(200);
                expect(response.body).to.be.an("object");
                expect(response.body).to.have.property("name");
                expect(response.body).to.have.property("notes");
                expect(response.body).to.not.have.property("hidden");
            });
        });
        describe("Test manufacturer routes for hidden notes", () => {
            it("return value should not contain hidden notes for manufacturer listing", async () => {
                const response = await guestsAgent.get("/api/manufacturers");
                expect(response.status).to.equal(200);
                expect(response.body).to.be.an("array");
                response.body.forEach(manufacturer => {
                    expect(manufacturer).to.not.have.property("hidden");
                });
            });
            it("return value should not contain hidden notes for single manufacturer", async () => {
                const response = await guestsAgent.get(`/api/manufacturers/${createdManufacturerID}`);
                expect(response.status).to.equal(200);
                expect(response.body).to.be.an("object");
                expect(response.body).to.have.property("name");
                expect(response.body).to.have.property("notes");
                expect(response.body).to.not.have.property("hidden");
            });
        });
        describe("Test MSISDN routes for hidden notes", () => {
            it("return value should not contain hidden notes for MSISDN listing", async () => {
                const response = await guestsAgent.get("/api/msisdns");
                expect(response.status).to.equal(200);
                expect(response.body).to.be.an("array").and.to.have.length.greaterThan(0);
                response.body.forEach(msisdn => {
                    expect(msisdn).to.have.property("notes");
                    expect(msisdn).to.have.property("msisdn");
                    expect(msisdn).to.not.have.property("hidden");
                });
            });
        });
    });
    describe("Registered Uses should not see hidden notes", () => {
        before(async () => {
            await registeredUserAgent.get("/api/auth/logout");
            await registeredUserAgent.post("/api/auth/login").send({username: "user", password: "test"});
        });
        describe("Test devices routes for hidden notes", () => {
            it("return value should not contain hidden notes for device listing", async () => {
                const response = await registeredUserAgent.get("/api/devices?limit=1&offset=0");
                expect(response.status).to.equal(200);
                expect(response.body).to.be.an("object");
                expect(response.body).to.have.property("devices");
                response.body.devices.forEach(device => {
                    expect(device).to.not.have.property("hidden");
                });
            });
            it("return value should not contain hidden notes for single device", async () => {
                const response = await registeredUserAgent.get(`/api/devices/${createdDeviceID}`);
                expect(response.status).to.equal(200);
                expect(response.body).to.be.an("object");
                expect(response.body).to.have.property("name");
                expect(response.body).to.have.property("notes");
                expect(response.body).to.not.have.property("hidden");
            });
        });
        describe("Test manufacturer routes for hidden notes", () => {
            it("return value should not contain hidden notes for manufacturer listing", async () => {
                const response = await registeredUserAgent.get("/api/manufacturers");
                expect(response.status).to.equal(200);
                expect(response.body).to.be.an("array");
                response.body.forEach(manufacturer => {
                    expect(manufacturer).to.not.have.property("hidden");
                });
            });
            it("return value should not contain hidden notes for single manufacturer", async () => {
                const response = await registeredUserAgent.get(`/api/manufacturers/${createdManufacturerID}`);
                expect(response.status).to.equal(200);
                expect(response.body).to.be.an("object");
                expect(response.body).to.have.property("name");
                expect(response.body).to.have.property("notes");
                expect(response.body).to.not.have.property("hidden");
            });
        });
        describe("Test MSISDN routes for hidden notes", () => {
            it("return value should not contain hidden notes for MSISDN listing", async () => {
                const response = await registeredUserAgent.get("/api/msisdns");
                expect(response.status).to.equal(200);
                expect(response.body).to.be.an("array").and.to.have.length.greaterThan(0);
                response.body.forEach(msisdn => {
                    expect(msisdn).to.have.property("notes");
                    expect(msisdn).to.have.property("msisdn");
                    expect(msisdn).to.not.have.property("hidden");
                });
            });
        });
    });
    describe("Managers should not see hidden notes", () => {
        before(async () => {
            await managerAgent.get("/api/auth/logout");
            await managerAgent.post("/api/auth/login").send({username: "manager", password: "test"});
        });
        describe("Test devices routes for hidden notes", () => {
            it("return value should not contain hidden notes for device listing", async () => {
                const response = await managerAgent.get("/api/devices?limit=1&offset=0");
                expect(response.status).to.equal(200);
                expect(response.body).to.be.an("object");
                expect(response.body).to.have.property("devices");
                response.body.devices.forEach(device => {
                    expect(device).to.not.have.property("hidden");
                });
            });
            it("return value should not contain hidden notes for single device", async () => {
                const response = await managerAgent.get(`/api/devices/${createdDeviceID}`);
                expect(response.status).to.equal(200);
                expect(response.body).to.be.an("object");
                expect(response.body).to.have.property("name");
                expect(response.body).to.have.property("notes");
                expect(response.body).to.not.have.property("hidden");
            });
        });
        describe("Test manufacturer routes for hidden notes", () => {
            it("return value should not contain hidden notes for manufacturer listing", async () => {
                const response = await managerAgent.get("/api/manufacturers");
                expect(response.status).to.equal(200);
                expect(response.body).to.be.an("array");
                response.body.forEach(manufacturer => {
                    expect(manufacturer).to.not.have.property("hidden");
                });
            });
            it("return value should not contain hidden notes for single manufacturer", async () => {
                const response = await managerAgent.get(`/api/manufacturers/${createdManufacturerID}`);
                expect(response.status).to.equal(200);
                expect(response.body).to.be.an("object");
                expect(response.body).to.have.property("name");
                expect(response.body).to.have.property("notes");
                expect(response.body).to.not.have.property("hidden");
            });
        });
        describe("Test MSISDN routes for hidden notes", () => {
            it("return value should not contain hidden notes for MSISDN listing", async () => {
                const response = await managerAgent.get("/api/msisdns");
                expect(response.status).to.equal(200);
                expect(response.body).to.be.an("array").and.to.have.length.greaterThan(0);
                response.body.forEach(msisdn => {
                    expect(msisdn).to.have.property("notes");
                    expect(msisdn).to.have.property("msisdn");
                    expect(msisdn).to.not.have.property("hidden");
                });
            });
        });
    });
    describe("Administrators should not see hidden notes on public routes", () => {
        before(async () => {
            await adminAgent.get("/api/auth/logout");
            await adminAgent.post("/api/auth/login").send({username: "administrator", password: "test"});
        });
        describe("Test devices routes for hidden notes", () => {
            it("return value should not contain hidden notes for device listing", async () => {
                const response = await adminAgent.get("/api/devices?limit=1&offset=0");
                expect(response.status).to.equal(200);
                expect(response.body).to.be.an("object");
                expect(response.body).to.have.property("devices");
                response.body.devices.forEach(device => {
                    expect(device).to.not.have.property("hidden");
                });
            });
            it("return value should contain hidden notes for single device", async () => {
                const response = await adminAgent.get(`/api/devices/${createdDeviceID}`);
                expect(response.status).to.equal(200);
                expect(response.body).to.be.an("object");
                expect(response.body).to.have.property("name");
                expect(response.body).to.have.property("notes");
                expect(response.body).to.have.property("hidden");
            });
        });
        describe("Test manufacturer routes for hidden notes", () => {
            it("return value should not contain hidden notes for manufacturer listing", async () => {
                const response = await adminAgent.get("/api/manufacturers");
                expect(response.status).to.equal(200);
                expect(response.body).to.be.an("array");
                response.body.forEach(manufacturer => {
                    expect(manufacturer).to.have.not.property("hidden");
                });
            });
            it("return value should not contain hidden notes for single manufacturer", async () => {
                const response = await adminAgent.get(`/api/manufacturers/${createdManufacturerID}`);
                expect(response.status).to.equal(200);
                expect(response.body).to.be.an("object");
                expect(response.body).to.have.property("name");
                expect(response.body).to.have.property("notes");
                expect(response.body).to.not.have.property("hidden");
            });
        });
        describe("Test MSISDN routes for hidden notes", () => {
            it("return value should not contain hidden notes for MSISDN listing", async () => {
                const response = await adminAgent.get("/api/msisdns");
                expect(response.status).to.equal(200);
                expect(response.body).to.be.an("array").and.to.have.length.greaterThan(0);
                response.body.forEach(msisdn => {
                    expect(msisdn).to.have.property("notes");
                    expect(msisdn).to.have.property("msisdn");
                    expect(msisdn).to.not.have.property("hidden");
                });
            });
        });
    });
    describe("Administrators should see hidden notes on secured routes", () => {
        before(async () => {
            await adminAgent.get("/api/auth/logout");
            await adminAgent.post("/api/auth/login").send({username: "administrator", password: "test"});
        });
        describe("Test admin MSISDN's route for hidden notes", async () => {
            it("return value should contain hidden notes for MSISDN listing", async () => {
                const response = await adminAgent.get("/api/admin/msisdns");
                expect(response.status).to.equal(200);
                expect(response.body).to.be.an("array").and.to.have.length.greaterThan(0);
                response.body.forEach(msisdn => {
                    expect(msisdn).to.have.property("notes");
                    expect(msisdn).to.have.property("msisdn");
                    expect(msisdn).to.have.property("hidden");
                });
            });
            it("return value should contain hidden notes for single MSISDN", async () => {
                const response = await adminAgent.get(`/api/admin/msisdns/${createdMsisdnID}`);
                expect(response.status).to.equal(200);
                expect(response.body).to.be.an("object");
                expect(response.body).to.have.property("notes");
                expect(response.body).to.have.property("msisdn");
                expect(response.body).to.have.property("hidden");
            });
        });
    });
});