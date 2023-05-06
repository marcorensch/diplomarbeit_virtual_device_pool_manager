import express from "express";

const router = express.Router();

import {fileURLToPath} from 'url';
import path from "path";
import fs from "fs";
import FileManager from "../helpers/FileManager.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const publicDir = path.join(__dirname, '..', 'public');
const uploadDir = path.join(__dirname, '..', 'uploads');

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

    try{
        await FileManager.createFolder(parentFolderPath, dirName);
    }catch (e) {
        res.status(e.status).send({success: false, message: e.message});
        return;
    }

    res.status(201).send('ok');
});

export default router;