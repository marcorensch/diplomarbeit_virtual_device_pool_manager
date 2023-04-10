import * as dotenv from 'dotenv';

dotenv.config();
process.env.NODE_ENV = 'setup';
import * as fs from "fs";
import * as path from "path";
import {fileURLToPath} from 'url';
import crypto from "crypto";
import * as readline from "readline";
import {stdin as input, stdout as output} from "node:process";
import chalk from "chalk";

import DatabaseConnector from "./model/DatabaseConnector.mjs";


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const pathToServer = path.join(__dirname, '..', 'server');
const pathToClient = path.join(__dirname, '..', 'client');

const yesOptions = ['y', 'yes', 'j', 'ja', 'true', '1', 1, true];

async function main() {
    await setupEnvironment();
    await installDatabase();

    console.log('\n-----------------------------------------------------------------------------');
    console.log(chalk.green.bold('The configuration files have been stored!'));
    console.log("The Server Configuration file can be found at: " + chalk.bold.blue(pathToServer + "/.env"));
    console.log("The Client Configuration file can be found at: " + chalk.bold.blue(pathToClient + "/.env"));
    console.log(chalk.bold('Note:') + '\nYou can change the configuration at any time by editing the .env file.');
    console.log(chalk.bold.yellow('\nNEW SECRET TOKENS WHERE CREATED - SECRETS SHOULD NOT BE SHARED WITH ANYONE!'));
    console.log("\nPlease make sure your Database is running and the credentials are correct.");
    console.log("You can now using " + chalk.bold("npm run devStart") + " to start your server.");
    console.log('-----------------------------------------------------------------------------\n');

}

async function setupEnvironment() {
    const rl = readline.createInterface({
        input,
        output,
    });

    const question = (question) => new Promise((resolve) => rl.question(question, resolve));

    console.log(chalk.bold.blue("\nServer configuration"));

    console.log("This Script guides you through the setup of the server and the client. You can press enter to use the default value. (default:" + chalk.bold.cyan("value") + ")\n");

    const serverPort = await question("Server port (default: 3000): ") || 3000;
    const useSSL = await question("Use SSL (default: false): ") || false;

    const jwtSecret = crypto.randomBytes(64).toString('hex');
    const jwtRefreshSecret = crypto.randomBytes(64).toString('hex');
    const jwtExpiration = await question("JWT expiration time (default: 1h): ") || "1h";
    const jwtRefreshExpiration = await question("JWT refresh expiration time (default: 7d): ") || "7d";

    console.log(chalk.bold.blue("\nDatabase configuration"));
    const databaseHost = await question("Database host (default: 127.0.0.1): ") || "127.0.0.1";
    const databasePort = await question("Database port (default: 3306): ") || 3306;
    const databaseUser = await question("Database user (default: root): ") || "root";
    const databasePassword = await question("Database password (default root): ") || "root";

    rl.close();

    const serverEnv = `SERVER_PORT=${serverPort}\nUSE_SSL=${useSSL}\nDATABASE_HOST=${databaseHost}\nDATABASE_PORT=${databasePort}\nDATABASE_NAME=virtual_device_pool_manager\nDATABASE_USER=${databaseUser}\nDATABASE_PASSWORD=${databasePassword}\nJWT_SECRET=${jwtSecret}\nJWT_REFRESH_SECRET=${jwtRefreshSecret}\nJWT_EXPIRATION=${jwtExpiration}\nJWT_REFRESH_EXPIRATION=${jwtRefreshExpiration}`;
    const clientEnv = ` VUE_APP_SERVER_PORT=${serverPort}\nVUE_APP_USE_SSL=${useSSL}`;

    try {
        await fs.promises.writeFile(path.join(pathToServer, '.env'), serverEnv);
        await fs.promises.writeFile('.env', serverEnv);
        dotenv.config();
    } catch (e) {
        console.error(e);
        process.exit(1);
    }

    try {
        await fs.promises.writeFile(path.join(pathToClient, '.env'), clientEnv);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }

    console.log(chalk.bold.green("Parameters set!"));
}

async function installDatabase() {
    const rl = readline.createInterface({
        input,
        output,
    });

    const question = (question) => new Promise((resolve) => rl.question(question, resolve));

    console.log(chalk.bold.blue("\nDatabase setup"));

    let removeDatabase = await question("Do you want to remove the existing database? (default: yes): ") || true;
    let createTestDatabase = await question("Do you want to create a test database? (default: no): ") || true;

    removeDatabase = yesOptions.includes(removeDatabase);
    createTestDatabase = yesOptions.includes(createTestDatabase);

    rl.close();

    if (removeDatabase) {
        console.log(chalk.bold.yellow("Removing database..."));
        await DatabaseConnector.dropDatabase();
    }

    console.log(chalk.bold.yellow("Creating database..."));
    await DatabaseConnector.createDatabase(process.env.DATABASE_NAME);

    console.log(chalk.bold.yellow("Installing tables..."));
    const sqlScripts = await getFiles(path.join(__dirname, 'sql'));
    for (const sqlScript of sqlScripts) {
        if (sqlScript === '01_create_database.sql') continue;
        console.log(chalk("Executing " + sqlScript))
        const sql = await fs.promises.readFile(path.join(__dirname, 'sql', sqlScript), 'utf8');
        await DatabaseConnector.execute(sql);
        console.log(chalk.green("Done!"))
    }
}

async function getFiles(dir) {
    const dirents = await fs.promises.readdir(dir, { withFileTypes: true });
    return dirents
        .filter(dirent => dirent.isFile())
        .map(dirent => dirent.name);
}

await main();

process.exit(0);