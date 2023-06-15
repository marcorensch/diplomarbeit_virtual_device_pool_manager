import {body, query, validationResult} from 'express-validator';

const deviceDataValidator = [
    body('name').exists().withMessage("Name is required").isLength({min:5, max:50}).withMessage("The name must have between 5 and 50 characters").escape().trim(),
    body('notes').optional().escape().trim(),
    body('hidden').optional().escape().trim(),
    body('params').optional().escape().trim(),
    body('device_type_id').exists().withMessage("Device Type is required").isNumeric().withMessage("Device Type must be a number"),
    body('added').exists().withMessage("Added date is required").isISO8601().withMessage("Added date must be a valid date in ISO8601 format"),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).send({success: false, message: errors.array()[0].msg});
        }
        next()
    },
];

const poolBuilderValidator = [
    body('name').exists().withMessage("Name is required").isLength({min:1}).withMessage("Name must be at least 1 character long").escape().trim(),
    body('category_id').exists().withMessage("Category is required").isNumeric().withMessage("Category must be a number"),
    body('parent_id').optional({checkFalsy: true}).isNumeric().withMessage("Parent must be a number"),
    body('description').optional().escape().trim(),
    body('hidden').optional().escape().trim(),
    body('params').optional().trim().custom((value) => {
        try {
            JSON.parse(value);
            return true;
        } catch (e) {
            return false;
        }
    }).withMessage("Params must be a valid JSON string"),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).send({success: false, message: errors.array()[0].msg});
        next()
    }
];

const weblinkValidator = [
    body('name').exists().withMessage("Name is required for Weblinks").escape().trim(),
    body('uri').exists().withMessage("URL is required").isURL().withMessage("URL must be a valid URL"),
    body('description').optional().escape().trim(),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).send({success: false, message: errors.array()[0].msg});
        next()
    }
];

const checkoutValidator = [
    body('notes').optional().escape().trim(),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).send({success: false, message: errors.array()[0].msg});
        next()
    }
]

const deviceSearchValidator = [
    query('search').optional().escape().trim(),
    query('limit').optional().isNumeric().withMessage("Limit must be a number"),
    query('offset').optional().isNumeric().withMessage("Offset must be a number"),
    query('availability').optional().custom((value) => {
        if (value === "true" || value === "false") return true;
        return false;
    }).withMessage("Availability must be a boolean"),
    query('type').optional().isNumeric().withMessage("Type must be a nummeric type ID"),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).send({success: false, message: errors.array()[0].msg});
        next()
    }
];

const guideValidator = [
    body('name').exists().withMessage("Name is required").isLength({min:5}).withMessage("Name must be at least 5 characters").escape().trim(),
    body('description').optional().escape().trim(),
    body('notes').optional().escape().trim(),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).send({success: false, message: errors.array()[0].msg});
        next()
    }
];

const slideValidator = [
    query('action').optional().escape().trim(),
    body('name').exists().withMessage("Name is required").isLength({min:5}).withMessage("Name must be at least 5 characters").escape().trim(),
    body('uri').exists().withMessage("Content is required").trim(),
    body('content').exists().withMessage("Content is required").trim(),
    body('notes').optional().escape().trim(),
    body('guide_id').exists().withMessage("Guide ID is required").isNumeric().withMessage("Guide ID must be a number"),
    body('sorting').exists().withMessage("Sorting is required").isNumeric().withMessage("Sorting must be a number"),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).send({success: false, message: errors.array()[0].msg});
        next()
    }
];

const guidesSearchValidator = [
    query('search').optional().escape().trim(),
    query('limit').optional().isNumeric().withMessage("Limit is optional must be a number"),
    query('page').optional().isNumeric().withMessage("Offset is optional but must be a number"),
    query('visibility').optional().custom((value) => {
        if (value === "true" || value === "false") return true;
        return false;
    }).withMessage("Visibility is optional but must be a boolean"),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).send({success: false, message: errors.array()[0].msg});
        next()
    }
];


const msisdnValidator = [];

export {
    deviceDataValidator,
    poolBuilderValidator,
    msisdnValidator,
    weblinkValidator,
    checkoutValidator,
    deviceSearchValidator,
    guideValidator,
    slideValidator,
    guidesSearchValidator
};