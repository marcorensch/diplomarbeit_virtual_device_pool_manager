import express from "express";
import UserValidator from "../middlewares/UserValidator.mjs";
import {guideValidator, slideValidator} from "../middlewares/inputValidators.mjs";
import GuidesHelper from "../helpers/GuidesHelper.mjs";

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const guides = await GuidesHelper.getGuides();
        if (guides === null) return res.status(500).json({success: false, message: "Failed to get guides"});
        return res.status(200).json({success: true, message: "Guides retrieved successfully", guides});
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

router.post('/:guide_id/slides', UserValidator.hasPermission('canManageGuides'), slideValidator, async (req, res) => {
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
    slideData.content = slideData.content || "";
    try{
        const id = await GuidesHelper.updateSlide(slideData);
        if (id === null) return res.status(500).json({success: false, message: "Failed to create slide"});
        return res.status(200).json({success: true, message: "Slide created successfully", id});
    } catch (e) {
        return res.status(500).json({success: false, message: e.message});
    }
});

export default router;