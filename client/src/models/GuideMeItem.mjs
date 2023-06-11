export default class GuideMeItem {
    constructor() {
        this.id = null;
        this.name = null;
        this.description = "";
        this.sorting = 999;
        this.visible = 0;
        this.linkedDeviceIds = [];
    }

    setData(data){
        for (const prop of Object.keys(this)) {
            if (prop in data) {
                this[prop] = data[prop];
            }
        }
    }
}