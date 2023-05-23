import {query, body, validationResult} from 'express-validator';
import {PermissionHandler} from "../helpers/PermissionHandler.mjs";

const pathValidator = [

    query('path')
        .exists().withMessage("Path is required").trim()
        .custom(value => {
            return !value.includes('../');
        }).withMessage("Invalid path"),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).send({success: false, message: errors.array()[0].msg});
        }
        next()
    },
];

export {pathValidator};