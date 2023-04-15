import UserFactory from "../factories/UserFactory.mjs";
import TokenHelper from "../helpers/TokenHelper.mjs";
import jwt from "jsonwebtoken";

export default class UserValidator {
    static async validate(req, res, next) {
        let {username, password} = req.body;
        if (!username || !password) return res.status(400).send("Username or password missing");

        try {
            let user = await UserFactory.getUserByUsername(username);
            if (!await user.checkPassword(password)) return res.status(401).send("Invalid password");
            user = await TokenHelper.generateTokens(user);
            await TokenHelper.storeTokens(user)
            req.user = user;
            next();
        } catch (e) {
            console.log(e)
            return res.status(500).send("Error while logging in");
        }

    }

    static async validateToken(req, res, next) {
        let token = req.cookies['nxd-token'];
        if (!token) return res.status(401).send("Missing token");
        try{
            const {id} = jwt.verify(token, process.env.JWT_SECRET);
            req.user = await UserFactory.getUserById(id);
            next();
        } catch (e) {
            return res.status(401).send("Invalid token");
        }
    }

    static async isAdmin(req, res, next) {
        if (req.user.role !== 'admin') return res.status(403).send("Unauthorized");
        next();
    }
}