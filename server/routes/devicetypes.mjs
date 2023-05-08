import express from "express";
import DeviceHelper from "../helpers/DeviceHelper.mjs";
const router = express.Router();

router.get("/", async (req, res) => {
    const deviceTypes = await DeviceHelper.getDeviceTypes();
    res.send(deviceTypes);
});

export default router;