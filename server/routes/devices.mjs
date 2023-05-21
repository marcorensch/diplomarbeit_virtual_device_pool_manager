import express from "express";
import UserValidator from "../middlewares/UserValidator.mjs";
import DeviceHelper from "../helpers/DeviceHelper.mjs";
import Device from "../models/Device.mjs";
import {deviceDataValidator, weblinkValidator } from "../middlewares/inputValidators.mjs";
import WeblinksHelper from "../helpers/WeblinksHelper.mjs";

const router = express.Router();

router.get("/", async (req, res) => {
    const limit = req.query.limit || 10;
    const offset = req.query.offset || 0;

    try{
        const devices = await DeviceHelper.getDevices(limit, offset);
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
    const device = new Device();
    if(!id) return res.status(400).send({success: false, message: "ID is required"});
    try{
        const deviceData = await DeviceHelper.getDeviceById(id);
        if(!deviceData) return res.status(404).send({success: false, message: "Device not found"});
        device.setData(deviceData);
    }catch (e) {
        console.log(e.message);
        return res.status(500).send({success: false, message: e.message});
    }

    try{
        const weblinks = await WeblinksHelper.getWeblinksByDeviceId(id);
        device.setData({weblinks});
    }catch (e) {
        console.log(e.message);
        return res.status(500).send({success: false, message: "Error getting weblinks"});
    }

    res.send(device);
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
        return res.status(500).send({success: false, message: e.message});
    }

    if(device.weblinks.length) {
        try {
            for (const weblink of device.weblinks) {
                const result = await WeblinksHelper.setOrUpdateWeblink(device.id, weblink);
                if (!result.affectedRows) return res.status(500).send({
                    success: false,
                    message: "Device weblink could not be set"
                });
            }
        }catch (e){
            console.log(e.message);
            return res.status(500).send({success: false, message: e.message});
        }
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
            return res.status(500).send({success: false, message: e.message});
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
            return res.status(500).send({success: false, message: e.message});
        }
    }

    try{
        const result = await DeviceHelper.deleteInactiveMsisdnLinks(device.id, device.msisdns);
        console.log(result)
    }catch (e) {
        console.log(e.message);
        return res.status(500).send({success: false, message: e.message});
    }

    if(device.weblinks.length) {
        try {
            for (const weblink of device.weblinks) {
                const result = await WeblinksHelper.setOrUpdateWeblink(device.id, weblink);
                if (!result.affectedRows) return res.status(500).send({
                    success: false,
                    message: "Device weblink could not be updated"
                });
            }
        }catch (e){
            console.log(e.message);
            return res.status(500).send({success: false, message: e.message});
        }
    }

    try{
        const result = await DeviceHelper.update(device);
        console.log(result)
        return res.status(201).send(result);
    }catch (e){
        console.log(e.message);
        return res.status(500).send({success: false, message: e.message});
    }

});

router.post("/:id/weblinks", UserValidator.validateTokens, UserValidator.setCookies, UserValidator.hasPermission("canCreateLinks"), weblinkValidator, async (req, res) => {
    const weblink = req.body;
    const id = req.params.id;
    const result = await WeblinksHelper.setOrUpdateWeblink(id, weblink);
    if (!result.affectedRows) return res.status(500).send({
        success: false,
        message: "New weblink could not be stored"
    });
    res.status(201).send({success: true, message: "Weblink stored"});
});
export default router;