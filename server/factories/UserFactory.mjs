import User from "../models/User.mjs";
import DatabaseModel from "../models/DatabaseModel.mjs";
export default class UserFactory {
    static async getUser(data) {
        const user = new User();
        user.id = data.id;
        user.username = data.username;
        user.password = data.password;
        user.notes = data.notes;
        user.hidden = data.hidden;
        user.role = data.role;
        return user;
    }

    static getUserById(id) {
        return new Promise(async (resolve, reject) => {
            const database = new DatabaseModel();
            const userData = await database.query("SELECT * FROM users WHERE id = ? LIMIT 1", [id]);
            if(userData.length === 0) return reject("User not found");
            userData[0].role = await this.getRoleById(userData[0].role_id);
            resolve( await this.getUser(userData[0]));
        });
    }

    static getUserByUsername(username) {
        return new Promise(async (resolve, reject) => {
            const database = new DatabaseModel();
            const userData = await database.query("SELECT * FROM users WHERE username = ? LIMIT 1", [username]);
            if(userData.length === 0) return reject("User not found");
            userData[0].role = await this.getRoleById(userData[0].role_id);
            resolve( await this.getUser(userData[0]));
        });
    }

    static async getRoleById(id) {
        const database = new DatabaseModel();
        const role = await database.query("SELECT * FROM roles WHERE id = ? LIMIT 1", [id]);
        return role[0].name;
    }

    static async getAllUsers() {
        const database = new DatabaseModel();
        return await database.query("SELECT u.id, u.username, r.name AS role FROM users AS u JOIN roles AS r ON u.role_id = r.id ORDER BY u.username");
    }
}