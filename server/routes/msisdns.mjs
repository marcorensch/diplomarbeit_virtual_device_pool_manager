import express from "express";
import MsisdnHelper from "../helpers/MsisdnHelper.mjs";
import UserValidator from "../middlewares/UserValidator.mjs";

const router = express.Router();

router.get("/", UserValidator.setCanHandleHiddenInformation, async (req, res) => {
    const parentOnly = req.query.parentOnly || false;
    let numbers = [];
    try {
        numbers = await MsisdnHelper.getAllMsisdns(parentOnly, false);
    }catch (e) {
        console.log(e)
        return res.status(500).json({error: "Could not get MSISDN's"});
    }

    if(!req.canHandleHiddenInformation && numbers.length > 0) {
        numbers.forEach(number => {
            if(number.hasOwnProperty("hidden")) delete number.hidden;
        });
    }

    return res.status(200).json(numbers);
});

export default router;