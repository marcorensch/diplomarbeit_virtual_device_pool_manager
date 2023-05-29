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

            const query = `UPDATE manufacturers
                           SET image = NULL
                           WHERE image LIKE ?`;
            const value = `%${el.fullPath}%`;
            try {
                await databaseModel.query(query, [value]);
            } catch (e) {
                console.log(e)
                throw({status: 500, message: "Error updating database"})
            }

        }
    }

    static async upload(relativePath, files) {
        const absPath = path.join(publicDir, relativePath);

        if (!fs.existsSync(absPath)) {
            try {
                fs.mkdirSync(absPath, {recursive: true});
            } catch (e) {
                console.log(e);
                throw({status: 500, message: e.message});
            }
        }

        for (const file of files) {
            const absFilePath = path.join(absPath, file.originalname);
            if (fs.existsSync(absFilePath)) {
                throw({status: 400, message: "File already exists"})
            }
            try {
                await fs.promises.rename(file.path, path.join(absPath, file.originalname));
            } catch (e) {
                console.log(e);
                throw({status: 500, message: "Error uploading file"});
            }
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
                query = `UPDATE documents
                         SET path = REPLACE(path, ?, ?)
                         WHERE path LIKE ?`;
                break;
            default:
                throw({status: 400, message: "Invalid target"})
        }

        const values = [oldRelativePath, newRelativePath, `%${oldRelativePath}%`];

        const databaseModel = new DatabaseModel();
        try {
            await databaseModel.query(query, values);
        } catch (e) {
            console.log(e)
            throw({status: 500, message: "Error updating database"})
        }
    }
}