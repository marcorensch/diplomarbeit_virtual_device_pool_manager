import DatabaseModel from "../models/DatabaseModel.mjs";

export default class DeviceHelper {

    static async getDevices(limit, offset) {
        let devices = [];
        const databaseModel = new DatabaseModel();
        const query = `SELECT d.*,
                              m.name  AS manufacturer_name,
                              m.image AS manufacturer_logo,
                              dt.name AS device_type_name,
                              dt.icon AS device_type_icon
                       FROM devices as d
                                LEFT JOIN device_types as dt ON d.device_type_id = dt.id
                                LEFT JOIN manufacturers as m ON d.manufacturer_id = m.id
                       ORDER BY d.id DESC
                       LIMIT ${limit} OFFSET ${offset}`;
        try{
            devices = await databaseModel.query(query);
        }catch (e) {
            console.log(e.message);
        }

        return devices;
    }

    static async getDevicesBySearch(search, limit, offset) {

    }

    static async getDeviceById(id) {
        const databaseModel = new DatabaseModel();
        const query = `SELECT * FROM devices WHERE id = ${id}`;
        return await databaseModel.query(query);
    }

    static async store(device) {
        const databaseModel = new DatabaseModel();
        const query = `INSERT INTO devices (name, image, notes, hidden, device_type_id, manufacturer_id, same_as, imei, params, slot_id, added) VALUES ( ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
        const values = [device.name, device.image, device.notes, device.hidden, device.device_type_id, device.manufacturer_id, device.same_as, device.imei, device.params, device.slot_id, device.added];
        return await databaseModel.query(query, values);
    }

    static async update(device) {
        const databaseModel = new DatabaseModel();
        const query = `UPDATE devices SET name = ?, image = ?, notes = ?, hidden = ?, device_type_id = ?, manufacturer_id = ?, same_as = ?, imei = ?, params = ?, slot_id = ?, added=? WHERE id = ?`;
        const values = [device.name, device.image, device.notes, device.hidden, device.device_type_id, device.manufacturer_id, device.same_as, device.imei, device.params, device.slot_id, device.added, device.id];
        return await databaseModel.query(query, values);
    }

    static async delete(id) {
        const databaseModel = new DatabaseModel();
        const query = `DELETE FROM devices WHERE id = ${id}`;
        return await databaseModel.query(query);
    }

    static async getDeviceTypes() {
        const databaseModel = new DatabaseModel();
        const query = `SELECT * FROM device_types`;
        try {
            return await databaseModel.query(query);
        } catch (e) {
            console.log(e.message)
            return [];
        }
    }
}