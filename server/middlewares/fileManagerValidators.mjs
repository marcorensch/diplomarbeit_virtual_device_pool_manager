import {query, body, validationResult} from 'express-validator';
import {PermissionHandler} from "../helpers/PermissionHandler.mjs";
import multer from "multer";

const validNameExpression = /^[a-z|\d]+[a-z|\d \-_.]*$/i;

const pathValidator = [
    query('path')
        .exists().withMessage("Path is required")
        .custom(value => {
            return !value.includes('../');
        }).withMessage("Invalid path")
        .trim(),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).send({success: false, message: errors.array()[0].msg});
        }
        next()
    },
];

const newFolderValidator = [
    body('newFolderName')
        .exists().withMessage("Folder name is required")
        .custom(value => {
            return !value.includes('../');
        }).withMessage("Invalid path for folder name")
        .custom(value => {
            return validNameExpression.test(value);
        }).withMessage("Invalid folder name")
        .escape()
        .trim(),
    body('parentFolder')
        .exists().withMessage("Parent folder is required")
        .custom(value => {
            return !value.includes('../');
        }).withMessage("Invalid path")
        .trim(),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).send({success: false, message: errors.array()[0].msg});
        }
        next()
    }
];
const renameValidator = [
    body('oldName')
        .optional()
        .exists().withMessage("Old name is required")
        .custom(value => {
            return !value.includes('../');
        }).withMessage("Invalid path for old name")
        .escape()
        .trim(),
    body('newName')
        .exists().withMessage("New name is required")
        .custom(value => {
            return !value.includes('../');
        }).withMessage("Invalid path for new name")
        .custom(value => {
            return validNameExpression.test(value);
        }).withMessage("Invalid new name")
        .escape()
        .trim(),
    body('parentDir')
        .exists().withMessage("Parent directory is required")
        .custom(value => {
            return !value.includes('../');
        }).withMessage("Invalid path")
        .trim(),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).send({success: false, message: errors.array()[0].msg});
        }
        next()
    }
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

export {pathValidator, handleMulterError, renameValidator, newFolderValidator };