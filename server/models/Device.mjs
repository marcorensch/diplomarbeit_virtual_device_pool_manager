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
        this.msisdns = [];
        this.params = "";
        this.slot_id = null;
        this.created_at = null;
        this.updated_at = null;
        this.added = null;
    }

    setData(props) {
        for (const prop in props) {
            if(this.hasOwnProperty(prop)) this[prop] = props[prop] === 'null' ? null : props[prop];
        }
        this.setCorrectDateFormats();
    }

    setCorrectDateFormats() {
        if(this.created_at) this.created_at = new Date(this.created_at);
        if(this.updated_at) this.updated_at = new Date(this.updated_at);
        if(this.added) this.added = new Date(this.added);
    }
}