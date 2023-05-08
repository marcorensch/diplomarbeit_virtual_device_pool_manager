export default class Device {
    constructor() {
        this.id = null;
        this.name = null;
        this.image = "";
        this.notes = "";
        this.hidden = "";
        this.device_type_id = null;
        this.manufacturer_id = null;
        this.same_as = null;
        this.imei = "";
        this.params = "";
        this.slot_id = null;
        this.created_at = null;
        this.updated_at = null;
    }

    setData(props) {
        for (const prop in props) {
            if(this.hasOwnProperty(prop)) this[prop] = props[prop] === 'null' ? null : props[prop];
        }
    }
}