import mariadb from 'mariadb';
import * as dotenv from 'dotenv';
dotenv.config();

export default class DatabaseConnector {
    static async dropDatabase() {
        const connection = await DatabaseConnector.getConnection(false);
        try{
            const result = await connection.query(`DROP DATABASE IF EXISTS ${process.env.DATABASE_NAME}`);
            return result;
        } catch (e) {
            console.log(e);
        } finally {
            await connection.end();
        }
    }

    static async createDatabase(name) {
        const connection = await DatabaseConnector.getConnection(false);
        try {
            const result = await connection.query(`CREATE DATABASE IF NOT EXISTS ${name} DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci`);
            return result;
        } catch (e) {
            console.log(e);
        } finally {
            await connection.end();
        }
    }

    static async execute(sql, data, withDb = true) {
        const connection = await DatabaseConnector.getConnection(withDb);
        try {
            const result = await connection.query(sql, data);
            return result;
        }catch (e) {
            console.log(e);
        } finally {
            await connection.end();
        }
    }

    static getConnection(withDb = true) {
        const config = {
            host: process.env.DATABASE_HOST,
            port: process.env.DATABASE_PORT,
            user: process.env.DATABASE_USER,
            password: process.env.DATABASE_PASSWORD,
            metaAsArray: false,
            bigIntAsNumber: true,
            decimalAsNumber: true,
            insertIdAsNumber: true,
        }
        if (withDb) {
            config.database = process.env.DATABASE_NAME;
        }
        return mariadb.createConnection(config);
    }
}