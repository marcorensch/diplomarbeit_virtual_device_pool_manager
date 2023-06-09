import DatabaseModel from "../models/DatabaseModel.mjs";

export default class WeblinksHelper {

    static async store(weblink, deviceId) {
        const databaseModel = new DatabaseModel();
        const query = `INSERT INTO weblinks (name, uri, description, sorting, device_id )
                       VALUES (?, ?, ?, ?, ?)`;
        const values = [weblink.name, weblink.uri, weblink.description, weblink.sorting, deviceId];
        return await databaseModel.query(query, values);
    }

    static async update(weblink) {
        const databaseModel = new DatabaseModel();
        const query = `UPDATE weblinks
                       SET name        = ?,
                           uri         = ?,
                           description = ?,
                           sorting     = ?
                       WHERE id = ?`;
        const values = [weblink.name, weblink.uri, weblink.description, weblink.sorting, weblink.id];
        return await databaseModel.query(query, values);
    }

    static async delete(id) {
        const databaseModel = new DatabaseModel();
        const query = `DELETE FROM weblinks WHERE id = ?`;
        const values = [id];
        return await databaseModel.query(query, values);
    }

    static async getWeblinksByDeviceId(deviceId) {
        const databaseModel = new DatabaseModel();
        const query = `SELECT * FROM weblinks WHERE device_id = ? ORDER BY sorting ASC`;
        const values = [deviceId];
        return await databaseModel.query(query, values);
    }

    static async setOrUpdateWeblink(deviceId, weblink) {
        if(weblink.toDelete && weblink.id){
            return await this.delete(weblink.id);
        }
        if(!weblink.sorting) weblink.sorting = 999;
        if(weblink.id) {
            return await this.update(weblink);
        } else {
            return await this.store(weblink, deviceId);
        }
    }
}