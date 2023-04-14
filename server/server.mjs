import * as dotenv from "dotenv";
dotenv.config();

import path from "path";
import fs from "fs";
import { fileURLToPath } from 'url';
import https from "https";
import express from 'express';
import cors from 'cors';
import cookieParser from "cookie-parser";
import chalk from "chalk";
import jwt from "jsonwebtoken";

import authRouter from "./routes/auth.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const port = process.env.SERVER_PORT || 3000;

const items = [{name:'Obi Wan Kenobi', rank:'Master'}, {name:'Mace Windu', rank:'Master'}, {name:'Anakin Skywalker', rank:'Padawan'}]

const corsOptions = {
  origin: "*",
  credentials: true,
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  preflightContinue: false
}

const keyPath = path.join(__dirname, '..', 'certs', 'key.pem');
const certPath = path.join(__dirname, '..', 'certs', 'cert.pem');
if(!fs.existsSync(keyPath) || !fs.existsSync(certPath)) {
  console.error(chalk.bgRed.rgb(255,255,255).visible("No certificates found. Please run 'npm run generate-certificates' first."));
  process.exit(1);
}

const app = express();
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());

app.use('/api/auth', authRouter);

app.get('/', (req, res) => {
  res.send('Hello there! This isn\'t the page you\'re looking for. ⭐🧔⚔️');
})

https.createServer({
  key: fs.readFileSync(keyPath),
  cert: fs.readFileSync(certPath)
}, app).listen(port, () => {
  console.log(chalk.bgGreen.rgb(255,255,255).visible(`Server listening on port ${port}`));
});
