export default class BuilderItem {
    constructor() {
        this.id = null;
        this.name = null;
        this.category_id = null;
        this.description = "";
        this.hidden = "";
        this.sorting = 0;
        this.parent_id = null;
        this.params = "";
    }

    setData(props) {
        for (const prop in props) {
            if(this.hasOwnProperty(prop)) this[prop] = props[prop] === 'null' ? null : props[prop];
        }
    }
}