import express from "express";
import UserValidator from "../middlewares/UserValidator.mjs";
import MsisdnHelper from "../helpers/MsisdnHelper.mjs";

const router = express.Router();

router.get('/', UserValidator.hasPermission('canAccessNumberList'), UserValidator.setCookies, async (req, res) => {
    const parentOnly = req.query.parentOnly || false;
    try {
        const numbers = await MsisdnHelper.getAllMsisdns(parentOnly);
        return res.status(200).json(numbers);
    }catch (e) {
        console.log(e)
        return res.status(500).json({error: "Could not get MSISDN's"});
    }
});

router.get('/:id', UserValidator.hasPermission('canUpdateNumbers'), UserValidator.setCookies, async (req, res) => {
    try {
        const number = await MsisdnHelper.getMsisdnById(req.params.id);
        return res.status(200).json(number);
    }catch (e) {
        console.log(e)
        return res.status(500).json({error: "Could not get MSISDN"});
    }
});

router.post('/', UserValidator.hasPermission('canCreateNumbers'), UserValidator.setCookies, async (req, res) => {
    const data = req.body;
    const msisdn = MsisdnHelper.createMsisdn(data);
    try{
        await msisdn.store();
    } catch (e) {
        console.log(e)
        return res.status(500).json({error: "Could not create MSISDN"});
    }
    return res.status(201).json({msisdn});
});

router.put('/:id', UserValidator.hasPermission('canUpdateNumbers'), UserValidator.setCookies, async (req, res) => {
    const data = req.body;
    try {
        await MsisdnHelper.updateMsisdn(req.params.id, data);
    } catch (e) {
        console.log(e)
        return res.status(500).json({error: "Could not update MSISDN"});
    }
    return res.status(200).send("MSISDN updated successfully");
});

router.delete('/:id', UserValidator.hasPermission('canDeleteNumbers'), UserValidator.setCookies, async (req, res) => {
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