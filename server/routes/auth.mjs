import express from "express";
import UserValidator from "../middlewares/UserValidator.mjs";
import {PermissionHandler} from "../helpers/PermissionHandler.mjs";
import TokenHelper from "../helpers/TokenHelper.mjs";

const router = express.Router();

router.post('/login', UserValidator.validateLogin, UserValidator.setCookies,(req, res) => {

    const user = req.user;
    delete user.password;
    res.status(200).json({user, message: 'Login successful'});

})

router.get('/logout', await UserValidator.validateTokens, async (req, res) => {

    try{
        await TokenHelper.deleteToken(req.user, req.originalRefreshToken);
    }catch (error) {
        console.error("Error while deleting token:", error);
    }

    try{
        await TokenHelper.deleteOldTokens(req.user.id);
    }catch (error) {
        console.error("Error while deleting old tokens:", error);
    }


    res.clearCookie('nxd-token');
    res.clearCookie('nxd-refresh-token');
    res.status(200).send('Logout successful');
});

router.get('/logout-everywhere', await UserValidator.validateTokens, async (req, res) => {

        try{
            await TokenHelper.deleteAllTokens(req.user);
        }catch (error) {
            console.error("Error while deleting token:", error);
        }

        res.clearCookie('nxd-token');
        res.clearCookie('nxd-refresh-token');
        res.status(200).send('Logout successful');
});
export default router;