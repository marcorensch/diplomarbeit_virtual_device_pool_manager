import mariadb from 'mariadb';
export default class DatabaseConnector {
    static async dropDatabase(databaseName, connectionData) {
        const connection = await DatabaseConnector.getConnection(connectionData);
        try{
            return await connection.query(`DROP DATABASE IF EXISTS ${databaseName}`);
        } catch (e) {
            console.log(e);
        } finally {
            await connection.end();
        }
    }

    static async createDatabase(name, connectionData) {
        const connection = await DatabaseConnector.getConnection(connectionData);
        try {
            return await connection.query(`CREATE DATABASE IF NOT EXISTS ${name} DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci`);
        } catch (e) {
            console.log(e);
        } finally {
            await connection.end();
        }
    }

    static async execute(sql, data, connectionData) {
        const connection = await DatabaseConnector.getConnection(connectionData);
        try {
            const result = await connection.query(sql, data);
            return result;
        }catch (e) {
            console.log(e);
        } finally {
            await connection.end();
        }
    }

    static getConnection(connectionData) {
        const config = {
            host: connectionData.host,
            port: connectionData.port,
            user: connectionData.user,
            password: connectionData.password,
            metaAsArray: false,
            bigIntAsNumber: true,
            decimalAsNumber: true,
            insertIdAsNumber: true,
        }
        if (connectionData.useDatabase) {
            config.database = connectionData.database;
        }
        return mariadb.createConnection(config);
    }
}