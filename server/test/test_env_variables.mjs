import {expect} from "chai";
describe("Test Environment Variables", () => {
    it("should return the correct value for the environment variable", () => {
        expect(process.env.NODE_ENV).to.equal("test", "The environment variable NODE_ENV is not set to test");
    });
    it('should return the correct value for DATABASE_NAME', function () {
        expect(process.env.DATABASE_NAME).to.equal("virtual_device_pool_manager_test", "The environment variable DATABASE_NAME is not set to virtual_device_pool_manager_test");
    });
});