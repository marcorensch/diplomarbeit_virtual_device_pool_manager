import {query, body, validationResult} from 'express-validator';
import {PermissionHandler} from "../helpers/PermissionHandler.mjs";
import multer from "multer";

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

const handleMulterError = (err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        // Multer-Fehler behandeln
        if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({ success: false, message: 'File is to large' });
        } else if (err.code === 'FILETYPE_NOT_ALLOWED') {
            return res.status(400).json({ success: false, message: err.message });
        }
    }
    next(err);
};

export {pathValidator, handleMulterError };