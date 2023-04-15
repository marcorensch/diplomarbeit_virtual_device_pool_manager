import * as dotenv from 'dotenv';
dotenv.config();
import mariadb from 'mariadb';
export default class DatabaseModel{
    configuration;
    constructor() {
        this.configuration = {
            host: process.env.DATABASE_HOST,
            port: process.env.DATABASE_PORT,
            database: process.env.DATABASE_NAME,
            user: process.env.DATABASE_USER,
            password: process.env.DATABASE_PASSWORD,
            metaAsArray: false,
            bigIntAsNumber: true,
            decimalAsNumber: true,
            insertIdAsNumber: true,
        }
    }

    async createConnection() {
        try {
            return mariadb.createConnection(this.configuration);
        } catch (err) {
            console.log("Could not establish database connection")
            console.log(this)
            console.log(err)
        }
    }

    async query(sql, values) {
        const connection = await this.createConnection();
        try {
            return await connection.query(sql, values);
        }catch (e) {
            console.log(e);
            return [];
        } finally {
            await connection.end();
        }
    }
}