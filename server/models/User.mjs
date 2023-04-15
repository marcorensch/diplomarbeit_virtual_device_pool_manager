import bcrypt from 'bcrypt';
import DatabaseModel from "./DatabaseModel.mjs";
export default class User {
    constructor() {
        this.id = null;
        this.username = null;
        this.password = null;
        this.notes = null;
        this.hidden = null;
        this.role_id = null;
        this.role = null;
        this.token = null;
        this.refreshToken = null;
    }

    async checkPassword(password) {
        return await bcrypt.compare(password, this.password);
    }

    async save() {
        const database = new DatabaseModel();
        if (this.id) {
            return await database.query("UPDATE users SET username = ?, password = ?, notes = ?, hidden = ?, role_id = ? WHERE id = ?",
                [this.username, this.password, this.notes, this.hidden, this.role_id, this.id]);
        } else {
            return await database.query("INSERT INTO users (username, password, notes, hidden, role_id) VALUES (?, ?, ?, ?, ?)",
                [this.username, this.password, this.notes, this.hidden, this.role_id]);
        }
    }

    async delete() {
        const database = new DatabaseModel();
        return await database.query("DELETE FROM users WHERE id = ?", [this.id]);
    }
}