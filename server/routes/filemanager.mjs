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

export default router;