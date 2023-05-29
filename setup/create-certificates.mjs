import {createSSL} from "./helpers/utilities.mjs";
createSSL("localhost").then(r => console.log(r));