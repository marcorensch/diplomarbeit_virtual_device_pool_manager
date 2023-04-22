import * as fs from "fs";

export default class EnvBuilder {

    static async buildEnv(path, content, schemaName) {
        const schema = schemas[schemaName];
        let envString = '';
        for (const [key, value] of Object.entries(content)) {
            if (schema[key]) {
                const envKey = schema[key];
                envString += `${envKey}=${value}\n`;
            }
        }

        return await fs.promises.writeFile(path, envString, {encoding: 'utf8', flag: 'w'});
    }
}

const schemas = {
    'server': {
        "API_HOST": "API_HOST",
        "API_PORT": "API_PORT",
        "USE_SSL": "USE_SSL",
        "DATABASE_HOST": "DATABASE_HOST",
        "DATABASE_PORT": "DATABASE_PORT",
        "DATABASE_USER": "DATABASE_USER",
        "DATABASE_PASSWORD": "DATABASE_PASSWORD",
        "DATABASE_NAME": "DATABASE_NAME",
        "JWT_EXPIRATION": "JWT_EXPIRATION",
        "JWT_REFRESH_EXPIRATION": "JWT_REFRESH_EXPIRATION",
        "JWT_SECRET" : "JWT_SECRET",
        "JWT_REFRESH_SECRET": "JWT_REFRESH_SECRET"
    },
    'server-test': {
        "API_HOST": "API_HOST",
        "API_PORT": "API_PORT",
        "USE_SSL": "USE_SSL",
        "DATABASE_HOST_TEST": "DATABASE_HOST",
        "DATABASE_PORT_TEST": "DATABASE_PORT",
        "DATABASE_USER_TEST": "DATABASE_USER",
        "DATABASE_PASSWORD_TEST": "DATABASE_PASSWORD",
        "DATABASE_NAME_TEST": "DATABASE_NAME",
        "JWT_EXPIRATION": "JWT_EXPIRATION",
        "JWT_REFRESH_EXPIRATION": "JWT_REFRESH_EXPIRATION",
        "JWT_SECRET" : "JWT_SECRET",
        "JWT_REFRESH_SECRET": "JWT_REFRESH_SECRET"
    },
    'client': {
        "API_PORT": "VUE_APP_SERVER_PORT",
        "USE_SSL": "VUE_APP_USE_SSL",
        "API_URI": "VUE_APP_API_URI",
    },
    'client-test': {
        "API_PORT": "VUE_APP_SERVER_PORT",
        "USE_SSL": "VUE_APP_USE_SSL",
        "API_URI": "VUE_APP_API_URI",
    },
};
