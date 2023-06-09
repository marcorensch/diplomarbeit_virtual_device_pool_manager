import jwt from "jsonwebtoken";
import DatabaseModel from "../models/DatabaseModel.mjs";
import {calculateExpirationMs} from "./Utilities.mjs";

export default class TokenHelper {
    static async generateToken(user) {
        return await jwt.sign({
            "id": user.id,
            "user_role": user.role,
            "ms": new Date().getMilliseconds()
        }, process.env.JWT_SECRET, {expiresIn: process.env.JWT_EXPIRATION});
    }

    static async generateRefreshToken(user) {
        return await jwt.sign({id: user.id}, process.env.JWT_REFRESH_SECRET, {expiresIn: process.env.JWT_REFRESH_EXPIRATION});
    }

    static async generateTokens(user) {
        user.token = await TokenHelper.generateToken(user);
        user.refreshToken = await TokenHelper.generateRefreshToken(user);
        return user
    }

    static async saveNewTokens(user) {
        const database = new DatabaseModel();
        const query = `INSERT INTO tokens (user_id, token, refresh_token) VALUES (?, ?, ?)`;
        const values = [user.id, user.token, user.refreshToken];
        return await database.query(query, values);
    }

    static async deleteToken(user, originalRefreshToken) {
        const database = new DatabaseModel();
        const query = `DELETE FROM tokens WHERE user_id = ? AND refresh_token = ? OR refresh_token = ?`;
        const values = [user.id, user.refreshToken, originalRefreshToken];
        return await database.query(query, values);
    }

    static async deleteAllTokens(user) {
        const database = new DatabaseModel();
        const query = `DELETE FROM tokens WHERE user_id = ?`;
        return await database.query(query, [user.id]);
    }

    static async deleteOldTokens(userId) {
        let currentDate = new Date();
        const expirationSeconds = calculateExpirationMs(process.env.JWT_REFRESH_EXPIRATION) / 1000;
        currentDate.setSeconds(currentDate.getSeconds() - expirationSeconds);
        const deadline = new Date(currentDate);
        const database = new DatabaseModel();
        const query = `DELETE FROM tokens WHERE user_id = ? AND modified_at < ?`;
        const values = [userId, deadline];
        return await database.query(query, values);
    }

    static async updateTokens(user, oldRefreshToken) {
        const database = new DatabaseModel();
        const query = `UPDATE tokens SET token = ? , refresh_token = ? WHERE user_id = ? AND refresh_token = ?`;
        const values = [user.token, user.refreshToken, user.id, oldRefreshToken];
        return await database.query(query, values);
    }

    static async getTokens(currentRefreshToken){
        const database = new DatabaseModel();
        const query = `SELECT user_id, token FROM tokens WHERE refresh_token = ?`;
        const values = [currentRefreshToken];
        return await database.query(query, values);
    }
}