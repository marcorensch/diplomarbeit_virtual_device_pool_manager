import express from "express";
import ManufacturerHelper from "../helpers/ManufacturerHelper.mjs";
import Manufacturer from "../models/Manufacturer.mjs";
const router = express.Router();

router.get("/", async (req, res) => {
    const manufacturers = await ManufacturerHelper.getManufacturers();
    res.json(manufacturers);
});

router.get("/:id", async (req, res) => {
    const manufacturer = await ManufacturerHelper.getManufacturer(req.params.id);
    res.json(manufacturer[0]);
});

router.post("/", async (req, res) => {
    const manufacturer = new Manufacturer();
    manufacturer.setData(req.body)
    const result = await ManufacturerHelper.createManufacturer(manufacturer);
    res.json({id: result.insertId, message: "Manufacturer created"});
});

router.put("/", async (req, res) => {
    const manufacturer = new Manufacturer();
    manufacturer.setData(req.body)
    const result = await ManufacturerHelper.updateManufacturer(manufacturer);
    res.json({message: "Manufacturer updated"});
});

router.delete("/:id", async (req, res) => {
    const result = await ManufacturerHelper.deleteManufacturer(req.params.id);
    res.json(result);
});

export default router;