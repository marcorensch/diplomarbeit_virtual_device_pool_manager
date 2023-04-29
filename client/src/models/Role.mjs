export default class Role {
    constructor(id, name) {
        this.id = id;
        this.name = name;
        this.label = Roles[name];
    }
}

export const Roles = {
    ADMIN : "Administator",
    MANAGER: "Manager",
    USER : "User",
    GUEST : "Guest"
}