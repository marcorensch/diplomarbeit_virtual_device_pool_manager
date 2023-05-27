import express from "express";
import path from "path";
import {fileURLToPath} from 'url';
import chalk from "chalk";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 8080;
app.use(express.static(path.join(__dirname, 'client', 'dist')));

app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, 'client', 'dist', 'index.html'));
});

app.listen(port, () => {
    console.log(chalk.bgBlueBright.rgb(255, 255, 255).visible(` Client available on port ${port} `));
});
