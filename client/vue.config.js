const { defineConfig } = require("@vue/cli-service");
const fs = require("fs");
const path = require("path");

module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    server: defineServerConfiguration(),
    proxy: process.env.VUE_APP_API_URI,
  },
});

function defineServerConfiguration() {
  console.log("Configuring dev server");
  const certFile = path.join(__dirname, "..", "certs", "cert.pem");
  const keyFile = path.join(__dirname, "..", "certs", "key.pem");
  if (process.env.VUE_APP_USE_SSL) {
    if (fs.existsSync(certFile) && fs.existsSync(keyFile)) {
      console.log("Using https");
      return {
        type: "https",
        options: {
          key: fs.readFileSync(keyFile),
          cert: fs.readFileSync(certFile),
        },
      };
    } else {
      console.error(
        "No certificates found. Please run 'npm run generate-certificates' first or check certificates."
      );
      process.exit(1);
    }
  }
  return {};
}
