import {expect} from "chai";
import {calculateExpirationMs} from "../helpers/Utilities.mjs";

describe("Test Utilities Variables", () => {
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