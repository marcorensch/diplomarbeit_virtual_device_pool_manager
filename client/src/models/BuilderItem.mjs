export default class BuilderItem {
    constructor() {
        this.id = null;
        this.name = null;
        this.description = "";
        this.hidden = "";
        this.params = null;
        this.sorting = 0;
        this.category_id = null;
        this.parent_id = null;
    }

    setData(data){
        for (const prop of Object.keys(this)) {
            if (prop in data) {
                this[prop] = data[prop];
            }
        }
        if(this.params){
            try {
                this.params = JSON.parse(this.params);
            }catch (e) {
                console.log(e);
            }
        }
    }

    initLocationParams(params){
        this.params = {cabinetsOrientation: "horizontal", ...params};
    }
}