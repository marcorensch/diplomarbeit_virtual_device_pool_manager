import { createApp } from "vue";
import App from "./App.vue";
import "./registerServiceWorker";
import router from "./router";

import { createPinia } from "pinia";

import { library } from "@fortawesome/fontawesome-svg-core";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

library.add(faUser);

const pinia = createPinia();

createApp(App)
  .component("font-awesome-icon", FontAwesomeIcon)
  .use(router)
  .use(pinia)
  .mount("#app");
