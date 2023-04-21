import * as dotenv from "dotenv";

const getDotEnvPath = (env) => {
    if (env === 'TEST') {
        return '.env.test'
    }
    return '.env'
}

dotenv.config({path: path.resolve(process.cwd(), getDotEnvPath(process.env.NODE_ENV?.toUpperCase()))});

import path from "path";
import fs from "fs";
import {fileURLToPath} from 'url';
import https from "https";
import express from 'express';
import cors from 'cors';
import cookieParser from "cookie-parser";
import chalk from "chalk";

import authRouter from "./routes/auth.mjs";
import usersRouter from "./routes/users.mjs";
import rolesRouter from "./routes/roles.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const port = process.env.API_PORT || 3000;

const corsOptions = {
    origin: "*",
    credentials: true,
    optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    preflightContinue: false
}

const app = express();
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());

app.use('/api/auth', authRouter);
app.use('/api/users', usersRouter);
app.use('/api/roles', rolesRouter);

app.get('/', (req, res) => {
    res.send('Hello there! This isn\'t the page you\'re looking for. ⭐🧔⚔️');
})

if(process.env.USE_SSL === true) {
    const keyPath = path.join(__dirname, '..', 'certs', 'key.pem');
    const certPath = path.join(__dirname, '..', 'certs', 'cert.pem');
    if (!fs.existsSync(keyPath) || !fs.existsSync(certPath)) {
        console.error(chalk.bgRed.rgb(255, 255, 255).visible("No certificates found. Please run 'npm run generate-certificates' first."));
        process.exit(1);
    }

    https.createServer({
        key: fs.readFileSync(keyPath),
        cert: fs.readFileSync(certPath)
    }, app).listen(port, () => {
        console.log(chalk.bgGreen.rgb(255, 255, 255).visible(` Server listening on port ${port} with SSL`));
        if (process.env.NODE_ENV === 'test') {
            console.log(chalk.bgYellow.whiteBright(" Starting Server in Test Mode "));
        }
    });
} else {
    app.listen(port, () => {
        console.log(chalk.bgGreen.rgb(255, 255, 255).visible(` Server listening on port ${port} without SSL`));
        if (process.env.NODE_ENV === 'test') {
            console.log(chalk.bgYellow.whiteBright(" Starting Server in Test Mode "));
        }
    });
}


export {app};
