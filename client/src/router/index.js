import { createRouter, createWebHistory } from "vue-router";
import DevicesView from "../views/DevicesView.vue";

import { useAuthStore } from "@/stores/auth";

import { useToast } from "vue-toastification";
const toast = useToast();

const routes = [
  {
    path: "/",
    component: DevicesView,
    children: [
      {
        path: "",
        name: "devices",
        component: () => import("../views/devices/ListView.vue"),
        meta: { transition: "fade" },
      },
      {
        path: "create",
        name: "create-device",
        component: () => import("../views/devices/ConfigView.vue"),
        meta: { transition: "fade" },
        beforeEnter: () => {
          const authStore = useAuthStore();
          if (!authStore.isLoggedIn) {
            return { name: "NotFound" };
          }
          if (authStore.hasPermission("canCreateDevices")) {
            return true;
          } else {
            return { name: "NotFound" };
          }
        },
      },
    ],
  },
  {
    path: "/login",
    name: "login",
    component: () => import("../views/LoginView.vue"),
    meta: { transition: "fade" },
  },
  {
    path: "/user-settings",
    name: "user-settings",
    component: () => import("../views/UserSettingsView.vue"),
    beforeEnter: () => {
      const authStore = useAuthStore();
      if (authStore.isLoggedIn) {
        return true;
      } else {
        toast.error("You must be logged in to access this page");
        return { name: "login" };
      }
    },
  },
  {
    path: "/admin",
    name: "admin",
    component: () => import("../views/admin/AdminView.vue"),
    beforeEnter: () => {
      const authStore = useAuthStore();
      if (!authStore.isLoggedIn) {
        return { name: "NotFound" };
      }
      if (authStore.hasPermission("canAccessAdmin")) {
        return true;
      } else {
        return { name: "NotFound" };
      }
    },
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
        return { name: "devices" };
      }
    },
  },
  {
    path: "/*",
    name: "NotFound",
    beforeEnter: () => {
      toast.error("Page not found");
      return { name: "devices" };
    },
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
