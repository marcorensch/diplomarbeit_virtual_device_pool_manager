import express from "express";
import UserValidator from "../middlewares/UserValidator.mjs";
import DeviceHelper from "../helpers/DeviceHelper.mjs";
import Device from "../models/Device.mjs";

const router = express.Router();

router.get("/", async (req, res) => {
    const limit = req.query.limit || 10;
    const offset = req.query.offset || 0;

    try{
        const devices = await DeviceHelper.getDevices(limit, offset);
        console.log(devices)
        res.send(devices);
    }catch (e) {
        console.log(e.message);
        res.status(500).send({success: false, message: e.message});
    }
});

router.post("/", UserValidator.validateTokens, UserValidator.setCookies, async (req, res) => {

    const device = new Device();
    device.setData(req.body)

    console.log(device)

    if (device.slot_id) {
        if (!UserValidator.hasPermission("canUpdateDevices")) return res.status(403).send({
            success: false,
            message: "You do not have permission to update this device"
        });
    } else {
        if (!UserValidator.hasPermission("canUpdateVirtualDevices")) return res.status(403).send({
            success: false,
            message: "You do not have permission to update this device"
        });
    }

    try{
        const result = await DeviceHelper.store(device);
        console.log(result)
        res.status(201).send(result);
    }catch (e){
        console.log(e.message);
        res.status(500).send({success: false, message: e.message});
    }
});

router.put("/:id", UserValidator.validateTokens, UserValidator.setCookies, (req, res) => {

    if (!req.params.id) return res.status(400).send({success: false, message: "ID cannot be empty"});

    const deviceData = req.body;
    deviceData.id = req.params.id;

    if (deviceData.slot_id) {
        if (!UserValidator.hasPermission("canUpdateDevices")) return res.status(403).send({
            success: false,
            message: "You do not have permission to update this device"
        });
    } else {
        if (!UserValidator.hasPermission("canUpdateVirtualDevices")) return res.status(403).send({
            success: false,
            message: "You do not have permission to update this device"
        });
    }

});

export default router;