import express from "express";
import PoolBuilderHelper from "../helpers/PoolBuilderHelper.mjs";
import BuilderItem from "../models/BuilderItem.mjs";

const router = express.Router();

router.get("/", async (req, res) => {
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

router.get("/categories", async (req, res) => {
    try {
        const result = await PoolBuilderHelper.getCategories();
        return res.status(200).json(result);
    } catch (e) {
        console.log(e)
        return res.status(500).json({error: "Could not get Builder Categories"});
    }
});

router.post("/", async (req, res) => {
    let categories;
    const data = req.body || false;
    console.log(data)
    if (!data.category_id) return res.status(400).json({error: "No type specified"});

    try {
        categories = await PoolBuilderHelper.getCategories();
    } catch (e) {
        console.log(e)
        return res.status(500).json({error: "Could not get Builder Categories"});
    }

    const category = categories.find(category => category.id === data.category_id);
    if (!category) return res.status(400).json({error: "Invalid category specified"});

    const builderItem = new BuilderItem();
    builderItem.setData(data);

    switch (category.name) {
        case "Location":
            if (!builderItem.name) return res.status(400).json({error: "No name specified"});
            try {
                const result = await PoolBuilderHelper.storeItem(builderItem);
                if(!result || result.affectedRows===0) return res.status(500).json({error: "Could not create Location"});
                builderItem.id = result.insertId;
                return res.status(200).json(builderItem);
            }catch (e) {
                if(e.code==="ER_DUP_ENTRY") return res.status(400).json({error: "Location already exists"});
                return res.status(500).json({error: "Could not create Location"});
            }
            break;
        case "Cabinet":
            //
            break;
        case "Row":
            //
            break;
        case "Slot":
            //
            break;
        default:
            return res.status(400).json({error: "Invalid category specified"});
    }

});

export default router;