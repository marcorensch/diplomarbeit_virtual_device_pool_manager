import express from "express";
import UserValidator from "../middlewares/UserValidator.mjs";
import DeviceHelper from "../helpers/DeviceHelper.mjs";
import Device from "../models/Device.mjs";
import {
    checkoutValidator,
    deviceDataValidator,
    deviceSearchValidator,
    weblinkValidator
} from "../middlewares/inputValidators.mjs";
import WeblinksHelper from "../helpers/WeblinksHelper.mjs";
import {PermissionHandler} from "../helpers/PermissionHandler.mjs";

const router = express.Router();

const deviceManagementValidator = async (req, res, next) => {
    const method = req.method === "POST" ? "Create" : "Update";
    const action = req.body.slot_id ? `can${method}Devices` : `can${method}VirtualDevices`;
    if (!req.user?.role) return res.status(403).send({message: "Unauthorized"});
    const permissionHandler = new PermissionHandler();
    const permissionsMap = permissionHandler.getPermissions(req.user.role);
    if (!permissionsMap.has(action)) return res.status(403).send({message: "Forbidden"});

    next();
};

const canCheckInDevice = async (req, res, next) => {
    const userId = req.user.id;
    const deviceId = req.params.id;
    if(!userId) return res.status(403).send({message: "Unauthorized"});
    if(!deviceId) return res.status(400).send({message: "Device ID is required"});
    const permissionHandler = new PermissionHandler();
    const permissionsMap = permissionHandler.getPermissions(req.user.role);
    if (!permissionsMap.has("canCheckoutInDevices")) return res.status(403).send({message: "Forbidden"});
    let device;

    try {
        device = await DeviceHelper.getDeviceById(deviceId);
        if(!device) return res.status(404).send({message: "Device not found"});
    } catch (e) {
        return res.status(500).send({message: "Error while fetching device"});
    }

    if(device.checked_out_by !== userId) {
        if (!permissionsMap.has("canForceCheckinDevices")) return res.status(403).send({message: "Forbidden"});
    }

    req.device = device;

    next();

};

router.get("/", deviceSearchValidator, async (req, res) => {
    const limit = req.query.limit || 20;
    const offset = req.query.offset || 0;
    const searchTerm = req.query.searchTerm || "";

    try {
        const devices = await DeviceHelper.getDevices(limit, offset, searchTerm);
        res.send(devices);
    } catch (e) {
        console.log(e.message);
        res.status(500).send({success: false, message: e.message});
    }
});

router.get("/:id", async (req, res) => {
    const id = req.params.id;
    const device = new Device();
    if (!id) return res.status(400).send({success: false, message: "ID is required"});
    try {
        const deviceData = await DeviceHelper.getDeviceById(id);
        if (!deviceData) return res.status(404).send({success: false, message: "Device not found"});
        device.setData(deviceData);
    } catch (e) {
        console.log(e.message);
        return res.status(500).send({success: false, message: e.message});
    }

    try {
        const weblinks = await WeblinksHelper.getWeblinksByDeviceId(id);
        device.setData({weblinks});
    } catch (e) {
        console.log(e.message);
        return res.status(500).send({success: false, message: "Error getting weblinks"});
    }

    res.send(device);
});

router.post("/", UserValidator.validateTokens, UserValidator.setCookies, deviceDataValidator, deviceManagementValidator, async (req, res) => {

    const device = new Device();
    device.setData(req.body)

    try {
        const result = await DeviceHelper.store(device);
        if (!result.affectedRows) return res.status(500).send({success: false, message: "Device could not be created"});
        device.setData({id: result.insertId});
    } catch (e) {
        console.log(e.message);
        return res.status(500).send({success: false, message: e.message});
    }

    if (device.weblinks.length) {
        try {
            for (const weblink of device.weblinks) {
                const result = await WeblinksHelper.setOrUpdateWeblink(device.id, weblink);
                if (!result.affectedRows) return res.status(500).send({
                    success: false,
                    message: "Device weblink could not be set"
                });
            }
        } catch (e) {
            console.log(e.message);
            return res.status(500).send({success: false, message: e.message});
        }
    }

    if (device.msisdns.length) {
        try {
            for (const msisdn of device.msisdns) {
                const result = await DeviceHelper.setOrUpdateMsisdnLink(device.id, msisdn);
                if (!result.affectedRows) return res.status(500).send({
                    success: false,
                    message: "Device MSISDN link could not be set"
                });
            }
        } catch (e) {
            console.log(e.message);
            return res.status(500).send({success: false, message: e.message});
        }
    }

    res.status(201).send({id: device.id});

});

router.put("/:id", UserValidator.validateTokens, UserValidator.setCookies, deviceDataValidator, async (req, res) => {

    if (!req.params.id) return res.status(400).send({success: false, message: "ID cannot be empty"});

    const device = new Device();
    device.setData({id: req.params.id, ...req.body})

    try {
        const deviceFromDb = await DeviceHelper.getDeviceById(device.id);
        if (!deviceFromDb) return res.status(404).send({success: false, message: "Device not found"});
    } catch (e) {
        return res.status(500).send({success: false, message: "Error checking if device exists"});
    }

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

    if (device.msisdns.length) {
        try {
            for (const msisdn of device.msisdns) {
                const result = await DeviceHelper.setOrUpdateMsisdnLink(device.id, msisdn);
                if (!result.affectedRows) return res.status(500).send({
                    success: false,
                    message: "Device MSISDN link could not be updated"
                });
            }
        } catch (e) {
            console.log(e.message);
            return res.status(500).send({success: false, message: e.message});
        }
    }

    try {
        await DeviceHelper.deleteInactiveMsisdnLinks(device.id, device.msisdns);
    } catch (e) {
        console.log(e.message);
        return res.status(500).send({success: false, message: e.message});
    }

    if (device.weblinks.length) {
        try {
            for (const weblink of device.weblinks) {
                console.log(weblink)
                const result = await WeblinksHelper.setOrUpdateWeblink(device.id, weblink);
                if (!result.affectedRows) return res.status(500).send({
                    success: false,
                    message: "Device weblink could not be updated"
                });
            }
        } catch (e) {
            console.log(e.message);
            return res.status(500).send({success: false, message: e.message});
        }
    }

    try {
        const result = await DeviceHelper.update(device);
        if (!result.affectedRows) return res.status(500).send({success: false, message: "Device could not be updated"});
        const dbData = await DeviceHelper.getDeviceById(req.params.id);
        return res.status(200).send(dbData);
    } catch (e) {
        console.log(e.message);
        return res.status(500).send({success: false, message: e.message});
    }

});

router.delete("/:id", UserValidator.validateTokens, UserValidator.setCookies, UserValidator.hasPermission("canDeleteDevices"), async (req, res) => {
    if (!req.params.id) return res.status(400).send({success: false, message: "ID cannot be empty"});
    try {
        const result = await DeviceHelper.delete(req.params.id);
        if (!result.affectedRows) return res.status(404).send({success: false, message: "Device not found"});
        return res.send({success: true, message: "Device deleted"});
    } catch (e) {
        console.log(e.message);
        return res.status(500).send({success: false, message: e.message});
    }
});

router.post("/:id/weblinks", UserValidator.validateTokens, UserValidator.setCookies, UserValidator.hasPermission("canCreateLinks"), weblinkValidator, async (req, res) => {
    const weblink = req.body;
    const id = req.params.id;
    try {
        const result = await WeblinksHelper.setOrUpdateWeblink(id, weblink);
        if (!result.affectedRows) return res.status(500).send({
            success: false,
            message: "New weblink could not be stored"
        });
        res.status(201).send({success: true, message: "Weblink stored", id: result.insertId});
    } catch (e) {
        if (e.code === 'ER_NO_REFERENCED_ROW_2') return res.status(404).send({
            success: false,
            message: "Device not found"
        });
        return res.status(500).send({success: false, message: e.message});
    }
});

router.post("/:id/checkout", UserValidator.validateTokens, UserValidator.setCookies, UserValidator.hasPermission("canCheckoutInDevices"), checkoutValidator, async (req, res) => {
    const currentUserId = req.user.id;
    const deviceId = req.params.id;
    const checkout_notes = req.body.notes || "";
    const checkout_time = new Date()
    let device;

    try {
        device = await DeviceHelper.getDeviceById(deviceId);
        if (!device) return res.status(404).send({success: false, message: "Device not found"});
    } catch (e) {
        console.log(e.message);
        return res.status(500).send({success: false, message: e.message});
    }

    if (device.checked_out_by) return res.status(403).send({success: false, message: "Device is already checked out"});

    // Checkout device
    try {
        const result = await DeviceHelper.checkoutDevice(deviceId, currentUserId, checkout_notes, checkout_time);
        if (!result.affectedRows) return res.status(500).send({
            success: false,
            message: "Device could not be checked out"
        });
    } catch (e) {
        console.log(e.message);
        return res.status(500).send({success: false, message: e.message});
    }

    return res.status(200).send({success: true, message: "Device checked out", checkout_notes, checked_out_by: currentUserId, checkout_time});
});

router.post("/:id/checkin", UserValidator.validateTokens, UserValidator.setCookies, canCheckInDevice, async (req, res) => {

    // Get device
    let device;
    try {
        device = await DeviceHelper.getDeviceById(req.device.id);
        if (!device) return res.status(404).send({success: false, message: "Device not found"});
    }catch (e) {
        console.log(e.message);
        return res.status(500).send({success: false, message: e.message});
    }

    // Check if device is checked out
    if (!device.checked_out_by) return res.status(403).send({success: false, message: "Device is not checked out"});



    try {
        const result = await DeviceHelper.checkinDevice(req.device.id);
        if (!result.affectedRows) return res.status(500).send({
            success: false,
            message: "Device could not be checked in"
        });
    } catch (e) {
        console.log(e.message);
        return res.status(500).send({success: false, message: e.message});
    }

    return res.status(200).send({success: true, message: "Device checked in"});
});

export default router;