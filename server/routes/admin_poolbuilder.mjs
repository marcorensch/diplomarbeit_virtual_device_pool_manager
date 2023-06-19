import express from "express";
import PoolBuilderHelper from "../helpers/PoolBuilderHelper.mjs";
import BuilderItem from "../models/BuilderItem.mjs";
import {poolBuilderValidator} from "../middlewares/inputValidators.mjs";
import UserValidator from "../middlewares/UserValidator.mjs";

const router = express.Router();
router.use(UserValidator.hasPermission("canAccessPoolBuilder"));

router.get("/items", async (req, res) => {
    const category_id = req.query.category_id || false;
    const parent_id = req.query.parent_id || false;

    if (!category_id) return res.status(400).send({message: "No category specified"});

    try {
        const items = await PoolBuilderHelper.getItems(category_id, parent_id);
        return res.status(200).send(items);
    } catch (e) {
        console.log(e)
        return res.status(500).send({message: "Could not get Items"});
    }
});

router.get("/items/:id", async (req, res) => {
    const id = req.params.id || false;
    if (!id) return res.status(400).send({message: "No ID specified"});

    try {
        const result = await PoolBuilderHelper.getItem(id);
        return res.status(200).send(result);
    } catch (e) {
        if(e.type === "ITEM_NOT_FOUND") return res.status(404).send({message: "Item not found"});
        if(e.type === "NO_ID_SPECIFIED") return res.status(400).send({message: "No ID specified"});
        console.log(e)
        return res.status(500).send({message: "Could not get Item"});
    }
});

router.get("/categories", async (req, res) => {
    try {
        const result = await PoolBuilderHelper.getCategories();
        return res.status(200).send(result);
    } catch (e) {
        console.log(e)
        return res.status(500).send({message: "Could not get Builder Categories"});
    }
});

router.post("/items", UserValidator.hasPermission('canCreatePoolBuilderItem'), poolBuilderValidator,  async (req, res) => {
    let categories;
    let builderItem;
    const data = req.body || false;
    if (!data) return res.status(400).send({message: "No data specified"});
    if (!data.category_id) return res.status(400).send({message: "No type specified"});

    try {
        categories = await PoolBuilderHelper.getCategories();
    } catch (e) {
        console.log(e)
        return res.status(500).send({message: "Could not get Builder Categories"});
    }

    const category = categories.find(category => category.id === data.category_id);
    if (!category) return res.status(400).send({message: "Invalid category specified"});

    builderItem = new BuilderItem();
    builderItem.setData(data);

    if (!builderItem.name) return res.status(400).send({message: "Name cannot be empty"});
    try {
        const result = await PoolBuilderHelper.storeItem(builderItem);
        if(!result || result.affectedRows===0) return res.status(500).send({message: `Could not create ${category.name}`});
        builderItem.id = result.insertId;
        return res.status(201).send(builderItem);
    }catch (e) {
        return res.status(500).send({message: `Could not create ${category.name}`});
    }
});

router.put("/items/:id", UserValidator.hasPermission('canUpdatePoolBuilderItem'), poolBuilderValidator,  async (req, res) => {
    const id = req.params.id || null;
    const data = req.body || false;
    if (!id) return res.status(400).send({message: "No id specified"});
    if(parseInt(id) !== parseInt(data.id)) return res.status(400).send({message: "Invalid id specified"});
    const builderItem = new BuilderItem();
    builderItem.setData(data);
    try {
        const result = await PoolBuilderHelper.updateItem(id, builderItem);
        if(!result || result.affectedRows===0) return res.status(500).send({message: "Could not update Item"});
        return res.status(200).send({message: "Item updated successfully"});
    }catch (e) {
        console.log(e)
        return res.status(500).send({message: "Could not update Item"});
    }
});

router.delete("/items/:id", UserValidator.hasPermission('canDeletePoolBuilderItem'),async (req, res) => {
    const id = req.params.id || false;
    if (!id) return res.status(400).send({message: "No id specified"});
    try {
        const result = await PoolBuilderHelper.deleteItem(id);
        if(!result || result.affectedRows===0) return res.status(500).send({message: "Could not delete Item"});
        return res.status(200).send({message: "Item deleted successfully"});
    }catch (e) {
        console.log(e)
        return res.status(500).send({message: "Could not delete Item"});
    }
});

router.post("/items/sort", UserValidator.hasPermission('canUpdatePoolBuilderItem'), async (req, res) => {
    const sortMap = req.body || false;
    if(!sortMap || !sortMap.length) return res.status(400).send({message: "No sort map specified"});
    for (const sortMapElement of sortMap) {
        if(!sortMapElement.id || !sortMapElement.sorting) return res.status(400).send({message: "Invalid sort map specified"});
    }
    try{
        await PoolBuilderHelper.sortItems(sortMap);
        return res.status(200).send({message: "Items sorted successfully"});
    }catch (e) {
        console.log(e)
        return res.status(500).send({message: "Could not sort items"});
    }
});

export default router;