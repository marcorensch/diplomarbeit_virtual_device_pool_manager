import {expect} from "chai";
import User from "../models/User.mjs";


describe("Test User Model", () => {
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
});