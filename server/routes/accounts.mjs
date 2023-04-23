import express from "express";
import UserValidator from "../middlewares/UserValidator.mjs";
import UserFactory from "../factories/UserFactory.mjs";

const router = express.Router();
router.use(UserValidator.validateTokens);
router.put('/:id', UserValidator.hasPermission('canUpdateOwnAccount') , UserValidator.setCookies, async (req, res) => {
    const {id} = req.params;
    if(parseInt(id) !== parseInt(req.user.id)) return res.status(403).send("You are not allowed to update this account");
    const data = req.body;
    for (const key in data) if(data[key] === undefined) delete data[key];

    let user;
    try {
        user = await UserFactory.getUserById(id);
    } catch (e) {
        return res.status(404).send("Error while identifying user");
    }

    if (data.hasOwnProperty('password')) {
        user.password = await user.encryptPassword(data.password)
        delete data.password;
    };

    user.setData(data);

    try {
        await user.save();
        delete user.password;
        return res.status(200).json({message: "User updated", user});
    } catch (e) {
        console.log(e)
        return res.status(500).send("Error while updating user");
    }
});

export default router;