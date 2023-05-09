import express from "express";
import UserValidator from "../middlewares/UserValidator.mjs";
import MsisdnHelper from "../helpers/MsisdnHelper.mjs";
import msisdnValidator from "../middlewares/msisdnValidator.mjs";

const router = express.Router();

router.get('/', UserValidator.hasPermission('canAccessMsisdnManager'), UserValidator.setCookies, async (req, res) => {
    const parentOnly = req.query.parentOnly || false;
    try {
        const numbers = await MsisdnHelper.getAllMsisdns(parentOnly, false);
        return res.status(200).json(numbers);
    }catch (e) {
        console.log(e)
        return res.status(500).json({error: "Could not get MSISDN's"});
    }
});

router.get('/:id', UserValidator.hasPermission('canUpdateMsisdn'), UserValidator.setCookies, async (req, res) => {
    try {
        const number = await MsisdnHelper.getMsisdnById(req.params.id);
        return res.status(200).json(number);
    }catch (e) {
        console.log(e)
        return res.status(500).json({error: "Could not get MSISDN"});
    }
});

router.post('/', UserValidator.hasPermission('canCreateMsisdn'), msisdnValidator, UserValidator.setCookies, async (req, res) => {
    const data = req.body;
    let id;
    const msisdn = MsisdnHelper.createMsisdn(data);
    try{
        const result = await MsisdnHelper.store(msisdn);
        id = result.id;
    } catch (e) {
        console.log(e)
        return res.status(500).send("Could not create MSISDN");
    }
    return res.status(201).json({id, message: "MSISDN created successfully"});
});

router.put('/:id', UserValidator.hasPermission('canUpdateMsisdn'), msisdnValidator, UserValidator.setCookies, async (req, res) => {
    const data = req.body;
    try {
        const res = await MsisdnHelper.updateMsisdn(req.params.id, data);
        if(!res.affectedRows) return res.status(500).json({error: "Could not update MSISDN"});
    } catch (e) {
        console.log(e)
        return res.status(500).json({error: "Could not update MSISDN"});
    }
    return res.status(200).send("MSISDN updated successfully");
});

router.delete('/:id', UserValidator.hasPermission('canDeleteMsisdn'), UserValidator.setCookies, async (req, res) => {
try {
        const status = await MsisdnHelper.deleteMsisdn(req.params.id);
        if(!status) return res.status(500).json({error: "Could not delete MSISDN"});
    } catch (e) {
        console.log(e)
        return res.status(500).json({error: "Could not delete MSISDN"});
    }
    return res.status(200).send("MSISDN deleted successfully");
});

export default router;