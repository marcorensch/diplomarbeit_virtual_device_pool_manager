import express from "express";
import accountsRouter from "./admin_accounts.mjs";
import UserValidator from "../middlewares/UserValidator.mjs";
const router = express.Router();

router.use(UserValidator.validateTokens);
router.use('/accounts', accountsRouter);

export default router;