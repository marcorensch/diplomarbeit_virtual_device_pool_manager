import fs from "fs";
import path from "path";
import mime from "mime-types";
import {fileURLToPath} from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const publicDir = path.join(__dirname, '..', 'public');
const uploadDir = path.join(__dirname, '..', 'uploads');

export default class FileManager {
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

        console.log(`Creating folder ${absPath}`)

        if (absPath.includes("..")) {
            throw({status: 403, message: "Forbidden path"})
        }
        if (!fs.existsSync(absPath)) {
            fs.mkdirSync(absPath);
        }
    }

    static async delete(elements) {
        for (const el of elements) {
            if (el.fullPath.includes("..")) {
                throw({status: 403, message: "Forbidden path"})
            }

            const absPath = path.join(publicDir, el.fullPath);


            if (!fs.existsSync(absPath)) {
                console.log(`Trying to delete ${absPath} that does not exist`);
                throw({status: 404, message: "File or Folder not found" })
            }

            try {
                fs.rm(absPath, {recursive: true, force: true}, err => {
                    if (err) {
                        throw {status: 500, message: err.message}
                    }
                    console.log(`${absPath} is deleted!`)
                })
            } catch (e) {
                throw(e)
            }
        }
    }
}