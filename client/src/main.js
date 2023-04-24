import { createApp, markRaw } from "vue";
import App from "./App.vue";
import Toast from "vue-toastification";
import "vue-toastification/dist/index.css";
import "./registerServiceWorker";
import router from "./router";

import { createPinia } from "pinia";

import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faChevronDown,
  faChevronUp,
  faGears,
  faKey,
  faSlash,
  faSort,
  faSortDown,
  faSortUp,
  faTrash,
  faUser,
  faUserEdit,
  faUserGear,
  faUserPlus,
  faUserShield,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { faCircle } from "@fortawesome/free-regular-svg-icons";

library.add(faUser, faUserShield, faUserPlus, faUserEdit);
library.add(faTrash, faXmark, faCircle, faChevronDown, faChevronUp);
library.add(faSort, faSortUp, faSortDown, faSlash);
library.add(faGears, faUserGear, faKey);

const pinia = createPinia();
pinia.use(({ store }) => {
  store.router = markRaw(router);
});
const toastOptions = {
  position: "top-right",
  timeout: 3000,
  closeOnClick: true,
  pauseOnHover: false,
  draggablePercent: 0.6,
};

createApp(App)
  .component("font-awesome-icon", FontAwesomeIcon)
  .use(router)
  .use(pinia)
  .use(Toast, toastOptions)
  .provide("PWDMINLENGTH", process.env.VUE_APP_USER_PWD_MIN_LENGTH)
  .provide("USERNAMEMINLENGTH", process.env.VUE_APP_USER_NAME_MIN_LENGTH)
  .mount("#app");
