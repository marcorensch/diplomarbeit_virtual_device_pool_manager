import express from "express";
import UserFactory from "../factories/UserFactory.mjs";
import UserValidator from "../middlewares/UserValidator.mjs";
import User from "../models/User.mjs";

const router = express.Router();

router.get('/', UserValidator.hasPermission('canAccessAccountList'), UserValidator.setCookies, async (req, res) => {
    const users = await UserFactory.getAllUsers();
    return res.status(200).json({users});
});

router.post('/', UserValidator.hasPermission('canCreateAccount'), UserValidator.setCookies, async (req, res) => {
    const {username, firstname, lastname, password, email, role_id, notes, hidden} = req.body;
    if (!username || !password || !role_id) return res.status(400).send("Missing data");

    try {
        if (await UserFactory.checkUserExists(username)) return res.status(409).send("Username already in use");
    } catch (e) {
        console.log(e)
        return res.status(500).send("Error while checking username availability");
    }

    const user = new User();
    user.setData({username, firstname, lastname, email, role_id, notes, hidden})
    user.password = await user.encryptPassword(password);

    try {
        await user.save();
        return res.status(201).json({message: "User created", id: user.id});
    } catch (e) {
        console.log(e)
        return res.status(500).send("Error while creating user");
    }
});

router.delete('/:id', UserValidator.hasPermission("canDeleteAccount"), UserValidator.setCookies, async (req, res) => {
    const {id} = req.params;
    let user;
    try {
        user = await UserFactory.getUserById(id);
    } catch (e) {
        return res.status(404).send("Error while identifying user");
    }
    try {
        await user.delete();
        return res.status(200).send("User deleted");
    } catch (e) {
        console.log(e)
        return res.status(500).send("Error while deleting user");
    }
});

export default router;