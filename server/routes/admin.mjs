import express from "express";
import accountsRouter from "./admin_accounts.mjs";
import numbersRouter from "./admin_numbers.mjs";
import simTypesRouter from "./admin_sim_types.mjs";
import UserValidator from "../middlewares/UserValidator.mjs";
const router = express.Router();

router.use(UserValidator.validateTokens);
router.use('/accounts', accountsRouter);
router.use('/numbers', numbersRouter);
router.use('/sim_types', simTypesRouter);

export default router;