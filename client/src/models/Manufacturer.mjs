export default class Device{
    id;image;name;notes;hidden;created_at;modified_at;
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