export default class Device{
    constructor(){
        this.id = null;
        this.image = null;
        this.name = null;
        this.manufacturer_id = null;
        this.notes = "";
        this.hidden = "";
        this.device_type_id = null;
        this.same_as_id = null;
        this.imei = [];
        this.params = "";
        this.slot_id = null;
        this.added = null;
        this.msisdns = [];
        this.similar_devices = [];
        this.created_at = null;
        this.modified_at = null;
        this.weblinks = [];
        this.checked_out_by = null;
        this.checkout_time = null;
        this.checkout_notes = null;
        this.checked_out_by_name = null;
        this.documents = [];
    }

    setData(data){
        for (const prop of Object.keys(this)) {
            if (prop in data) {
                this[prop] = data[prop];
            }
        }
    }
}