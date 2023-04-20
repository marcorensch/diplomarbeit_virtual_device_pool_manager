import express from "express";
import UserValidator from "../middlewares/UserValidator.mjs";
import Role from "../models/Role.mjs";

const router = express.Router();

router.get('/', UserValidator.validateTokens, UserValidator.hasPermission("canAccessRolesList"), UserValidator.setCookies, async (req, res) => {
    const roles = await Role.getAllRoles();
    return res.status(200).json({roles});
});

export default router;