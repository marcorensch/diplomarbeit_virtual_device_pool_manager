import { createRouter, createWebHistory } from "vue-router";
import DevicesView from "../views/DevicesView.vue";

import { useAuthStore } from "@/stores/auth";

import { useToast } from "vue-toastification";
const toast = useToast();

const routes = [
  {
    path: "/",
    name: "devices",
    component: DevicesView,
  },
  {
    path: "/login",
    name: "login",
    component: () => import("../views/LoginView.vue"),
    meta: { transition: "slide-bottom" },
  },
  {
    path: "/user-settings",
    name: "user-settings",
    component: () => import("../views/UserSettingsView.vue"),
  },
  {
    path: "/admin",
    name: "admin",
    component: () => import("../views/admin/AdminView.vue"),
  },
  {
    path: "/admin/users",
    name: "users",
    component: () => import("../views/admin/UsersView.vue"),
    beforeEnter: () => {
      const authStore = useAuthStore();
      if (!authStore.isLoggedIn) {
        toast.error("You must be logged in to access this page");
        return { name: "login" };
      }
      if (authStore.hasPermission("canAccessAdmin")) {
        return true;
      } else {
        toast.error("You do not have permission to access this page");
        return { name: "home" };
      }
    },
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
