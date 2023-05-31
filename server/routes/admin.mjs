import express from "express";
import accountsRouter from "./admin_accounts.mjs";
import msisdnsRouter from "./admin_msisdns.mjs";
import simTypesRouter from "./admin_sim_types.mjs";
import poolBuilderRouter from "./admin_poolbuilder.mjs";
import guidesRouter from "./admin_guides.mjs";
import UserValidator from "../middlewares/UserValidator.mjs";
const router = express.Router();

router.use(UserValidator.validateTokens);
router.use(UserValidator.setCookies);
router.use(UserValidator.hasPermission("canAccessAdmin"));
router.use('/accounts', accountsRouter);
router.use('/msisdns', msisdnsRouter);
router.use('/sim_types', simTypesRouter);
router.use('/poolbuilder', poolBuilderRouter);
router.use('/guides', guidesRouter);

export default router;