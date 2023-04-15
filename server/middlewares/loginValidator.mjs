import UserFactory from "../factories/UserFactory.mjs";

export default class LoginValidator {
    static async validate(req, res, next) {
        let {username, password} = req.body;
        if (!username || !password) return res.status(400).send("Username or password missing");
        try {
            const user = await UserFactory.getUserByUsername(username);
            if (!await user.checkPassword(password)) return res.status(401).send("Invalid password");
            req.user = user;
            next();
        } catch (e) {
            return res.status(401).send("Invalid username or password");
        }
    }
}