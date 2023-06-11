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
import helmet from "helmet";
import rateLimiterMiddleware from "./middlewares/RateLimiter.mjs";
import cookieParser from "cookie-parser";
import chalk from "chalk";

import authRouter from "./routes/auth.mjs";
import adminRouter from "./routes/admin.mjs";
import rolesRouter from "./routes/roles.mjs";
import accountsRouter from "./routes/accounts.mjs";
import manufacturersRouter from "./routes/manufacturers.mjs";
import filemanagerRouter from "./routes/filemanager.mjs";
import devicesRouter from "./routes/devices.mjs";
import devicesTypesRouter from "./routes/devicetypes.mjs";
import msisdnsRouter from "./routes/msisdns.mjs";
import devicePoolRouter from "./routes/devicepool.mjs";
import guidesRouter from "./routes/guides.mjs";

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
app.use(helmet());
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());
if(process.env.NODE_ENV.toUpperCase() !== 'TEST') {
    app.use(rateLimiterMiddleware)
}

app.use("/public", express.static('public'));
app.use('/api/auth', authRouter);
app.use('/api/admin', adminRouter);
app.use('/api/roles', rolesRouter);
app.use('/api/accounts', accountsRouter);
app.use('/api/manufacturers', manufacturersRouter);
app.use('/api/filemanager', filemanagerRouter);
app.use('/api/devices', devicesRouter);
app.use('/api/devicetypes', devicesTypesRouter);
app.use('/api/msisdns', msisdnsRouter);
app.use('/api/devicepool', devicePoolRouter);
app.use('/api/guides', guidesRouter);

app.get('/', (req, res) => {
    res.send('Hello there! The Backend is reachable');
})

app.use((req, res, next) => {
    res.status(404).send("Sorry can't find that!")
})

app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(500).send('Something broke!')
})


if(process.env.USE_SSL === "true") {
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
        console.log(chalk.bgGreen.rgb(255, 255, 255).visible(` Server listening on port ${port} with SSL `));
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
