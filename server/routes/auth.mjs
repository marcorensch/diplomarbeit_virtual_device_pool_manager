import express from "express";
import UserValidator from "../middlewares/UserValidator.mjs";

const router = express.Router();

router.post('/login', UserValidator.validateLogin, UserValidator.setCookies, async (req, res) => {

    res.status(200).json({token: req.user.token, message: 'Login successful'});

})

export default router;