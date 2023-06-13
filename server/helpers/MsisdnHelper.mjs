import DatabaseModel from "../models/DatabaseModel.mjs";
import Msisdn from "../models/Msisdn.mjs";

export default class MsisdnHelper {
    static async getMsisdnById(id) {
        const database = new DatabaseModel();
        const query = "SELECT * FROM numbers WHERE id = ? LIMIT 1";
        const numberData = await database.query(query, [id]);
        if (numberData.length === 0) return null;
        return this.createMsisdn(numberData[0]);
    }

    static async getMsisdnsByParentId(parentId) {
        const database = new DatabaseModel();
        const query = "SELECT a.*, b.name AS simTypeName FROM numbers as a LEFT JOIN sim_types AS b ON a.sim_type_id = b.id WHERE a.parent_id = ? ORDER BY a.abonnement ASC, a.msisdn ASC";
        const numbersData = await database.query(query, [parentId]);
        if (numbersData.length === 0) return [];
        const numbers = [];
        for (const numberData of numbersData) {
            numbers.push(this.createMsisdn(numberData));
        }
        return numbers;
    }

    static async getAllMsisdns(parentOnly = false, flat = false) {
        const database = new DatabaseModel();
        const query = "SELECT a.*, b.name AS simTypeName FROM numbers as a LEFT JOIN sim_types AS b ON a.sim_type_id = b.id WHERE a.parent_id IS NULL ORDER BY a.abonnement ASC, a.msisdn ASC"
        const numbersData = await database.query(query);
        if (numbersData.length === 0) return [];
        const numbers = [];
        for (const numberData of numbersData) {
            numbers.push(this.createMsisdn(numberData));
        }

        if (parentOnly) return numbers;

        for (const number of numbers) {
            const multiDevice = await this.getMsisdnsByParentId(number.id);
            if(flat){
                numbers.push(...multiDevice)
            }else{
                number.multi_device = multiDevice;
            }

        }
        return numbers;
    }

    static async updateMsisdn(id, data) {
        const msisdn = await this.getMsisdnById(id);
        if (!msisdn) return null;
        msisdn.setData(data);
        const database = new DatabaseModel();
        const query = "UPDATE numbers SET msisdn = ?, scn = ?, abonnement = ?, sim_number = ?, parent_id = ?, sim_type_id = ?, notes = ?, hidden = ? WHERE id = ?";
        const values = [msisdn.msisdn, msisdn.scn, msisdn.abonnement, msisdn.sim_number, msisdn.parent_id, msisdn.sim_type_id, msisdn.notes, msisdn.hidden, id];
        const result = await database.query(query, values);
        if (result.affectedRows === 0) return null;
        return result;
    }

    static async store(msisdn) {
        const database = new DatabaseModel();
        const query = "INSERT INTO numbers (msisdn, scn, abonnement, sim_number, parent_id, sim_type_id, notes, hidden) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
        const values = [msisdn.msisdn, msisdn.scn, msisdn.abonnement, msisdn.sim_number, msisdn.parent_id, msisdn.sim_type_id, msisdn.notes, msisdn.hidden];
        const result = await database.query(query, values);
        this.id = result.insertId;
        return this;
    }

    static createMsisdn(data) {
        const msisdn = new Msisdn();
        msisdn.setData(data);
        return msisdn;
    }

    static async deleteMsisdn(id) {
        const database = new DatabaseModel();
        const query = "DELETE FROM numbers WHERE id = ?";
        const result = await database.query(query, [id]);
        if (result.affectedRows === 0) return false;
        return true;
    }

    static async getSimTypes() {
        const database = new DatabaseModel();
        const simTypesData = await database.query("SELECT * FROM sim_types");
        if (simTypesData.length === 0) return [];
        const simTypes = [];
        for (const simTypeData of simTypesData) {
            simTypes.push({id: simTypeData.id, name: simTypeData.name});
        }
        return simTypes;
    }
}