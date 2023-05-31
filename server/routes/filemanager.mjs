import express from "express";

const router = express.Router();

import {fileURLToPath} from 'url';
import path from "path";
import fs from "fs";
import FileManagerHelper from "../helpers/FileManagerHelper.mjs";
import multer from "multer";
import UserValidator from "../middlewares/UserValidator.mjs";
import {pathValidator, handleMulterError , renameValidator, newFolderValidator} from "../middlewares/fileManagerValidators.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const publicDir = path.join(__dirname, '..', 'public');
const allowedImageFileTypes = process.env.ALLOWED_IMG_FILETYPES.split(',').map((type) => { return type.trim() });
const allowedDocumentFileTypes = process.env.ALLOWED_DOC_FILETYPES.split(',').map((type) => { return type.trim() });
const allowedFileTypes = allowedImageFileTypes.concat(allowedDocumentFileTypes);
const upload = multer({
    dest: path.join(__dirname, "..", "uploads"),
    fileFilter: (req, file, cb) => {
        if(allowedFileTypes.includes(file.mimetype.toLowerCase())) {
            cb(null, true);
        } else {
            const err = new multer.MulterError();
            err.code = "FILETYPE_NOT_ALLOWED";
            err.message = "Filetype is not allowed!";
            cb(err, false);
        }
    },
    limits: {
        fileSize: 1024 * 1024 * process.env .MAX_UPLOAD_SIZE_MB || 8,
    },
});

router.use(UserValidator.validateTokens);
router.use(UserValidator.setCookies);

router.get("/", UserValidator.hasPermission("canAccessFileManager"), pathValidator, async (req, res) => {
    let files = [];
    let folders = [];
    const relPath = req.query.path;
    const name = req.query.name || "";
    const absolutePath = path.join(publicDir, relPath, name);

    if (fs.existsSync(absolutePath)) {
        try{
        folders = await FileManagerHelper.getDirectories(relPath, absolutePath);
        files = await FileManagerHelper.getFiles(relPath, absolutePath);
        return res.send({success: true, files, folders});
        } catch (e) {
            return res.status(500).send({success: false, message: e.message, files, folders});
        }
    }
});

router.delete("/", UserValidator.hasPermission("canDeleteFileManagerItem"), async (req, res) => {
    const files = req.body.files || [];
    const folders = req.body.folders || [];
    const items = [...folders, ...files];

    if (items.length === 0) {
        return res.status(400).send({success: false, message: "No files or folders selected"});
    }

    try {
        await FileManagerHelper.delete(items);
        return res.send('ok');
    } catch (e) {
        return res.status(e.status).send({success: false, message: e.message});
    }
});

router.post("/folders", UserValidator.hasPermission("canCreateFileManagerItem"), newFolderValidator, async (req, res) => {
    const dirName = req.body.newFolderName;
    const parentFolderPath = req.body.parentFolder;

    try {
        await FileManagerHelper.createFolder(parentFolderPath, dirName);
        return res.status(201).send('ok');
    } catch (e) {
        return res.status(500).send({success: false, message: e.message});
    }
});

router.put("/rename", UserValidator.hasPermission("canUpdateFileManagerItem"), renameValidator, async (req, res) => {
    const oldName = req.body.oldName;
    const newName = req.body.newName;
    const parentFolderPath = req.body.parentDir;

    try {
        const status = await FileManagerHelper.rename(parentFolderPath, oldName, newName);
        return res.send({success: true, affected: status});
    }catch (e) {
        return res.status(e.status).send({success: false, message: e.message});
    }
});

router.post("/upload", UserValidator.hasPermission("canCreateFileManagerItem"), pathValidator, upload.any(), handleMulterError, async (req, res) => {
    const parentFolderPath = req.query.path;
    const files = req.files;

    if (!files || !files.length) return res.status(400).send({success: false, message: "No file was uploaded"});

    try {
        await FileManagerHelper.upload(parentFolderPath, files);
        return res.status(201).send('ok');
    }catch (e) {
        return res.status(500).send({success: false, message: e.message});
    }


});

router.use((err, req, res, next) => {
    console.log(err);
    res.status(500).json({ success: false, message: 'Something went wrong' });
});

export default router;