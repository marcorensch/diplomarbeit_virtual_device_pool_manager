import express from "express";
import UserFactory from "../factories/UserFactory.mjs";
import UserValidator from "../middlewares/UserValidator.mjs";

const router = express.Router();

router.get('/', UserValidator.validateToken, UserValidator.isAdmin, async (req, res) => {
    const users = await UserFactory.getAllUsers();
    return res.status(200).json({users});
});

export default router;