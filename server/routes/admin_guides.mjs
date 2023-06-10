import express from "express";
import UserValidator from "../middlewares/UserValidator.mjs";
import {guidesSearchValidator, guideValidator, slideValidator} from "../middlewares/inputValidators.mjs";
import GuidesHelper from "../helpers/GuidesHelper.mjs";

const router = express.Router();
router.use(UserValidator.hasPermission("canManageGuides"));


router.get('/', guidesSearchValidator, async (req, res) => {
    const limit = req.query.limit ? parseInt(req.query.limit) : 20;
    const page = req.query.page ? parseInt(req.query.page) : 1;
    const search = req.query.search && req.query.search.length ? req.query.search : null;
    const visibility = req.query.visibility && req.query.visibility.length ? req.query.visibility === "true" : null;

    try {
        const data = await GuidesHelper.getGuides(limit, page, search, visibility);
        if (data.guides === null) return res.status(500).json({success: false, message: "Failed to get guides"});
        return res.status(200).json({success: true, message: "Guides retrieved successfully", guides:data.guides, total_count: data.count});
    }catch (e) {
        return res.status(500).json({success: false, message: e.message});
    }
});

router.get('/:id', async (req, res) => {
    try {
        const guide = await GuidesHelper.getGuide(req.params.id);
        if (guide === null) return res.status(500).json({success: false, message: "Failed to get guide"});
        return res.status(200).json({success: true, message: "Guide retrieved successfully", guide});
    }catch (e) {
        return res.status(500).json({success: false, message: e.message});
    }
});

router.post('/', UserValidator.hasPermission('canCreateGuides'), guideValidator, async (req, res) => {
    const guideData = req.body;
    guideData.description = guideData.description || "";
    console.log(guideData)
    try{
        const guide = await GuidesHelper.createGuide(guideData);
        if (guide === null) return res.status(500).json({success: false, message: "Failed to create guide"});
        return res.status(200).json({success: true, message: "Guide created successfully", guide});
    } catch (e) {
        return res.status(500).json({success: false, message: e.message});
    }
});

router.put('/:id', UserValidator.hasPermission('canUpdateGuides'), guideValidator, async (req, res) => {
    const guideData = req.body;
    guideData.description = guideData.description || "";
    try{
        const guide = await GuidesHelper.updateGuide(req.params.id, guideData);
        if (guide === null) return res.status(500).json({success: false, message: "Failed to update guide"});
        return res.status(200).json({success: true, message: "Guide updated successfully", guide});
    } catch (e) {
        return res.status(500).json({success: false, message: e.message});
    }
});

router.delete('/:id', UserValidator.hasPermission('canDeleteGuides'), async (req, res) => {
    console.log(req.params.id)
    try{
        const status = await GuidesHelper.deleteGuide(req.params.id);
        if (!status) return res.status(500).json({success: false, message: "Failed to delete guide"});
        return res.status(200).json({success: true, message: "Guide deleted successfully"});
    } catch (e) {
        return res.status(500).json({success: false, message: e.message});
    }
});

// Slides

router.get('/:guide_id/slides', async (req, res) => {
    try {
        const slides = await GuidesHelper.getSlides(req.params.guide_id);
        if (slides === null) return res.status(500).json({success: false, message: "Failed to get slides"});
        return res.status(200).json({success: true, message: "Slides retrieved successfully", slides});
    }catch (e) {
        return res.status(500).json({success: false, message: e.message});
    }
});

router.get('/:guide_id/slides/:id', async (req, res) => {
    const guideId = req.params.guide_id; // Guide ID wird aktuell nicht verwendet
    const slideId = req.params.id;
    try {
        const slide = await GuidesHelper.getSlide(slideId);
        if (slide === null) return res.status(500).json({success: false, message: "Failed to get slide"});
        return res.status(200).json({success: true, message: "Slide retrieved successfully", slide});
    }catch (e) {
        return res.status(500).json({success: false, message: e.message});
    }
});

router.post('/:guide_id/slides', slideValidator, async (req, res) => {
    const slideData = req.body;
    slideData.content = slideData.content || "";
    try{
        const id = await GuidesHelper.createSlide(slideData);
        if (id === null) return res.status(500).json({success: false, message: "Failed to create slide"});
        return res.status(200).json({success: true, message: "Slide created successfully", id});
    } catch (e) {
        return res.status(500).json({success: false, message: e.message});
    }
});

router.put('/:guide_id/slides/:id', UserValidator.hasPermission('canManageGuides'), slideValidator, async (req, res) => {
    const slideData = req.body;
    const action = req.query.action || null;
    slideData.content = slideData.content || "";
    try{
        const id = await GuidesHelper.updateSlide(slideData, action);
        if (id === null) return res.status(500).json({success: false, message: "Failed to create slide"});
        return res.status(200).json({success: true, message: "Slide created successfully", id});
    } catch (e) {
        return res.status(500).json({success: false, message: e.message});
    }
});

router.delete('/:guide_id/slides/:id', UserValidator.hasPermission('canManageGuides'), async (req, res) => {
    const guideId = req.params.guide_id; // Guide ID wird aktuell nicht verwendet
    const slideId = req.params.id;
    if(!slideId) return res.status(500).json({success: false, message: "Failed to delete slide"});
    try{
        const status = await GuidesHelper.deleteSlide(slideId);
        if (!status) return res.status(500).json({success: false, message: "Failed to delete slide"});
        return res.status(200).json({success: true, message: "Slide deleted successfully"});
    } catch (e) {
        return res.status(500).json({success: false, message: e.message});
    }
});

export default router;