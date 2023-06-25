import DatabaseModel from "./DatabaseModel.mjs";

export default class Msisdn {
    constructor() {
        this.id = null;
        this.msisdn = null;
        this.scn = null;
        this.abonnement = null;
        this.sim_number = null;
        this.parent_id = null;
        this.sim_type_id = null;
        this.simTypeName = null;
        this.notes = "";
        this.hidden = "";
        this.created_at = null;
        this.modified_at = null;
        this.multi_device = [];
        this.device_name = null;
        this.device_id = null;
    }

    setData(props) {
        for (const prop in props) {
            if(this.hasOwnProperty(prop)) this[prop] = props[prop] === 'null' ? null : props[prop];
        }
    }

}