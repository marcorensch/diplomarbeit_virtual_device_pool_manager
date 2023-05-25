import DatabaseModel from "../models/DatabaseModel.mjs";
import PoolHelper from "./PoolHelper.mjs";
import WeblinksHelper from "./WeblinksHelper.mjs";

export default class DeviceHelper {
    static async getDevices(limit, offset, filters) {
        let total_count = 0;
        const matchTermWords = filters.search.trim().length ? filters.search.trim().split(' ').map((word, index) => index>0 ? `"*${word}*"`: ` "*${word}*"`).join(' ') : null;
        let devices = [];
        const databaseModel = new DatabaseModel();
        let query = `SELECT d.*,
                              m.name                                   AS manufacturer_name,
                              m.image                                  AS manufacturer_logo,
                              dt.name                                  AS device_type_name,
                              dt.icon                                  AS device_type_icon,
                              acc.username                             AS checkout_username,
                              CONCAT(acc.firstname, ' ', acc.lastname) AS checkout_fullname`;
        if (matchTermWords) {
            query += `, (MATCH(m.name) AGAINST(${matchTermWords} IN BOOLEAN MODE) + MATCH(d.name) AGAINST(${matchTermWords} IN BOOLEAN MODE)) AS relevance`;
        }
        query += ` FROM devices as d
                                LEFT JOIN device_types as dt ON d.device_type_id = dt.id
                                LEFT JOIN manufacturers as m ON d.manufacturer_id = m.id
                                LEFT JOIN accounts as acc ON d.checked_out_by = acc.id`;

        if (matchTermWords) {
            query += ` WHERE (MATCH(m.name) AGAINST(${matchTermWords} IN BOOLEAN MODE) OR MATCH(d.name) AGAINST(${matchTermWords} IN BOOLEAN MODE))`;
        }

        if(filters.type || filters.availability !== null) {
            if(!matchTermWords) {
                query += ` WHERE 1=1`;
            }
            if (filters.type) {
                query += ` AND d.device_type_id = ${filters.type}`;
            }
            if (filters.availability !== null) {
                if (filters.availability === true) {
                    query += ` AND d.checked_out_by IS NULL`;
                } else {
                    query += ` AND d.checked_out_by IS NOT NULL`;
                }
            }
        }

        if (matchTermWords) {
            query += ` ORDER BY relevance DESC`;
        } else {
            query += ` ORDER BY d.id DESC`;
        }

        query += ` LIMIT ${limit} OFFSET ${offset}`;

        // Count of devices "total_count"
        let countQuery  = `SELECT COUNT(*) AS total_count FROM devices as d
           LEFT JOIN device_types as dt ON d.device_type_id = dt.id
           LEFT JOIN manufacturers as m ON d.manufacturer_id = m.id
           LEFT JOIN accounts as acc ON d.checked_out_by = acc.id`;
        if (matchTermWords) {
            countQuery += ` WHERE (MATCH(m.name) AGAINST(${matchTermWords} IN BOOLEAN MODE) OR MATCH(d.name) AGAINST(${matchTermWords} IN BOOLEAN MODE))`;
        }
        if(filters.type || filters.availability !== null) {
            if(!matchTermWords) {
                countQuery += ` WHERE 1=1`;
            }
            if (filters.type) {
                countQuery += ` AND d.device_type_id = ${filters.type}`;
            }
            if (filters.availability !== null) {
                if (filters.availability === true) {
                    countQuery += ` AND d.checked_out_by IS NULL`;
                } else {
                    countQuery += ` AND d.checked_out_by IS NOT NULL`;
                }
            }
        }

        try {
            devices = await databaseModel.query(query);
        } catch (e) {
            console.log(e.message);
        }

        try {
            const count = await databaseModel.query(countQuery);
            total_count = count[0].total_count;
        }catch (e) {
            console.log(e.message);
        }

        for (const device of devices) {

            if(device.slot_id) {
                try {
                    device.slot = await PoolHelper.getItem(device.slot_id, false);
                } catch (e) {
                    console.log(e.message);
                }
            }

            try {
                device.weblinks = await WeblinksHelper.getWeblinksByDeviceId(device.id);
            } catch (e) {
                console.log(e.message);
            }
        }

        return {devices, total_count};
    }

    static async getDeviceById(id) {
        const databaseModel = new DatabaseModel();
        const query = `SELECT d.*,
                              GROUP_CONCAT(n.number_id SEPARATOR ', ') AS linked_msisdns
                       FROM devices d
                                LEFT JOIN device_number n ON d.id = n.device_id
                       WHERE d.id = ${id}
                       GROUP BY d.id;`;
        const result = await databaseModel.query(query);
        return result[0];
    }

    static async store(device) {
        const databaseModel = new DatabaseModel();
        const query = `INSERT INTO devices (name, image, notes, hidden, device_type_id, manufacturer_id, same_as, imei,
                                            params, slot_id, added)
                       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
        const values = [device.name, device.image, device.notes, device.hidden, device.device_type_id, device.manufacturer_id, device.same_as, device.imei, device.params, device.slot_id, device.added];
        return await databaseModel.query(query, values);
    }

    static async update(device) {
        const databaseModel = new DatabaseModel();
        const query = `UPDATE devices
                       SET name            = ?,
                           image           = ?,
                           notes           = ?,
                           hidden          = ?,
                           device_type_id  = ?,
                           manufacturer_id = ?,
                           same_as         = ?,
                           imei            = ?,
                           params          = ?,
                           slot_id         = ?,
                           added=?
                       WHERE id = ?`;
        const values = [device.name, device.image, device.notes, device.hidden, device.device_type_id, device.manufacturer_id, device.same_as, device.imei, device.params, device.slot_id, device.added, device.id];
        return await databaseModel.query(query, values);
    }

    static async setOrUpdateMsisdnLink(deviceId, msisdnId) {
        const databaseModel = new DatabaseModel();
        const query = `INSERT INTO device_number (device_id, number_id)
                       VALUES (?, ?)
                       ON DUPLICATE KEY UPDATE device_id = ?,
                                               number_id = ?`;
        const values = [deviceId, msisdnId, deviceId, msisdnId];
        return await databaseModel.query(query, values);
    }

    static async deleteInactiveMsisdnLinks(deviceId, msisdns = []) {
        const databaseModel = new DatabaseModel();
        let query = `DELETE
                     FROM device_number
                     WHERE device_id = ?`;
        const values = [deviceId];
        if (msisdns.length) {
            query += ` AND number_id NOT IN (?)`;
            values.push(msisdns);
        }

        return await databaseModel.query(query, values);
    }

    static async delete(id) {
        const databaseModel = new DatabaseModel();
        const query = `DELETE
                       FROM devices
                       WHERE id = ${id}`;
        return await databaseModel.query(query);
    }

    static async getDeviceTypes() {
        const databaseModel = new DatabaseModel();
        const query = `SELECT *
                       FROM device_types`;
        try {
            return await databaseModel.query(query);
        } catch (e) {
            console.log(e.message)
            return [];
        }
    }

    static async checkoutDevice(deviceId, userId, checkoutNotes, checkoutTime) {
        const databaseModel = new DatabaseModel();
        const query = `UPDATE devices
                       SET checked_out_by = ?,
                           checkout_time  = ?,
                           checkout_notes = ?
                       WHERE id = ?`;
        const values = [userId, checkoutTime, checkoutNotes, deviceId];
        return await databaseModel.query(query, values);
    }

    static async checkinDevice(deviceId) {
        const databaseModel = new DatabaseModel();
        const query = `UPDATE devices
                       SET checked_out_by = NULL,
                           checkout_time  = NULL,
                           checkout_notes = NULL
                       WHERE id = ?`;
        const values = [deviceId];
        return await databaseModel.query(query, values);
    }
}