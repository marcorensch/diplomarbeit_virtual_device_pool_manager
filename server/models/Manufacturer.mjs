export default class Manufacturer {
    constructor() {
        this.id = null;
        this.name = null;
        this.image = "";
        this.notes = "";
        this.hidden = "";
        this.created_at = null;
        this.modified_at = null;
    }

    setData(data){
        for (const prop of Object.keys(this)) {
            if (prop in data) {
                this[prop] = data[prop];
            }
        }
    }
}