import {expect} from "chai";
import {calculateExpirationMs} from "../helpers/Utilities.mjs";
import {PermissionHandler} from "../helpers/PermissionHandler.mjs";

describe("Test Utilities", () => {
    describe("Test Calculate ms method", () => {
        it("should return the correct value for the given time", () => {
            expect(calculateExpirationMs("1s")).to.equal(1000);
            expect(calculateExpirationMs("1m")).to.equal(60000);
            expect(calculateExpirationMs("1h")).to.equal(3600000);
            expect(calculateExpirationMs("1d")).to.equal(86400000);
            expect(calculateExpirationMs("3w")).to.equal(1814400000);
            expect(calculateExpirationMs("3M")).to.equal(7776000000);
            expect(calculateExpirationMs("1")).to.equal(3600000);
            expect(calculateExpirationMs("2")).to.equal(3600000);
            expect(calculateExpirationMs()).to.equal(3600000);
            expect(calculateExpirationMs("invalidString")).to.equal(3600000);
            expect(calculateExpirationMs("5y")).to.equal(157680000000);
        });
    });
});

describe("Test Permission Handler Class", () => {
    let permissionHandler;

    before(() => {
        permissionHandler = new PermissionHandler();
    });

    it("should return a PermissionHandler object", () => {
        expect(permissionHandler).to.be.an("object");
        expect(permissionHandler).to.have.property("permissions");
        expect(permissionHandler).to.have.property("roles");
        expect(permissionHandler).to.have.property("rolePermissions");
        expect(permissionHandler).to.have.property("getPermissions");
    });
    it("should return a map of permissions for Role ADMIN", () => {
        const result = permissionHandler.getPermissions("admin");
        expect(result).to.be.an("Map");
    });
    it("should return a map of permissions for Role ADMIN that contains 'canAccessAdmin'", () => {
        const result = permissionHandler.getPermissions("admin");
        expect(result.size).to.be.greaterThan(5);
        expect(result.has("canAccessAdmin")).to.be.true;
    });
    it("should return a map of permissions for Role USER that does not contain 'canAccessAdmin'", () => {
        const result = permissionHandler.getPermissions("USER");
        expect(result.size).to.be.greaterThan(5);
        expect(result.has("canAccessAdmin")).to.be.false;
    });
    it("should return a map of permissions for multiple Roles (ADMIN & USER)", () => {
        const result = permissionHandler.getPermissions(["admin", "user"]);
        expect(result.size).to.be.greaterThan(5);
        expect(result.has("canAccessAdmin")).to.be.true;
    });
    it("should return a map of permissions for multiple Roles (ADMIN & USER) where the count is smaller then the sum of both role permissions", () => {
        const combined = permissionHandler.getPermissions(["admin", "user"]).size;
        const admin = permissionHandler.getPermissions("admin").size;
        const user = permissionHandler.getPermissions("user").size;
        expect(combined).to.be.lessThan(admin + user);
    });

});