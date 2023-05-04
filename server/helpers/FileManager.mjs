import fs from "fs";
import path from "path";
import mime from "mime-types";

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
}