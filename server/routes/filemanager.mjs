import express from "express";

const router = express.Router();

import {fileURLToPath} from 'url';
import path from "path";
import fs from "fs";
import FileManager from "../helpers/FileManager.mjs";
import multer from "multer";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const publicDir = path.join(__dirname, '..', 'public');
const uploadDir = path.join(__dirname, '..', 'uploads');
const upload = multer({dest: 'uploads/'});

const regex = /^[a-z]+[a-z|\d \-_.]*$/i;

router.get("/", async (req, res) => {
    let files = [];
    let folders = [];
    const relPath = req.query.path || "";
    const name = req.query.name || "";
    const absolutePath = path.join(publicDir, relPath, name);
    console.log(absolutePath);
    if (absolutePath.includes("..")) {
        res.send({folders: [], files: []});
        return;
    }

    if (fs.existsSync(absolutePath)) {
        folders = await FileManager.getDirectories(relPath, absolutePath);
        files = await FileManager.getFiles(relPath, absolutePath);
    }

    res.send({folders, files});

});

router.delete("/", async (req, res) => {
    const files = req.body.files;
    const folders = req.body.folders;
    const items = [...folders, ...files];

    if (items.length === 0) {
        res.status(400).send({success: false, message: "No files or folders selected"});
        return;
    }

    try {
        await FileManager.delete(items);
    } catch (e) {
        res.status(e.status).send({success: false, message: e.message});
        return;
    }

    console.log(files);
    console.log(folders);

    res.send('ok');
});

router.post("/create-folder", async (req, res) => {
    const dirName = req.body.newFolderName;
    const parentFolderPath = req.body.parentFolder;


    if (!dirName) return res.status(400).send({success: false, message: "Folder name cannot be empty"});
    if (!parentFolderPath) return res.status(400).send({success: false, message: "Parent folder cannot be empty"});
    if (!regex.test(dirName)) return res.status(400).send({success: false, message: "Invalid folder name"});

    try {
        await FileManager.createFolder(parentFolderPath, dirName);
    } catch (e) {
        res.status(e.status).send({success: false, message: e.message});
        return;
    }

    res.status(201).send('ok');
});

router.put("/rename", async (req, res) => {
    const oldName = req.body.oldName;
    const newName = req.body.newName;
    const parentFolderPath = req.body.parentDir;

    if (!oldName) return res.status(400).send({success: false, message: "Old name cannot be empty"});
    if (!newName) return res.status(400).send({success: false, message: "New name cannot be empty"});
    if (!parentFolderPath) return res.status(400).send({success: false, message: "Parent folder cannot be empty"});
    if (!regex.test(newName)) return res.status(400).send({success: false, message: "Invalid name"});

    try {
        const result = await FileManager.rename(parentFolderPath, oldName, newName);
        console.log(result);
    }catch (e) {
        res.status(e.status).send({success: false, message: e.message});
        return;
    }

    res.send('ok');
});

router.post("/upload", upload.any(), async (req, res) => {
    const parentFolderPath = req.body.relativePath;
    const files = req.files;

    if (parentFolderPath.includes("/../")) return res.code(400).send({success: false, message: "Invalid path"});
    if (!parentFolderPath) return res.status(400).send({success: false, message: "Parent folder cannot be empty"});

    try {
        await FileManager.upload(parentFolderPath, files);
    }catch (e) {
        return res.status(e.status).send({success: false, message: e.message});
    }

    res.send('ok');
});

export default router;