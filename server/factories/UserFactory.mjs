import User from "../models/User.mjs";
import DatabaseModel from "../models/DatabaseModel.mjs";

export default class UserFactory {
    static async getUser(data) {
        const user = new User();
        user.setData(data);
        return user;
    }

    static getUserById(id) {
        return new Promise(async (resolve, reject) => {
            const database = new DatabaseModel();
            const userData = await database.query("SELECT * FROM users WHERE id = ? LIMIT 1", [id]);
            if (userData.length === 0) return reject("User not found");
            userData[0].role = await this.getRoleById(userData[0].role_id);
            resolve(await this.getUser(userData[0]));
        });
    }

    static getUserByUsername(username) {
        return new Promise(async (resolve, reject) => {
            const database = new DatabaseModel();
            const userData = await database.query("SELECT * FROM users WHERE username = ? LIMIT 1", [username]);
            if (userData.length === 0) return reject("User not found");
            userData[0].role = await this.getRoleById(userData[0].role_id);
            resolve(await this.getUser(userData[0]));
        });
    }

    static async checkUserExists(username) {
        const database = new DatabaseModel();
        const userData = await database.query("SELECT * FROM users WHERE username = ? LIMIT 1", [username]);
        return userData.length !== 0;
    }

    static async getRoleById(id) {
        const database = new DatabaseModel();
        const role = await database.query("SELECT * FROM roles WHERE id = ? LIMIT 1", [id]);
        return role[0].name;
    }

    static async getAllUsers() {
        const database = new DatabaseModel();
        return await database.query("SELECT u.id, u.username, u.firstname, u.lastname, u.email, u.created_at, u.role_id, u.hidden, u.notes, r.name AS role FROM users AS u JOIN roles AS r ON u.role_id = r.id ORDER BY u.username");
    }
}