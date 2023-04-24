import * as dotenv from 'dotenv';

dotenv.config();
process.env.NODE_ENV = 'setup';

import * as path from "path";
import inquirer from 'inquirer';
import {fileURLToPath} from 'url';
import chalk from "chalk";
import crypto from "crypto";
import EnvBuilder from "./model/EnvBuilder.mjs";
import {createSSL, installDatabase, createAdministrator} from "./helpers/utilities.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const pathToServer = path.join(__dirname, '..', 'server');
const pathToClient = path.join(__dirname, '..', 'client');


const questions = [
    {
        type: 'input',
        name: 'API_HOST',
        message: 'Server API host?',
        default() {
            return 'localhost'
        },
    },
    {
        type: 'input',
        name: 'API_PORT',
        message: 'Server API port?',
        default() {
            return 3000;
        },
        filter: Number,
    },
    {
        type: 'confirm',
        name: 'USE_SSL',
        message: 'Use SSL?',
        default() {
            return true
        },
    },
    {
        type: 'confirm',
        name: 'createCertificates',
        message: 'Create (Self Signed) SSL certificates?',
        default() {
            return true
        },
        when: (answers) => answers.USE_SSL
    },
    {
        type: 'input',
        name: 'DATABASE_HOST',
        message: 'Database host?',
        default() {
            return '127.0.0.1'
        }
    },
    {
        type: 'input',
        name: 'DATABASE_PORT',
        message: 'Database port?',
        default() {
            return 3306;
        },
        filter: Number,
    },
    {
        type: 'input',
        name: 'DATABASE_USER',
        message: 'Database user?',
        default() {
            return 'root'
        }
    },
    {
        type: 'input',
        name: 'DATABASE_PASSWORD',
        message: 'Database password?',
        default() {
            return 'root'
        }
    },
    {
        type: 'confirm',
        name: 'createTestDatabase',
        message: 'Create test database?',
        default() {
            return true
        }
    },
    {
        type: 'input',
        name: 'DATABASE_HOST_TEST',
        message: 'Test database host?',
        default() {
            return '127.0.0.1'
        },
        when: (answers) => answers.createTestDatabase
    },
    {
        type: 'input',
        name: 'DATABASE_PORT_TEST',
        message: 'Test database port?',
        default() {
            return 3306;
        },
        filter: Number,
        when: (answers) => answers.createTestDatabase
    },
    {
        type: 'input',
        name: 'DATABASE_USER_TEST',
        message: 'Test database user?',
        default() {
            return 'root'
        },
        when: (answers) => answers.createTestDatabase
    },
    {
        type: 'input',
        name: 'DATABASE_PASSWORD_TEST',
        message: 'Test database password?',
        default() {
            return 'root'
        },
        when: (answers) => answers.createTestDatabase
    },
    {
        type: 'input',
        name: 'JWT_EXPIRATION',
        message: 'JWT expiration time?',
        default() {
            return '1h'
        },
        validate(value) {
            const pass = value.match(
                /^\d+[smhdwy]$/i
            );
            if (pass) {
                return true;
            }
            return 'Please enter a valid duration (e.g. 1h, 30m, 1d, 1w, 1y)';
        },
    },
    {
        type: 'input',
        name: 'JWT_REFRESH_EXPIRATION',
        message: 'JWT refresh expiration time?',
        default() {
            return '7d'
        },
        validate(value) {
            const pass = value.match(
                /^\d+[smhdwy]$/i
            );
            if (pass) {
                return true;
            }

            return 'Please enter a valid duration (e.g. 1h, 30m, 1d, 1w, 1y)';
        },
    },
    {
        type: 'input',
        name: 'adminPassword',
        message: 'Admin password?',
        default() {
            return false
        }
    }

]
let answers = await inquirer.prompt(questions).then((answers) => {
    return answers;
});

// add generated values
answers.DATABASE_NAME = "virtual_device_pool_manager";
answers.DATABASE_NAME_TEST = "virtual_device_pool_manager_test";
answers.API_URI = `http${answers.USE_SSL ? 's' : ''}://${answers.API_HOST}:${answers.API_PORT}`;
answers.JWT_SECRET = crypto.randomBytes(64).toString('hex');
answers.JWT_REFRESH_SECRET = crypto.randomBytes(64).toString('hex');
answers.USER_PWD_MIN_LENGTH = 8;
answers.USER_NAME_MIN_LENGTH = 7;

const envConfigurations = [
    {
        schema: 'server',
        path: path.join(pathToServer, '.env'),
    },
    {
        schema: 'server-test',
        path: path.join(pathToServer, '.env.test'),
    },
    {
        schema: 'client',
        path: path.join(pathToClient, '.env'),
    },
    {
        schema: 'client-test',
        path: path.join(pathToClient, '.env.test'),
    }
];

try {
    for (const envConfig of envConfigurations) {
        EnvBuilder.buildEnv(envConfig.path, answers, envConfig.schema);
    }
} catch (e) {
    console.error(e);
    process.exit(1);
}

if (answers.createCertificates) {
    await createSSL(answers.API_HOST);
}

if (answers.createTestDatabase) {
    try {
        const connectionData = {
            host: answers.DATABASE_HOST_TEST,
            port: answers.DATABASE_PORT_TEST,
            user: answers.DATABASE_USER_TEST,
            password: answers.DATABASE_PASSWORD_TEST,
            useDatabase: false,
            database: answers.DATABASE_NAME_TEST,
        }
        await installDatabase(answers.DATABASE_NAME_TEST, connectionData);
        connectionData.useDatabase = true;
        await createAdministrator(answers.DATABASE_NAME_TEST, "test", connectionData);
    }catch (e) {
        console.error(e);
        process.exit(1);
    }
}

try {
    const connectionData = {
        host: answers.DATABASE_HOST,
        port: answers.DATABASE_PORT,
        user: answers.DATABASE_USER,
        password: answers.DATABASE_PASSWORD,
        useDatabase: false,
        database: answers.DATABASE_NAME,
    }
    await installDatabase(answers.DATABASE_NAME, connectionData);
    connectionData.useDatabase = true;
    await createAdministrator(answers.DATABASE_NAME_TEST, answers.adminPassword, connectionData);
}catch (e) {
    console.error(e);
    process.exit(1);
}


console.log('\n-----------------------------------------------------------------------------');
console.log("You can now using " + chalk.bold("npm run devStart") + " to start your server locally.");
console.log('-----------------------------------------------------------------------------\n');