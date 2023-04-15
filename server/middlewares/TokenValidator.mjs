import UserFactory from "../factories/UserFactory.mjs";
import jwt from "jsonwebtoken";

export default class TokenValidator {
    static async validate(req, res, next) {
        let token = req.headers.authorization;
        if (!token) return res.status(401).send("Missing token");
        const validToken = jwt.verify(token, process.env.JWT_SECRET);
        if(!validToken) return res.status(401).send("Invalid token");
        try {
            req.user = await UserFactory.getUserById(id);
            next();
        } catch (e) {
            return res.status(500).send("Error while validating token");
        }
    }
}