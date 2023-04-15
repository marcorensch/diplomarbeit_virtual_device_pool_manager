import DatabaseModel from "../models/DatabaseModel.mjs";
import jwt from "jsonwebtoken";

export default class TokenHelper {
    static async storeTokens(user) {
        const database = new DatabaseModel();
        return await database.query("INSERT INTO tokens (user_id, token, refresh_token) VALUES (?, ?, ?)", [user.id, user.token, user.refreshToken]);
    }

    static async updateTokens(user) {
        const database = new DatabaseModel();
        return await database.query("UPDATE tokens SET token = ?, refresh_token = ? WHERE user_id = ?", [user.token, user.refreshToken, user.id]);
    }

    static async deleteTokens(user) {
        const database = new DatabaseModel();
        return await database.query("DELETE FROM tokens WHERE user_id = ? AND token = ? AND refresh_token = ?", [user.id, user.token, user.refreshToken]);
    }

    static async generateToken(user) {
        return await jwt.sign({id: user.id, role: user.role}, process.env.JWT_SECRET, {expiresIn: process.env.JWT_EXPIRATION});
    }

    static async generateRefreshToken(user) {
        return await jwt.sign({id: user.id}, process.env.JWT_REFRESH_SECRET, {expiresIn: process.env.JWT_REFRESH_EXPIRATION});
    }

    static async generateTokens(user) {
        user.token = await this.generateToken(user);
        user.refreshToken = await this.generateRefreshToken(user);
        return user;
    }
}