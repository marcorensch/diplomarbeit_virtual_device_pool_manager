import express from "express";
import ManufacturerHelper from "../helpers/ManufacturerHelper.mjs";
import Manufacturer from "../models/Manufacturer.mjs";
import UserValidator from "../middlewares/UserValidator.mjs";
const router = express.Router();

router.get("/", UserValidator.setCanHandleHiddenInformation, async (req, res) => {
    const manufacturers = await ManufacturerHelper.getManufacturers();
    if(!req.canHandleHiddenInformation) {
        manufacturers.forEach(manufacturer => {
            delete manufacturer.hidden
        });
    }
    res.json(manufacturers);
});

router.get("/:id", UserValidator.setCanHandleHiddenInformation, async (req, res) => {
    const manufacturer = await ManufacturerHelper.getManufacturer(req.params.id);
    if(!req.canHandleHiddenInformation) {
        delete manufacturer[0].hidden
    }
    res.json(manufacturer[0]);
});

router.post("/", async (req, res) => {
    const manufacturer = new Manufacturer();
    manufacturer.setData(req.body)
    const result = await ManufacturerHelper.createManufacturer(manufacturer);
    res.json({id: result.insertId, message: "Manufacturer created"});
});

router.put("/", UserValidator.setCanHandleHiddenInformation, async (req, res) => {
    const manufacturer = new Manufacturer();
    if(!req.canHandleHiddenInformation) {
        delete req.body.hidden
    }
    manufacturer.setData(req.body)
    const result = await ManufacturerHelper.updateManufacturer(manufacturer);
    res.json({message: "Manufacturer updated"});
});

router.delete("/:id", async (req, res) => {
    const result = await ManufacturerHelper.deleteManufacturer(req.params.id);
    res.json(result);
});

export default router;