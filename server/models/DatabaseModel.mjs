import * as dotenv from 'dotenv';
import mariadb from 'mariadb';
import path from "path";

const getDotEnvPath = (env) => {
    if (env === 'TEST') {
        return '.env.test'
    }
    return '.env'
}

dotenv.config({path: path.resolve(process.cwd(), getDotEnvPath(process.env.NODE_ENV?.toUpperCase()))});
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
            console.error("Could not establish database connection")
            console.error(this)
            console.error(err)
        }
    }

    async query(sql, values) {
        const connection = await this.createConnection();
        try {
            return await connection.query(sql, values);
        }catch (e) {
            throw e;
        } finally {
            await connection.end();
        }
    }
}