import express from "express";
import UserValidator from "../middlewares/UserValidator.mjs";
import MsisdnHelper from "../helpers/MsisdnHelper.mjs";

const router = express.Router();

router.get('/', UserValidator.hasPermission('canAccessSimTypes'), UserValidator.setCookies, async (req, res) => {
    const simTypes = await MsisdnHelper.getSimTypes();
    if(!simTypes) return res.status(500).json({error: "Could not get sim types"});
    return res.status(200).json(simTypes);
});

export default router;