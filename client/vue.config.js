const { defineConfig } = require("@vue/cli-service");
const fs = require("fs");
const path = require("path");

module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    server: defineServerConfiguration(),
    proxy: process.env.VUE_APP_API_URI
  }
});

function defineServerConfiguration() {
  if(process.env.VUE_APP_USE_SSL) {
    return {
      type: 'https',
      options: {
        key: fs.readFileSync(path.join(__dirname, '..', 'certs', 'key.pem')),
        cert: fs.readFileSync(path.join(__dirname, '..', 'certs', 'cert.pem')),
      }
    }
  }
  return {};
}
