export default class Role {
    constructor(id, name) {
        this.id = id;
        this.name = name;
        this.label = Roles[name];
    }
}

const Roles = {
    ADMIN : "Administator",
    USER : "User",
    GUEST : "Guest"
}