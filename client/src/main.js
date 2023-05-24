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
  faArrowLeft,
  faBars,
  faBook,
  faBuilding,
  faCameraRetro,
  faCheck,
  faChevronDown,
  faChevronLeft,
  faChevronRight,
  faChevronUp,
  faCircleQuestion,
  faCity,
  faCloud,
  faCloudArrowUp,
  faCog,
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
  faLock,
  faMicrochip,
  faMobileRetro,
  faMobileScreenButton,
  faNoteSticky,
  faPencil,
  faPlus,
  faSlash,
  faSort,
  faSortDown,
  faSortUp,
  faSquare,
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
  faCircle,
  faLink,
  faArrowUpRightFromSquare,
  faGripLinesVertical,
  faExclamationTriangle,
  faCheckCircle,
  faSearch,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

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
  faCubes,
  faLink,
  faArrowUpRightFromSquare,
  faGripLinesVertical,
  faExclamationTriangle,
  faCheckCircle,
  faSearch
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
  faSquare,
  faFolderPlus,
  faCloudArrowUp,
  faTableCells,
  faFolder,
  faHome,
  faBars,
  faCircleQuestion,
  faNoteSticky,
  faCheck,
  faCloud
);
library.add(faBuilding, faCog, faArrowLeft, faCity, faLock, faCircle);

const pinia = createPinia();
pinia.use(({ store }) => {
  store.router = markRaw(router);
});
const toastOptions = {
  position: "top-right",
  timeout: 5000,
  closeOnClick: true,
  pauseOnHover: true,
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
