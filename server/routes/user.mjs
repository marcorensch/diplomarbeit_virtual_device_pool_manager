import * as dotenv from 'dotenv';
dotenv.config();

import express from "express";
import LoginValidator from "../middlewares/loginValidator.mjs";

const router = express.Router();

router.post('/login', LoginValidator.validate, async (req, res) => {

    console.log(req.user)

    res.send("ok")

})

export default router;