import {expect} from "chai";
import User from "../models/User.mjs";

describe("Test User Model", () => {
    describe("Test User Constructor", () => {
        it("should return a user object", () => {
            const user = new User();
            expect(user).to.be.an("object");
            expect(user).to.have.property("id");
            expect(user).to.have.property("username");
            expect(user).to.have.property("password");
            expect(user).to.have.property("firstname");
            expect(user).to.have.property("lastname");
            expect(user).to.have.property("role_id");
            expect(user).to.have.property("token");
            expect(user).to.have.property("refreshToken");
        });
        it("should return a user object with  the given data", () => {
            const user = new User();
            user.setData({
                id: 1,
                username: "testUsername",
                password: "testPassword",
                firstname: "testFirstname",
                lastname: "testLastname",
                role_id: 1,
            });
            expect(user).to.be.an("object");
            expect(user).to.have.property("id").to.equal(1);
            expect(user).to.have.property("username").to.equal("testUsername");
            expect(user).to.have.property("password").to.equal("testPassword");
            expect(user).to.have.property("firstname").to.equal("testFirstname");
            expect(user).to.have.property("lastname").to.equal("testLastname");
        });
        it("should return a user object with generated Tokens", async () => {
            const user = new User();
            user.setData({
                id: 1
            });
            await user.generateTokens();
            expect(user).to.be.an("object");
            expect(user).to.have.property("token");
            expect(user).to.have.property("refreshToken");
            expect(user.token).to.be.a("string");
            expect(user.refreshToken).to.be.a("string");
        });
    });
    describe("Test Password encryption & checks", () => {
        it("should return an encrypted string", async () => {
            const user = new User();
            const result = await user.encryptPassword("testPassword");
            expect(result).to.be.a("string");
            expect(result).to.not.equal("testPassword");
        });
        it("should return true if the password is correct", async () => {
            const user = new User();
            user.setData({
                password: await user.encryptPassword("testPassword")
            });
            const result = await user.comparePasswords("testPassword");
            expect(result).to.be.true;
        });
        it("should return false if the password is not correct", async () => {
            const user = new User();
            user.setData({
                password: await user.encryptPassword("testPassword")
            });
            const result = await user.comparePasswords("WrongTestPassword");
            expect(result).to.be.false;
        });
        it("should return false if the password is null", async () => {
            let msg;
            const user = new User();
            user.setData({
                password: null
            });
            try {
                await user.comparePasswords("testPassword");
            }catch (e) {
                msg = e;
            }
            expect(msg).to.equal("Password is null");
        });
    });
    describe("Test Database Queries", () => {
        describe("Create & Delete User Account", () => {
            let userAccountId;
            it("should store a new user account with the given data", async () => {
                const user = new User();
                user.setData({
                    username: "testUsername",
                    password: "testPassword",
                    email: "testEmail",
                    firstname: "testFirstname",
                    lastname: "testLastname",
                    role_id: 2,
                    hidden: '',
                    notes: '',
                });
                try {
                    const fromQuery = await user.save();
                    expect(fromQuery).to.be.an("object");
                    expect(fromQuery).to.have.property("affectedRows").to.equal(1);
                    expect(fromQuery).to.have.property("insertId").to.be.a("number");
                    userAccountId = fromQuery.insertId;
                } catch (e) {
                    console.log(e);
                }
            });
            it("should delete the user account with the given id", async () => {
                const user = new User();
                user.setData({
                    id: userAccountId
                });
                const fromQuery = await user.delete();
                expect(fromQuery).to.be.an("object");
                expect(fromQuery).to.have.property("affectedRows").to.equal(1);
            });
        });


    });
});