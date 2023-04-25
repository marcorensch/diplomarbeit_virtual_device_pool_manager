export default class Device{
    id;image;name;manufacturer_id;notes;hidden;device_type_id;same_as_id;imei;params;slot_id;number_id;created_at;modified_at;
    constructor(data = null){
        if(data) this.setData(data);
    }

    setData(data){
        for (const prop of this) {
            if (prop in data) {
                this[prop] = data[prop];
            }
        }
    }
}