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
        name: "widgets",
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
            toast.error("You must be logged in to access this page");
            return { name: "login" };
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
    path: "/manufacturers",
    children: [
      {
        path: "",
        name: "manufacturers",
        component: () => import("../views/manufacturers/ListView.vue"),
        meta: { transition: "fade" },
      },
      {
        path: "create",
        name: "create-manufacturer",
        component: () => import("../views/manufacturers/ConfigView.vue"),
        meta: { transition: "fade" },
      },
      {
        path: ":id/edit",
        name: "edit-manufacturer",
        component: () => import("../views/manufacturers/ConfigView.vue"),
        meta: { transition: "fade" },
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
    component: () => import("../views/admin/AdminView.vue"),
    beforeEnter: () => {
      const authStore = useAuthStore();
      if (!authStore.isLoggedIn) {
        toast.error("You must be logged in to access this page");
        return { name: "login" };
      }
      if (authStore.hasPermission("canAccessAdmin")) {
        return true;
      } else {
        toast.error("You are not allowed to access this page");
        return { path: "" };
      }
    },
    children: [
      {
        path: "",
        name: "admin",
        component: () => import("../views/admin/DashboardView.vue"),
        beforeEnter: () => {
          const authStore = useAuthStore();
          if (!authStore.isLoggedIn) {
            toast.error("You must be logged in to access this page");
            return { name: "login" };
          }
          if (authStore.hasPermission("canAccessAdmin")) {
            return true;
          } else {
            toast.error("You are not allowed to access this page");
            return { path: "" };
          }
        },
      },
      {
        path: "msisdn-manager",
        name: "msisdn-manager",
        component: () => import("../views/admin/msisdn/MsisdnManagerView.vue"),
        beforeEnter: () => {
          const authStore = useAuthStore();
          if (!authStore.isLoggedIn) {
            toast.error("You must be logged in to access this page");
            return { name: "login" };
          }
          if (authStore.hasPermission("canAccessAdmin")) {
            return true;
          } else {
            toast.error("You are not allowed to access this page");
            return { path: "" };
          }
        },
      },
      {
        path: "msisdn-edit/:id",
        name: "msisdn-edit",
        component: () => import("../views/admin/msisdn/MsisdnEditorView.vue"),
        beforeEnter: () => {
          const authStore = useAuthStore();
          if (!authStore.isLoggedIn) {
            toast.error("You must be logged in to access this page");
            return { name: "login" };
          }
          if (authStore.hasPermission("canUpdateNumbers")) {
            return true;
          } else {
            toast.error("You are not allowed to access this page");
            return { path: "" };
          }
        },
        props: true,
      },
      {
        path: "msisdn-add",
        name: "msisdn-add",
        component: () => import("../views/admin/msisdn/MsisdnEditorView.vue"),
        beforeEnter: () => {
          const authStore = useAuthStore();
          if (!authStore.isLoggedIn) {
            toast.error("You must be logged in to access this page");
            return { name: "login" };
          }
          if (authStore.hasPermission("canCreateNumbers")) {
            return true;
          } else {
            toast.error("You are not allowed to access this page");
            return { path: "" };
          }
        },
      },
      {
        path: "accounts",
        name: "accounts",
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
            toast.error("You are not allowed to access this page");
            return { path: "" };
          }
        },
      },
    ],
  },

  {
    path: "/*",
    name: "NotFound",
    beforeEnter: () => {
      toast.error("Page not found");
      return { name: "widgets" };
    },
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
