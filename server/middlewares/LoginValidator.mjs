import UserFactory from "../factories/UserFactory.mjs";
import TokenHelper from "../helpers/TokenHelper.mjs";

export default class LoginValidator {
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
}