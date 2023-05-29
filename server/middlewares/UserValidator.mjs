import UserHelper from "../helpers/UserHelper.mjs";
import {calculateExpirationMs} from "../helpers/Utilities.mjs";
import jwt from "jsonwebtoken";
import {PermissionHandler} from "../helpers/PermissionHandler.mjs";
import TokenHelper from "../helpers/TokenHelper.mjs";

export default class UserValidator {
    static async validateLogin(req, res, next) {
        let {username, password} = req.body;
        if (!username || !password) return res.status(400).send("Username or password missing");
        let user;
        try {
            user = await UserHelper.getUserByUsername(username);
        } catch (e) {
            return res.status(401).send("Invalid Credentials");
        }

        try {
            if (!await user.comparePasswords(password)) return res.status(401).send("Invalid Credentials");
        } catch (e) {
            console.log(e)
            return res.status(500).send("Error while validating credentials");
        }

        try {
            user = await TokenHelper.generateTokens(user);
        } catch (e) {
            console.log(e)
            return res.status(500).send("Error while generating tokens");
        }

        try {
            await TokenHelper.saveNewTokens(user);
        } catch (e) {
            console.log(e)
            return res.status(500).send("Error while saving tokens");
        }

        req.user = user;
        req.updateTokens = true;
        next();
    }

    static async validateTokens(req, res, next) {
        let user, decoded;
        const currentToken = req.cookies['nxd-token'];
        const currentRefreshToken = req.cookies['nxd-refresh-token'];
        req.updateTokens = false;

        if (!currentToken && !currentRefreshToken) {
            res.clearCookie('nxd-token');
            res.clearCookie('nxd-refresh-token');
            return res.status(401).send({message: "Unauthorized"});
        }

        try{
            const result = await TokenHelper.getTokens(currentRefreshToken);
            if(!result || !result.length) {
                res.clearCookie('nxd-token');
                res.clearCookie('nxd-refresh-token');
                return res.status(401).send({message: "Unauthorized"});
            }
        } catch (e) {
            console.log(e)
            return res.status(500).send({message: "Error while validating"});
        }

        if(currentToken){
            try {
                decoded = jwt.verify(currentToken, process.env.JWT_SECRET);
            } catch (e) {
                res.clearCookie('nxd-token');
                res.clearCookie('nxd-refresh-token');
                return res.status(401).send({message: "Unauthorized"});
            }
        }else{
            req.updateTokens = true;
        }

        if(!decoded && currentRefreshToken){
            try {
                decoded = jwt.verify(currentRefreshToken, process.env.JWT_REFRESH_SECRET);
                req.updateTokens = true;
            } catch (e) {
                res.clearCookie('nxd-token');
                res.clearCookie('nxd-refresh-token');
                return res.status(401).send({message: "Unauthorized"});
            }
        }

        try {
            user = await UserHelper.getUserById(decoded.id);
        }catch (e) {
            res.clearCookie('nxd-token');
            res.clearCookie('nxd-refresh-token');
            return res.status(404).send({message: "User not found"});
        }

        if(req.updateTokens){
            try {
                user = await TokenHelper.generateTokens(user);
            }catch (e) {
                console.log(e)
                return res.status(500).send({message: "Error while generating tokens"});
            }

            try {
                await TokenHelper.updateTokens(user, currentRefreshToken);
            }catch (e) {
                console.log(e)
                return res.status(500).send({message: "Error while saving updated tokens"});
            }
        }

        req.originalRefreshToken = currentRefreshToken;
        req.user = user;
        next();
    }

    static async setCookies(req, res, next) {
        if (req.updateTokens) {
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
        }

        next();
    }

    static setCanHandleHiddenInformation (req, res, next) {
        req.canHandleHiddenInformation = false;
        if(req.user?.role) {
            const permissionHandler = new PermissionHandler();
            const permissionsMap = permissionHandler.getPermissions(req.user.role);
            req.canHandleHiddenInformation = permissionsMap.has("canHandleHiddenInformation");
        }

        next();
    };

    static hasPermission(action) {
        return function (req, res, next) {
            if (!req.user?.role) return res.status(403).send({message: "Unauthorized"});
            const permissionHandler = new PermissionHandler();
            const permissionsMap = permissionHandler.getPermissions(req.user.role);
            if (!permissionsMap.has(action)) return res.status(403).send({message: "Forbidden"});

            next();
        }
    }

    static async hasPermissions(actions) {
        if (!Array.isArray(actions)) actions = [actions];
        return function (req, res, next) {
            if (!req.user?.role) return res.status(403).send({message: "Forbidden"});
            const permissionHandler = new PermissionHandler();
            const permissionsMap = permissionHandler.getPermissions(req.user.role);
            for (let action of actions) {
                if (!permissionsMap.has(action)) return res.status(403).send({message: "Forbidden"});
            }
            next();
        }
    }
}