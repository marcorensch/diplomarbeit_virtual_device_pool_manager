export default class Manufacturer{
    id;image;name;notes;hidden;created_at;modified_at;
    constructor(){
        this.id = null;
        this.image = "";
        this.name = null;
        this.notes = "";
        this.hidden = "";
        this.created_at = null;
        this.modified_at = null;
    }

    setData(data){
        for (const prop of this) {
            if (prop in data) {
                this[prop] = data[prop];
            }
        }
    }
}