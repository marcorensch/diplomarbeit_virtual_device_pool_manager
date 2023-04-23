import DatabaseModel from "./DatabaseModel.mjs";

export default class Role {
    constructor(id, name) {
        this.id = id;
        this.name = name;
    }

    static async getAllRoles() {
        const roles = [];
        const database = new DatabaseModel();
        let result = await database.query("SELECT id, name FROM roles ORDER BY id DESC");

        result.map(role => {
            roles.push(new Role(role.id, role.name));
        })

        return roles;

    }
}