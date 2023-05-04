import { createApp, markRaw } from "vue";
import App from "./App.vue";
import Toast from "vue-toastification";
import "vue-toastification/dist/index.css";
import "./registerServiceWorker";
import router from "./router";

import { createPinia } from "pinia";

// add interceptor through side effects
import "./api/axios";

import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faBook,
  faCameraRetro,
  faChevronDown,
  faChevronLeft,
  faChevronRight,
  faChevronUp,
  faCloudArrowUp,
  faCubes,
  faDatabase,
  faFolder,
  faFolderOpen,
  faFolderPlus,
  faGears,
  faGrip,
  faGripLines,
  faHome,
  faKey,
  faLaptop,
  faMicrochip,
  faMobileRetro,
  faMobileScreenButton,
  faPencil,
  faPlus,
  faSlash,
  faSort,
  faSortDown,
  faSortUp,
  faSquareCheck,
  faTableCells,
  faTableList,
  faTabletScreenButton,
  faTrash,
  faTv,
  faUser,
  faUserCheck,
  faUserEdit,
  faUserGear,
  faUserPlus,
  faUsers,
  faUserShield,
  faWarehouse,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { faCircle } from "@fortawesome/free-regular-svg-icons";

library.add(
  faUser,
  faUserCheck,
  faUserShield,
  faUserPlus,
  faUserEdit,
  faUsers,
  faPencil,
  faTableList,
  faGripLines,
  faGrip,
  faFolderOpen
);
library.add(
  faTrash,
  faXmark,
  faCircle,
  faChevronDown,
  faChevronUp,
  faChevronRight,
  faChevronLeft,
  faCubes
);
library.add(faSort, faSortUp, faSortDown, faSlash);
library.add(
  faGears,
  faUserGear,
  faKey,
  faPlus,
  faWarehouse,
  faDatabase,
  faBook
);
library.add(
  faMobileScreenButton,
  faMobileRetro,
  faTabletScreenButton,
  faLaptop,
  faTv,
  faCameraRetro,
  faMicrochip
);
library.add(
  faSquareCheck,
  faFolderPlus,
  faCloudArrowUp,
  faTableCells,
  faFolder,
  faHome
);

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
