import express from "express";
import UserValidator from "../middlewares/UserValidator.mjs";
import UserHelper from "../helpers/UserHelper.mjs";

const router = express.Router();

router.get('/', UserValidator.hasPermission('canAccessNumberList'), UserValidator.setCookies, async (req, res) => {
    const users = await UserHelper.getAllUsers();
    return res.status(200).json({users});
});