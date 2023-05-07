import User from "../models/User.mjs";
import DatabaseModel from "../models/DatabaseModel.mjs";
import {PermissionHandler} from "./PermissionHandler.mjs";

export default class UserHelper {
    static async createUser(data) {
        const user = new User();
        data.permissions = await UserHelper.getUserPermissions(data.role);
        user.setData(data);
        return user;
    }

    static async getUserPermissions(role) {
        const permissionHandler = new PermissionHandler();
        const permissions = permissionHandler.getPermissions(role);
        return Array.from(permissions.entries()).map(([key, value]) => {
            if(value === true) return key;
        });
    }

    static getUserById(id) {
        return new Promise(async (resolve, reject) => {
            const database = new DatabaseModel();
            const userData = await database.query("SELECT * FROM accounts WHERE id = ? LIMIT 1", [id]);
            if (userData.length === 0) return reject("User not found");
            userData[0].role = await UserHelper.getRoleById(userData[0].role_id);
            resolve(await UserHelper.createUser(userData[0]));
        });
    }

    static getUserByUsername(username) {
        return new Promise(async (resolve, reject) => {
            const database = new DatabaseModel();
            const userData = await database.query("SELECT * FROM accounts WHERE username = ? LIMIT 1", [username]);
            if (userData.length === 0) return reject("User not found");
            userData[0].role = await UserHelper.getRoleById(userData[0].role_id);
            resolve(await UserHelper.createUser(userData[0]));
        });
    }

    static async checkUserExists(username) {
        const database = new DatabaseModel();
        const userData = await database.query("SELECT * FROM accounts WHERE username = ? LIMIT 1", [username]);
        return userData.length !== 0;
    }

    static async getRoleById(id) {
        const database = new DatabaseModel();
        const role = await database.query("SELECT * FROM roles WHERE id = ? LIMIT 1", [id]);
        return role[0].name;
    }

    static async getAllUsers() {
        const database = new DatabaseModel();
        return await database.query("SELECT u.id, u.username, u.firstname, u.lastname, u.email, u.created_at, u.role_id, u.hidden, u.notes, r.name AS role FROM accounts AS u JOIN roles AS r ON u.role_id = r.id ORDER BY u.username");
    }

    static async getUsersByRole(role) {
        const database = new DatabaseModel();
        const roleData = await database.query("SELECT * FROM roles WHERE name = ? LIMIT 1", [role]);
        if (roleData.length === 0) return [];
        return await database.query("SELECT u.id, u.username, u.firstname, u.lastname, u.email, u.created_at, u.role_id, u.hidden, u.notes, r.name AS role FROM accounts AS u JOIN roles AS r ON u.role_id = r.id WHERE u.role_id = ? ORDER BY u.username", [roleData[0].id]);
    }

    static async saveUser(user) {
        const database = new DatabaseModel();
        try {
            const roleData = await database.query("SELECT * FROM roles WHERE id = ? LIMIT 1", [user.role_id]);
            if (roleData.length === 0) throw "Role not found";
        } catch (e) {
            throw e;
        }

        if(user.password === null) throw "Password is null";

        if (user.id) {
            return await database.query("UPDATE accounts SET username = ?, password = ?, firstname = ?, lastname = ?, email = ?, notes = ?, hidden = ?, role_id = ? WHERE id = ?",
                [user.username, user.password, user.firstname, user.lastname, user.email, user.notes, user.hidden, user.role_id, user.id]);
        } else {
            return await database.query("INSERT INTO accounts (username, password, firstname, lastname, email, notes, hidden, role_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
                [user.username, user.password, user.firstname, user.lastname, user.email, user.notes, user.hidden, user.role_id]);
        }
    }

    static async deleteUser(user) {
        const database = new DatabaseModel();
        const result = await database.query("DELETE FROM accounts WHERE id = ?", [user.id]);
        return result.affectedRows === 1;
    }
}