import {body, validationResult} from 'express-validator';

const deviceDataValidator = [
    body('name').exists().withMessage("Name is required").trim(),
    body('device_type_id').exists().withMessage("Device Type is required").isNumeric().withMessage("Device Type must be a number"),
    body('added').exists().withMessage("Added date is required").isISO8601().withMessage("Added date must be a valid date"),
    (req,res,next) => {
        const errors = validationResult(req);
        if(!errors.isEmpty()) return res.status(400).send({success: false, message: errors.array()[0].msg});
        next()
    },
];

const msisdnValidator = [];

export { deviceDataValidator, msisdnValidator };