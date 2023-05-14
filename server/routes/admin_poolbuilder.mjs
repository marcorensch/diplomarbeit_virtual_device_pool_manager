import express from "express";
import PoolBuilderHelper from "../helpers/PoolBuilderHelper.mjs";
import BuilderItem from "../models/BuilderItem.mjs";
import {poolBuilderValidator} from "../middlewares/inputValidators.mjs";

const router = express.Router();

router.get("/items", async (req, res) => {
    const category_id = req.query.category_id || false;
    const parent_id = req.query.parent_id || false;

    if (!category_id) return res.status(400).json({error: "No category specified"});

    try {
        const items = await PoolBuilderHelper.getItems(category_id, parent_id);
        return res.status(200).json(items);
    } catch (e) {
        console.log(e)
        return res.status(500).json({error: "Could not get Items"});
    }
});

router.get("/items/:id", async (req, res) => {
    const id = req.params.id || false;
    if (!id) return res.status(400).json({error: "No ID specified"});

    try {
        const result = await PoolBuilderHelper.getItem(id);
        return res.status(200).json(result);
    } catch (e) {
        console.log(e)
        return res.status(500).json({error: "Could not get Item"});
    }
});

router.get("/categories", async (req, res) => {
    try {
        const result = await PoolBuilderHelper.getCategories();
        return res.status(200).json(result);
    } catch (e) {
        console.log(e)
        return res.status(500).json({error: "Could not get Builder Categories"});
    }
});

router.post("/items", poolBuilderValidator, async (req, res) => {
    let categories;
    let builderItem;
    const data = req.body || false;
    if (!data) return res.status(400).json({error: "No data specified"});
    if (!data.category_id) return res.status(400).json({error: "No type specified"});

    try {
        categories = await PoolBuilderHelper.getCategories();
    } catch (e) {
        console.log(e)
        return res.status(500).json({error: "Could not get Builder Categories"});
    }

    const category = categories.find(category => category.id === data.category_id);
    if (!category) return res.status(400).json({error: "Invalid category specified"});

    builderItem = new BuilderItem();
    builderItem.setData(data);

    if (!builderItem.name) return res.status(400).json({error: "No name specified"});
    try {
        const result = await PoolBuilderHelper.storeItem(builderItem);
        if(!result || result.affectedRows===0) return res.status(500).json({error: `Could not create ${category.name}`});
        builderItem.id = result.insertId;
        return res.status(200).json(builderItem);
    }catch (e) {
        return res.status(500).json({error: `Could not create ${category.name}`});
    }
});

router.put("/items/:id", poolBuilderValidator, async (req, res) => {
    const id = req.params.id || null;
    const data = req.body || false;
    if (!id) return res.status(400).json({error: "No id specified"});
    if (!data) return res.status(400).json({error: "No data specified"});
    if(parseInt(id) !== parseInt(data.id)) return res.status(400).json({error: "Invalid id specified"});
    const builderItem = new BuilderItem();
    builderItem.setData(data);
    try {
        const result = await PoolBuilderHelper.updateItem(id, builderItem);
        if(!result || result.affectedRows===0) return res.status(500).json({error: "Could not update Item"});
        return res.status(200).json({message: "Item updated successfully"});
    }catch (e) {
        console.log(e)
        return res.status(500).json({error: "Could not update Item"});
    }
});

router.delete("/items/:id", async (req, res) => {
    const id = req.params.id || false;
    if (!id) return res.status(400).json({error: "No id specified"});
    try {
        const result = await PoolBuilderHelper.deleteItem(id);
        if(!result || result.affectedRows===0) return res.status(500).json({error: "Could not delete Item"});
        return res.status(200).json({message: "Item deleted successfully"});
    }catch (e) {
        console.log(e)
        return res.status(500).json({error: "Could not delete Item"});
    }
});

router.post("/items/sort", async (req, res) => {
    const sortMap = req.body || false;
    if(!sortMap || !sortMap.length) return res.status(400).json({error: "No sort map specified"});
    for (const sortMapElement of sortMap) {
        if(!sortMapElement.id || !sortMapElement.sorting) return res.status(400).json({error: "Invalid sort map specified"});
    }
    try{
        await PoolBuilderHelper.sortItems(sortMap);
        return res.status(200).json({message: "Items sorted successfully"});
    }catch (e) {
        console.log(e)
        return res.status(500).json({error: "Could not sort items"});
    }
});

export default router;