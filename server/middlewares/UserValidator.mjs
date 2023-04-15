import UserFactory from "../factories/UserFactory.mjs";
import TokenHelper from "../helpers/TokenHelper.mjs";
import { calculateExpirationMs } from "../helpers/Utilities.mjs";
import jwt from "jsonwebtoken";

export default class UserValidator {
    static async validate(req, res, next) {
        let {username, password} = req.body;
        if (!username || !password) return res.status(400).send("Username or password missing");

        try {
            let user = await UserFactory.getUserByUsername(username);
            if (!await user.checkPassword(password)) return res.status(401).send("Invalid password");
            await TokenHelper.generateTokens(user);
            await TokenHelper.storeTokens(user)
            req.user = user;
            next();
        } catch (e) {
            console.log(e)
            return res.status(500).send("Error while logging in");
        }

    }

    static async validateTokens(req, res, next) {
        const currentToken = req.cookies['nxd-token'];
        const currentRefreshToken = req.cookies['nxd-refresh-token'];
        let userId;
        if (!currentToken || !currentRefreshToken) return res.status(401).send("Missing token");
        try {
            const tokenData = jwt.verify(currentToken, process.env.JWT_SECRET);
            userId = tokenData.user_id;
            req.tokenUpdated = false;
        } catch (e) {
            try {
                const refreshTokenData = jwt.verify(currentRefreshToken, process.env.JWT_REFRESH_SECRET);
                userId = refreshTokenData.user_id;
                req.tokenUpdated = true;
            } catch (e) {
                return res.status(401).send("Invalid token");
            }
        }

        const user = await UserFactory.getUserById(userId);
        await TokenHelper.generateTokens(user);
        await TokenHelper.updateTokens(user, currentRefreshToken);
        console.log("Updated tokens")
        req.user = user;
        next();

    }

    static async setCookies(req, res, next) {
        if(req.tokenUpdated) {
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

    static async isAdmin(req, res, next) {
        if (req.user.role !== 'admin') return res.status(403).send("Unauthorized");
        next();
    }
}