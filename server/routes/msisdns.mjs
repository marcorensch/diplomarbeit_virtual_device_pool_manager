import express from "express";
import MsisdnHelper from "../helpers/MsisdnHelper.mjs";

const router = express.Router();

router.get("/", async (req, res) => {
    const parentOnly = req.query.parentOnly || false;
    try {
        const numbers = await MsisdnHelper.getAllMsisdns(parentOnly, false);
        return res.status(200).json(numbers);
    }catch (e) {
        console.log(e)
        return res.status(500).json({error: "Could not get MSISDN's"});
    }
});

export default router;