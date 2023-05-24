import {body, query, validationResult} from 'express-validator';

const deviceDataValidator = [
    body('name').exists().withMessage("Name is required").escape().trim(),
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
    body('name').exists().withMessage("Name is required").escape().trim(),
    body('category_id').exists().withMessage("Category is required").isNumeric().withMessage("Category must be a number"),
    body('parent_id').optional({checkFalsy: true}).isNumeric().withMessage("Parent must be a number"),
    body('description').optional().escape().trim(),
    body('hidden').optional().escape().trim(),
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
    query('searchString').optional().escape().trim(),
    query('limit').exists().isNumeric().withMessage("Limit must be a number"),
    query('offset').exists().isNumeric().withMessage("Offset must be a number"),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).send({success: false, message: errors.array()[0].msg});
        next()
    }
];

const msisdnValidator = [];

export {deviceDataValidator, poolBuilderValidator, msisdnValidator, weblinkValidator, checkoutValidator, deviceSearchValidator};