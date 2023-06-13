import express from "express";
import {guidesSearchValidator} from "../middlewares/inputValidators.mjs";
import GuidesHelper from "../helpers/GuidesHelper.mjs";

const router = express.Router();

router.get("/", guidesSearchValidator, async (req, res) => {
    const limit = req.query.limit ? parseInt(req.query.limit) : 20;
    const page = req.query.page ? parseInt(req.query.page) : 1;
    const search = req.query.search && req.query.search.length ? req.query.search : null;
    const visibility = true;

    try {
        const data = await GuidesHelper.getGuides(limit, page, search, visibility);
        if (data.guides === null) return res.status(500).json({success: false, message: "Failed to get guides"});
        return res.status(200).json({
            success: true,
            message: "Guides retrieved successfully",
            guides: data.guides,
            total_count: data.count
        });
    } catch (e) {
        return res.status(500).json({success: false, message: e.message});
    }
})

router.get("/:id", async (req, res) => {
    try {
        const guide = await GuidesHelper.getGuide(req.params.id);
        if (guide === null) return res.status(404).json({success: false, message: "Guide not found"});
        const slides = await GuidesHelper.getSlides(req.params.id);
        return res.status(200).json({success: true, message: "Guide retrieved successfully", guide, slides});
    } catch (e) {
        return res.status(500).json({success: false, message: e.message});
    }
})

export default router;