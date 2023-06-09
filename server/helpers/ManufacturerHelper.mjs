import DatabaseModel from "../models/DatabaseModel.mjs";

export default class ManufacturerHelper {

    static async getManufacturers() {
        const databaseModel = new DatabaseModel()
        const query = "SELECT * FROM manufacturers";
        return await databaseModel.query(query);
    }

    static async getManufacturer(id) {
        const databaseModel = new DatabaseModel()
        const query = "SELECT * FROM manufacturers WHERE id = ?";
        const result = await databaseModel.query(query, [id]);
        return result[0];
    }

    static async createManufacturer(manufacturer) {
        const databaseModel = new DatabaseModel()
        const query = "INSERT INTO manufacturers (name, image, notes, hidden) VALUES (?, ?, ?, ?)";
        return await databaseModel.query(query, [manufacturer.name, manufacturer.image, manufacturer.notes, manufacturer.hidden]);
    }

    static async updateManufacturer(manufacturer) {
        const databaseModel = new DatabaseModel()
        let query = "UPDATE manufacturers SET name = ?, image = ?, notes = ? "
        let values = [manufacturer.name, manufacturer.image, manufacturer.notes];
        if (manufacturer.hasOwnProperty('hidden')) {
            query += ", hidden = ?"
            values.push(manufacturer.hidden);
        }
        query +=" WHERE id = ?";
        values.push(manufacturer.id);
        return await databaseModel.query(query, values);
    }

    static async deleteManufacturer(id) {
        const databaseModel = new DatabaseModel()
        const query = "DELETE FROM manufacturers WHERE id = ?";
        return databaseModel.query(query, [id]);
    }
}