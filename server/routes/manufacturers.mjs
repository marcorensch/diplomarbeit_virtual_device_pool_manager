import express from "express";
import ManufacturerHelper from "../helpers/ManufacturerHelper.mjs";
import Manufacturer from "../models/Manufacturer.mjs";
import UserValidator from "../middlewares/UserValidator.mjs";
import {manufacturerDataValidator} from "../middlewares/inputValidators.mjs";
const router = express.Router();

router.get("/", UserValidator.setCanHandleHiddenInformation, async (req, res) => {
    const manufacturers = await ManufacturerHelper.getManufacturers();
    if(!req.canHandleHiddenInformation) {
        manufacturers.forEach(manufacturer => {
            if(manufacturer.hasOwnProperty("hidden")) delete manufacturer.hidden;
        });
    }
    res.json(manufacturers);
});

router.get("/:id", UserValidator.setCanHandleHiddenInformation, async (req, res) => {
    const manufacturer = await ManufacturerHelper.getManufacturer(req.params.id);
    if(!req.canHandleHiddenInformation && manufacturer && manufacturer.hasOwnProperty("hidden")) {
        delete manufacturer.hidden
    }
    res.json(manufacturer);
});

router.post("/", UserValidator.validateTokens, UserValidator.setCookies, UserValidator.hasPermission("canCreateManufacturer"), manufacturerDataValidator, async (req, res) => {
    const manufacturer = new Manufacturer();
    manufacturer.setData(req.body)
    const result = await ManufacturerHelper.createManufacturer(manufacturer);
    res.json({id: result.insertId, message: "Manufacturer created"});
});

router.put("/", UserValidator.validateTokens, UserValidator.setCookies, UserValidator.hasPermission("canUpdateManufacturer"), UserValidator.setCanHandleHiddenInformation, async (req, res) => {
    const manufacturer = new Manufacturer();
    if(!req.canHandleHiddenInformation) {
        delete req.body.hidden
    }
    manufacturer.setData(req.body)
    const result = await ManufacturerHelper.updateManufacturer(manufacturer);
    res.json({message: "Manufacturer updated"});
});

router.delete("/:id", UserValidator.validateTokens, UserValidator.setCookies, UserValidator.hasPermission("canDeleteManufacturer"), async (req, res) => {
    const result = await ManufacturerHelper.deleteManufacturer(req.params.id);
    res.json(result);
});

export default router;