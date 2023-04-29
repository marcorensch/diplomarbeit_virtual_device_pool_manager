import express from "express";
import UserValidator from "../middlewares/UserValidator.mjs";
import {PermissionHandler} from "../helpers/PermissionHandler.mjs";
import TokenHelper from "../helpers/TokenHelper.mjs";

const router = express.Router();

router.post('/login', UserValidator.validateLogin, UserValidator.setCookies,(req, res) => {

    const permissionHandler = new PermissionHandler();
    const permissions = permissionHandler.getPermissions(req.user.role);
    const permissionsArray = Array.from(permissions.entries()).map(([key, value]) => { return key});
    const user = req.user;
    delete user.password;
    res.status(200).json({user, permissions: permissionsArray, message: 'Login successful'});

})

router.get('/logout', await UserValidator.validateTokens, async (req, res) => {
    const deleted = await TokenHelper.deleteOldTokens(req.user.id);
    console.log(deleted);
    res.clearCookie('nxd-token');
    res.clearCookie('nxd-refresh-token');
    res.status(200).send('Logout successful');
});
export default router;