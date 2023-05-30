import DatabaseModel from "../models/DatabaseModel.mjs";

export default class DocumentsHelper {

    static async store(document, deviceId) {
        const databaseModel = new DatabaseModel();
        const query = `INSERT INTO device_documents (uri, name, sorting, device_id )
                       VALUES (?, ?, ?, ?)`;
        const values = [document.uri, document.name, document.sorting, deviceId];
        return await databaseModel.query(query, values);
    }

    static async update(document) {
        const databaseModel = new DatabaseModel();
        const query = `UPDATE device_documents
                       SET uri = ?,
                           name = ?,
                           sorting = ?
                       WHERE id = ?`;
        const values = [document.uri, document.name, document.sorting, document.id];
        return await databaseModel.query(query, values);
    }

    static async delete(id) {
        const databaseModel = new DatabaseModel();
        const query = `DELETE FROM device_documents WHERE id = ?`;
        const values = [id];
        return await databaseModel.query(query, values);
    }

    static async setOrUpdateDocumentLink(deviceId, document) {
        if(document.toDelete && document.id){
            return await this.delete(document.id);
        }
        if(!document.sorting) document.sorting = 999;
        if(document.id) {
            return await this.update(document);
        } else {
            return await this.store(document, deviceId);
        }
    }

    static async getDocumentsByDeviceId(deviceId) {
        const databaseModel = new DatabaseModel();
        const query = `SELECT *
                       FROM device_documents
                       WHERE device_id = ?
                       ORDER BY sorting ASC`;
        const values = [deviceId];
        return await databaseModel.query(query, values);
    }

}