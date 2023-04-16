import bcrypt from 'bcrypt';
import DatabaseModel from "./DatabaseModel.mjs";
import jwt from "jsonwebtoken";
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

    async generateToken() {
        return await jwt.sign({user_id: this.id, user_role: this.role}, process.env.JWT_SECRET, {expiresIn: process.env.JWT_EXPIRATION});
    }

    async generateRefreshToken() {
        return await jwt.sign({user_id: this.id}, process.env.JWT_REFRESH_SECRET, {expiresIn: process.env.JWT_REFRESH_EXPIRATION});
    }

    async generateTokens() {
        this.token = await this.generateToken();
        this.refreshToken = await this.generateRefreshToken();
        return this;
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