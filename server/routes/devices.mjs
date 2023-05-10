import express from "express";
import UserValidator from "../middlewares/UserValidator.mjs";
import DeviceHelper from "../helpers/DeviceHelper.mjs";
import Device from "../models/Device.mjs";
import {deviceDataValidator} from "../middlewares/inputValidators.mjs";

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

router.get("/search", async (req, res) => {

});

router.get("/:id", async (req, res) => {
    const id = req.params.id;
    if(!id) return res.status(400).send({success: false, message: "ID is required"});
    try{
        const device = await DeviceHelper.getDeviceById(id);
        console.log(device)
        if(!device.length) return res.status(404).send({success: false, message: "Device not found"});
        res.send(device[0]);
    }catch (e) {
        console.log(e.message);
        res.status(500).send({success: false, message: e.message});
    }
});

router.post("/", UserValidator.validateTokens, UserValidator.setCookies, async (req, res) => {

    const device = new Device();
    device.setData(req.body)

    if (device.slot_id) {
        if (!UserValidator.hasPermission("canCreateDevices")) return res.status(403).send({
            success: false,
            message: "You do not have permission to create devices"
        });
    } else {
        if (!UserValidator.hasPermission("canCreateVirtualDevices")) return res.status(403).send({
            success: false,
            message: "You do not have permission to create virtual devices"
        });
    }

    try{
        const result = await DeviceHelper.store(device);
        if(!result.affectedRows) return res.status(500).send({success: false, message: "Device could not be created"});
        device.setData({id: result.insertId});
    }catch (e){
        console.log(e.message);
        res.status(500).send({success: false, message: e.message});
    }

    if(device.msisdns.length) {
        try {
            for (const msisdn of device.msisdns) {
                const result = await DeviceHelper.setOrUpdateMsisdnLink(device.id, msisdn);
                if (!result.affectedRows) return res.status(500).send({
                    success: false,
                    message: "Device MSISDN link could not be set"
                });
            }
        }catch (e){
            console.log(e.message);
            res.status(500).send({success: false, message: e.message});
        }
    }

    res.status(201).send({id: device.id});

});

router.put("/:id", UserValidator.validateTokens, UserValidator.setCookies, deviceDataValidator, async (req, res) => {

    if (!req.params.id) return res.status(400).send({success: false, message: "ID cannot be empty"});

    const device = new Device();
    device.setData(req.body)
    device.setData({id: req.params.id})

    if (device.slot_id) {
        if (!UserValidator.hasPermission("canUpdateDevices")) return res.status(403).send({
            success: false,
            message: "You do not have permission to update devices"
        });
    } else {
        if (!UserValidator.hasPermission("canUpdateVirtualDevices")) return res.status(403).send({
            success: false,
            message: "You do not have permission to update virtual devices"
        });
    }

    if(device.msisdns.length) {
        console.log(device.msisdns)
        try {
            for (const msisdn of device.msisdns) {
                const result = await DeviceHelper.setOrUpdateMsisdnLink(device.id, msisdn);
                if (!result.affectedRows) return res.status(500).send({
                    success: false,
                    message: "Device MSISDN link could not be updated"
                });
            }
        }catch (e){
            console.log(e.message);
            res.status(500).send({success: false, message: e.message});
        }
    }

    try{
        const msisdnsString = device.msisdns.length ? device.msisdns.join(",") : "";
        const result = await DeviceHelper.deleteInactiveMsisdnLinks(device.id, device.msisdns);
        console.log(result)
    }catch (e) {
        console.log(e.message);
        res.status(500).send({success: false, message: e.message});
    }

    try{
        const result = await DeviceHelper.update(device);
        console.log(result)
        res.status(201).send(result);
    }catch (e){
        console.log(e.message);
        res.status(500).send({success: false, message: e.message});
    }

});

export default router;