import fs from "fs";
import path from "path";
import mime from "mime-types";
import {fileURLToPath} from "url";
import DatabaseModel from "../models/DatabaseModel.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const publicDir = path.join(__dirname, '..', 'public');
const uploadDir = path.join(__dirname, '..', 'uploads');

export default class FileManagerHelper {
    static async getDirectories(relativePath, absolutePath) {
        return (await fs.promises.readdir(absolutePath, {withFileTypes: true}))
            .filter(dirent => dirent.isDirectory())
            .map(dirent => {
                return {name: dirent.name, fullPath: path.join(relativePath, dirent.name), relativePath}
            })
    }

    static async getFiles(relativePath, absolutePath) {
        return (await fs.promises.readdir(absolutePath, {withFileTypes: true}))
            .filter(dirent => dirent.isFile())
            .map(dirent => {
                const stats = fs.statSync(path.join(absolutePath, dirent.name))
                return {
                    name: dirent.name,
                    data: {
                        type: path.extname(dirent.name).replace(".", ""),
                        mimeType: mime.lookup(dirent.name),
                        size: stats.size
                    },
                    fullPath: path.join(relativePath, dirent.name),
                    relativePath
                }
            })
    }

    static createFolder(relativePath, name) {
        const absPath = path.join(publicDir, relativePath, name);
        if (absPath.includes("..")) {
            throw({status: 403, message: "Forbidden path"})
        }
        if (!fs.existsSync(absPath)) {
            fs.mkdirSync(absPath);
        }
    }

    static async delete(elements) {
        const databaseModel = new DatabaseModel();
        for (const el of elements) {
            if (el.fullPath.includes("..")) {
                throw({status: 403, message: "Forbidden path"})
            }

            const absPath = path.join(publicDir, el.fullPath);

            if (!fs.existsSync(absPath)) {
                throw({status: 404, message: "File or Folder not found"})
            }

            try {
                fs.rm(absPath, {recursive: true, force: true}, err => {
                    if (err) {
                        throw {status: 500, message: err.message}
                    }
                })
            } catch (e) {
                throw(e)
            }

            const target = el.fullPath.split("/")[0];
            let query;
            let value = `%${el.fullPath}%`;
            switch (target) {
                case "images":
                    query = `UPDATE devices
                         SET image = NULL
                         WHERE image LIKE ?`;
                    break;
                case "logos":
                    query = `UPDATE manufacturers
                         SET image = NULL
                         WHERE image LIKE ?`;
                    break;
                case "documents":
                    query = `DELETE FROM device_documents WHERE uri LIKE ?`;
                    break;
                case "test":
                    return;
                default:
                    throw({status: 500, message: `Cannot update database target ${target} unknown`})
            }

            try {
                await databaseModel.query(query, [value]);
            } catch (e) {
                console.log(e)
                throw({status: 500, message: "Error updating database"})
            }

        }
    }

    static async upload(relativePath, files, overwriteExisting) {
        const absPath = path.join(publicDir, relativePath);

        if (!fs.existsSync(absPath)) {
            try {
                fs.mkdirSync(absPath, {recursive: true});
            } catch (e) {
                console.log(e);
                throw({status: 500, message: e.message});
            }
        }

        const fileExistWarnings = [];

        for (const file of files) {

            const absFilePath = path.join(absPath, file.originalname);
            if (fs.existsSync(absFilePath) && !overwriteExisting) {
                fileExistWarnings.push({status: 409, message: `File ${file.originalname} already exists`});
                continue;
            }
            try {
                await fs.promises.rename(file.path, path.join(absPath, file.originalname));
            } catch (e) {
                console.log(e);
                throw({status: 500, message: "Error uploading file"});
            }
        }

        if(fileExistWarnings.length > 0) {
            throw(fileExistWarnings);
        }
    }

    static async rename(parentFolder, oldName, newName) {
        const absPath = path.join(publicDir, parentFolder, oldName);
        const newAbsPath = path.join(publicDir, parentFolder, newName);

        const oldRelativePath = path.join(parentFolder, oldName);
        const newRelativePath = path.join(parentFolder, newName);

        if (!fs.existsSync(absPath)) throw({status: 404, message: "File or Folder not found"});

        try {
            fs.renameSync(absPath, newAbsPath);
        } catch (e) {
            console.log(e)
            throw({status: 500, message: "Error renaming filesystem element"})
        }
        const target = parentFolder.split("/")[0];
        let query;
        switch (target) {
            case "images":
                query = `UPDATE devices
                         SET image = REPLACE(image, ?, ?)
                         WHERE image LIKE ?`;

                break;
            case "logos":
                query = `UPDATE manufacturers
                         SET image = REPLACE(image, ?, ?)
                         WHERE image LIKE ?`;
                break;
            case "documents":
                query = `UPDATE device_documents
                         SET uri = REPLACE(uri, ?, ?)
                         WHERE uri LIKE ?`;
                break;
            case "test":
                    return;
            default:
                throw({status: 500, message: `Cannot update database target ${target} unknown`})
        }

        const values = [oldRelativePath, newRelativePath, `%${oldRelativePath}%`];

        const databaseModel = new DatabaseModel();
        try {
            const status = await databaseModel.query(query, values);
            return status.affectedRows;
        } catch (e) {
            console.log(e)
            throw({status: 500, message: "Error updating database"})
        }
    }
}