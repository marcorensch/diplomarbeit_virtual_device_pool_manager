import DatabaseModel from "../models/DatabaseModel.mjs";

export default class ManufacturerHelper {

    static async getManufacturers() {
        const databaseModel = new DatabaseModel()
        const query = "SELECT * FROM manufacturers";
        const result = databaseModel.query(query);
        return result;
    }

    static async getManufacturer(id) {
        const databaseModel = new DatabaseModel()
        const query = "SELECT * FROM manufacturers WHERE id = ?";
        const result = databaseModel.query(query, [id]);
        return result;
    }

    static async createManufacturer(manufacturer) {
        const databaseModel = new DatabaseModel()
        const query = "INSERT INTO manufacturers (name, image, notes, hidden) VALUES (?, ?, ?, ?)";
        const result = databaseModel.query(query, [manufacturer.name, manufacturer.image, manufacturer.notes, manufacturer.hidden]);
        return result;
    }

    static async updateManufacturer(manufacturer) {
        const databaseModel = new DatabaseModel()
        const query = "UPDATE manufacturers SET name = ?, image = ?, notes = ?, hidden = ? WHERE id = ?";
        const result = databaseModel.query(query, [manufacturer.name, manufacturer.image, manufacturer.notes, manufacturer.hidden, manufacturer.id]);
        return result;
    }

    static async deleteManufacturer(id) {
        const databaseModel = new DatabaseModel()
        const query = "DELETE FROM manufacturers WHERE id = ?";
        const result = databaseModel.query(query, [id]);
        return result;
    }
}