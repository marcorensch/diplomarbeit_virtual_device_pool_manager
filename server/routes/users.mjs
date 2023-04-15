import express from "express";
import UserFactory from "../factories/UserFactory.mjs";
import UserValidator from "../middlewares/UserValidator.mjs";

const router = express.Router();

router.get('/', UserValidator.validateTokens, UserValidator.isAdmin, UserValidator.setCookies, async (req, res) => {
    const users = await UserFactory.getAllUsers();
    return res.status(200).json({users});
});

router.post('/', UserValidator.validateTokens, UserValidator.isAdmin, UserValidator.setCookies, async (req, res) => {
    const {username, password, role} = req.body;
    // await UserFactory.createUser(username, password, role);
    return res.status(201).send("User created");
});

export default router;