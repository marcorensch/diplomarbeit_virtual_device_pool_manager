import { createApp } from "vue";
import App from "./App.vue";
import Toast from "vue-toastification";
import "vue-toastification/dist/index.css";
import "./registerServiceWorker";
import router from "./router";

import { createPinia } from "pinia";

import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faTrash,
  faUser,
  faUserEdit,
  faUserPlus,
  faUserShield,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

library.add(faUser, faUserShield, faUserPlus, faUserEdit);
library.add(faTrash, faXmark);

const pinia = createPinia();
const toastOptions = {};

createApp(App)
  .component("font-awesome-icon", FontAwesomeIcon)
  .use(router)
  .use(pinia)
  .use(Toast, toastOptions)
  .mount("#app");
