import bcrypt from 'bcrypt';
import DatabaseModel from "./DatabaseModel.mjs";
import jwt from "jsonwebtoken";

export default class User {
    constructor() {
        this.id = null;
        this.username = null;
        this.password = null;
        this.email = null;
        this.created_at = null;
        this.updated_at = null;
        this.firstname = "";
        this.lastname = "";
        this.notes = "";
        this.hidden = "";
        this.role_id = null;
        this.role = null;
        this.token = null;
        this.refreshToken = null;
    }

    setData(props) {
        for (const prop in props) {
            this[prop] = props[prop];
        }
    }

    async encryptPassword(plainPassword) {
        return await bcrypt.hash(plainPassword, 10);
    }
    async checkPassword(password) {
        console.log("password: " + password)
        console.log("this.password: " + this.password)
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
        try {
            console.log("role id: " + this.role_id);
            const roleData = await database.query("SELECT * FROM roles WHERE id = ? LIMIT 1", [this.role_id]);
            if (roleData.length === 0) throw "Role not found";
        } catch (e) {
            throw e;
        }

        if(this.password === null) throw "Password is null";

        if (this.id) {
            return await database.query("UPDATE users SET username = ?, password = ?, firstname = ?, lastname = ?, email = ?, notes = ?, hidden = ?, role_id = ? WHERE id = ?",
                [this.username, this.password, this.firstname, this.lastname, this.email, this.notes, this.hidden, this.role_id, this.id]);
        } else {
            return await database.query("INSERT INTO users (username, password, firstname, lastname, email, notes, hidden, role_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
                [this.username, this.password, this.firstname, this.lastname, this.email, this.notes, this.hidden, this.role_id]);
        }
    }

    async delete() {
        const database = new DatabaseModel();
        return await database.query("DELETE FROM users WHERE id = ?", [this.id]);
    }
}