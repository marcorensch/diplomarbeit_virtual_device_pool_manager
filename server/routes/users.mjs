import express from "express";
import UserFactory from "../factories/UserFactory.mjs";
import UserValidator from "../middlewares/UserValidator.mjs";
import User from "../models/User.mjs";

const router = express.Router();

router.get('/', UserValidator.validateTokens, UserValidator.checkIsAdmin, UserValidator.setCookies, async (req, res) => {
    const users = await UserFactory.getAllUsers();
    return res.status(200).json({users});
});

router.post('/', UserValidator.validateTokens, UserValidator.hasPermission('create_account'), UserValidator.setCookies, async (req, res) => {
    const {username, firstname, lastname, password, email, role_id, notes, hidden} = req.body;
    console.log(username, password, role_id)
    if (!username || !password || !role_id) return res.status(400).send("Missing data");

    try {
        if (await UserFactory.checkUserExists(username)) return res.status(409).send("Username already in use");
    } catch (e) {
        console.log(e)
        return res.status(500).send("Error while checking username availability");
    }

    try {
        const user = new User();
        user.setData({username, firstname, lastname, email, role_id, notes, hidden})
        user.password = await user.encryptPassword(password);
        await user.save();
        return res.status(201).send("User created");
    } catch (e) {
        console.log(e)
        return res.status(500).send("Error while creating user");
    }
});

router.delete('/:id', UserValidator.validateTokens, UserValidator.hasPermission("DELETE_ACCOUNT"), UserValidator.setCookies, async (req, res) => {
    const {id} = req.params;
    try {
        const user = await UserFactory.getUserById(id);
        await user.delete();
        return res.status(200).send("User deleted");
    } catch (e) {
        console.log(e)
        return res.status(500).send("Error while deleting user");
    }
});

export default router;