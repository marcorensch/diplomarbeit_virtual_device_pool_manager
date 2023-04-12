import * as dotenv from "dotenv";
dotenv.config();

import express from 'express';
import chalk from "chalk";

const app = express();
const port = process.env.SERVER_PORT || 3000;

app.get('/', (req, res) => {
  res.send('Hello World');
})

app.listen(port, () => {
  console.log(chalk.bgGreen.rgb(255,255,255).visible(` Server is running on port ${port} `));
})
