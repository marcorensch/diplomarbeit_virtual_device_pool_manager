import UserFactory from "../factories/UserFactory.mjs";
import { calculateExpirationMs } from "../helpers/Utilities.mjs";
import jwt from "jsonwebtoken";

export default class UserValidator {
    static async validateLogin(req, res, next) {
        let {username, password} = req.body;
        if (!username || !password) return res.status(400).send("Username or password missing");

        try {
            let user = await UserFactory.getUserByUsername(username);
            if (!await user.checkPassword(password)) return res.status(401).send("Invalid password");
            await user.generateTokens();
            req.user = user;
            req.setCookies = true;
            next();
        } catch (e) {
            console.log(e)
            return res.status(500).send("Error while logging in");
        }
    }

    static async validateTokens(req, res, next) {
        let user, userId;
        const currentToken = req.cookies['nxd-token'];
        const currentRefreshToken = req.cookies['nxd-refresh-token'];
        req.setCookies = false;

        if (!currentToken && !currentRefreshToken) return res.status(401).send("Missing token");

        userId = UserValidator.getUserIdFromToken(currentToken, process.env.JWT_SECRET);
        if(!currentRefreshToken) return res.status(401).send("Missing refresh token");
        if(!userId) {
            console.log("refresh token used")
            userId = UserValidator.getUserIdFromToken(currentRefreshToken, process.env.JWT_REFRESH_SECRET);
            req.setCookies = true;
        }
        if(!userId) return res.status(401).send("Invalid token");

        try {
            user = await UserFactory.getUserById(userId);
        } catch (e) {
            console.log(e)
            return res.status(500).send("Error while authorising user");
        }
        if(req.setCookies) await user.generateTokens();
        req.user = user;
        next();
    }

    static getUserIdFromToken(token, secret) {
        try{
            const tokenData = jwt.verify(token, secret);
            return tokenData.user_id;
        } catch(e) {
            return null;
        }
    }

    static async setCookies(req, res, next) {
        if(req.setCookies) {
            res.cookie('nxd-token', req.user.token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
                maxAge: calculateExpirationMs(process.env.JWT_EXPIRATION)
            })

            res.cookie('nxd-refresh-token', req.user.refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
                maxAge: calculateExpirationMs(process.env.JWT_REFRESH_EXPIRATION)
            })
            next();
        } else {
            next();
        }
    }

    static async checkIsAdmin(req, res, next) {
        if (req.user.role !== 'admin') return res.status(403).send("Unauthorized");
        next();
    }
}