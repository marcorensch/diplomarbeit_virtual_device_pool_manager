import express from "express";
import UserValidator from "../middlewares/UserValidator.mjs";
import MsisdnHelper from "../helpers/MsisdnHelper.mjs";
import msisdnValidator from "../middlewares/msisdnValidator.mjs";

const router = express.Router();

router.use(UserValidator.setCanHandleHiddenInformation);

router.get('/', UserValidator.hasPermission('canAccessMsisdnManager'), async (req, res) => {
    const parentOnly = req.query.parentOnly || false;
    let numbers = [];
    try {
        numbers = await MsisdnHelper.getAllMsisdns(parentOnly, false);
    }catch (e) {
        console.log(e)
        return res.status(500).json({error: "Could not get MSISDN's"});
    }

    if (!req.canHandleHiddenInformation) {
        numbers.forEach(number => {
            delete number.hidden
        });
    }

    return res.status(200).json(numbers);
});

router.get('/:id', UserValidator.hasPermission('canUpdateMsisdn'), async (req, res) => {
    let number;
    try {
        number = await MsisdnHelper.getMsisdnById(req.params.id);
    }catch (e) {
        console.log(e)
        return res.status(500).json({error: "Could not get MSISDN"});
    }

    if (!req.canHandleHiddenInformation && number && number.hasOwnProperty("hidden")) {
        delete number.hidden
    }
    return res.status(200).json(number);
});

router.post('/', UserValidator.hasPermission('canCreateMsisdn'), msisdnValidator, async (req, res) => {
    const data = req.body;
    if(!req.canHandleHiddenInformation) {
        delete data.hidden
    }
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

router.put('/:id', UserValidator.hasPermission('canUpdateMsisdn'), msisdnValidator, async (req, res) => {
    const data = req.body;
    if(!req.canHandleHiddenInformation) {
        delete data.hidden
    }
    try {
        const res = await MsisdnHelper.updateMsisdn(req.params.id, data);
        if(!res.affectedRows) return res.status(500).json({error: "Could not update MSISDN"});
    } catch (e) {
        console.log(e)
        return res.status(500).json({error: "Could not update MSISDN"});
    }
    return res.status(200).send("MSISDN updated successfully");
});

router.delete('/:id', UserValidator.hasPermission('canDeleteMsisdn'), async (req, res) => {
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