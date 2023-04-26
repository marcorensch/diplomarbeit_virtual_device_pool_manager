import DatabaseModel from "./DatabaseModel.mjs";

export default class Msisdn {
    constructor() {
        this.id = null;
        this.msisdn = null;
        this.scn = null;
        this.abonnement = null;
        this.sim_number = null;
        this.parent_id = null;
        this.sim_type = null;
        this.simTypeName = null;
        this.notes = "";
        this.hidden = "";
        this.created_at = null;
        this.modified_at = null;
        this.multi_device = [];
    }

    setData(props) {
        for (const prop in props) {
            if(this.hasOwnProperty(prop)) this[prop] = props[prop] === 'null' ? null : props[prop];
        }
    }

    linkMultiDevice(multiDevice) {
        const md = new Msisdn().setData(multiDevice);
        this.multi_device.push(md);
    }

    async store() {
        const database = new DatabaseModel();
        const data = await database.query("INSERT INTO numbers (msisdn, scn, abonnement, sim_number, parent_id, sim_type, notes, hidden) VALUES (?, ?, ?, ?, ?, ?, ?, ?)", [this.msisdn, this.scn, this.abonnement, this.sim_number, this.parent_id, this.sim_type, this.notes, this.hidden]);
        this.id = data.insertId;
        return this;
    }

}