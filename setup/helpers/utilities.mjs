import * as path from "path";
import * as fs from "fs";
import chalk from "chalk";
import {fileURLToPath} from "url";
import DatabaseConnector from "../model/DatabaseConnector.mjs";
import bcrypt from "bcrypt";
import crypto from "node:crypto";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function createSSL(apiHostname) {

    const {exec} = await import('child_process');
    const sslPath = path.join(__dirname, '..', '..', 'certs');

    try {
        if (!fs.existsSync(sslPath)) await fs.promises.mkdir(sslPath);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }

    console.log(chalk.bold.yellow(`Creating SSL certificates for "${apiHostname}"...`));

    try {
        await exec(`openssl req -x509 -newkey rsa:4096 -keyout ${path.join(sslPath, 'key.pem')} -out ${path.join(sslPath, 'cert.pem')} -days 365 -nodes -subj "/CN=${apiHostname}"`);
        console.log(chalk.bold.green("SSL certificates created!"));
    } catch (e) {
        console.log(chalk.bold.red("Attention! Failed to create SSL certificates!"));
        console.error(e);
    }
}

export async function createAccount(dbName, username, pwd, role, connectionData) {
    const password = pwd ? String(pwd) : crypto.randomBytes(12).toString('hex');
    const hashedPassword = await bcrypt.hash(password, 10);
    const adminUserRoleData = await DatabaseConnector.execute('SELECT id FROM roles WHERE name = ?', [role], connectionData);
    const status = await DatabaseConnector.execute(`INSERT INTO accounts (username, password, notes, hidden, role_id) VALUES (?, ?, ?, ?, ?)`, [username, hashedPassword, '', '', adminUserRoleData[0].id], connectionData);

    if (status.affectedRows === 1) {
        console.log(chalk.bold.green("\n************************ User created! ************************\n"));
        console.log(chalk.bold.yellow("Username: " + username));
        console.log(chalk.bold.yellow("Password: " + password));
        console.log(chalk.bold.green("\n***************************************************************"));
    } else {
        console.log(chalk.bold.red("Failed to create admin user!"));
        console.log(status);
    }
};

export async function installDatabase(dbName, connectionData) {
    if(!dbName) throw new Error("No database name provided!");

    console.log(chalk.bold.blue(`\nStarting Database setup for ${dbName}`));
    console.log(chalk.bold.yellow(`Removing database ${dbName}...`));
    await DatabaseConnector.dropDatabase(dbName, connectionData);

    console.log(chalk.bold.yellow(`Creating database ${dbName}...`));
    await DatabaseConnector.createDatabase(dbName, connectionData);

    connectionData.useDatabase = true;
    console.log(chalk.bold.yellow("Installing tables..."));
    const sqlScripts = await getFiles(path.join(__dirname, '..', 'sql'));
    for (const sqlScript of sqlScripts) {
        if (sqlScript === '01_create_database.sql') continue;
        console.log(chalk("Executing " + sqlScript))
        const sql = await fs.promises.readFile(path.join(__dirname, '..', 'sql', sqlScript), 'utf8');
        await DatabaseConnector.execute(sql, [], connectionData);
        console.log(chalk.green("Done!"))
    }
}

async function getFiles(dir) {
    const dirents = await fs.promises.readdir(dir, {withFileTypes: true});
    return dirents
        .filter(dirent => dirent.isFile())
        .map(dirent => dirent.name);
}