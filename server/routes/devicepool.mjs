import express from "express";
import UserValidator from "../middlewares/UserValidator.mjs";
import PoolHelper from "../helpers/PoolHelper.mjs";

const router = express.Router();
router.use(UserValidator.setCanHandleHiddenInformation)

router.get("/items", async (req, res) => {
    const categoryAlias = req.query.category || false;
    const parent_id = req.query.location || false;
    let category;
    let items = [];
    if(!categoryAlias)
        return res.status(400).send({message: "No category specified"});
    try {
        category = await PoolHelper.getCategoryByAlias(categoryAlias);
    }catch (e) {
        console.log(e)
        return res.status(500).send({message: "Could not get Category ID"});
    }

    if(!category.id)
        return res.status(400).send({message: "Category not found"});

    if(parent_id && !Number.isInteger(parseInt(parent_id)))
        return res.status(400).send({message: "Invalid parent ID"});

    try {
        items = await PoolHelper.getItems(category.id, parent_id);
    }catch (e) {
        console.log(e)
        return res.status(500).send({message: "Could not get Items"});
    }

    if(!req.canHandleHiddenInformation) {
        items.forEach(item => {
            if(item.hasOwnProperty("hidden")) delete item.hidden;
        });
    }

    return res.status(200).send(items);
});

router.get("/items/:id", async (req, res) => {
    const id = req.params.id || false;
    const deep = req.query.deep || false;
    let item;
    if (!id) return res.status(400).send({message: "No ID specified"});

    try {
        item = await PoolHelper.getItem(id, deep);
        console.log(item)
    } catch (e) {
        if(e.type === "ITEM_NOT_FOUND") return res.status(404).send({message: "Item not found"});
        if(e.type === "NO_ID_SPECIFIED") return res.status(400).send({message: "No ID specified"});
        console.log(e)
        return res.status(500).send({message: "Could not get Item"});
    }

    if(!req.canHandleHiddenInformation) {
        if(item && item.hasOwnProperty("hidden")) delete item.hidden;
    }

    return res.status(200).send(item);
});


export default router;