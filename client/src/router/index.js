import { createRouter, createWebHistory } from "vue-router";
import DevicesView from "../views/DevicesView.vue";

import { useAuthStore } from "@/stores/auth";

import { useToast } from "vue-toastification";
import GuidesView from "@/views/GuidesView.vue";

const toast = useToast();

const routes = [
  {
    path: "/",
    component: DevicesView,
    children: [
      {
        path: "",
        name: "search-devices",
        component: () => import("../views/devices/SearchView.vue"),
        meta: { transition: "fade" },
      },
      {
        path: "list",
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
            toast.error("You must be logged in to access this page");
            return { name: "login" };
          }
          if (authStore.hasPermission("canCreateDevices") || authStore.hasPermission("canCreateVirtualDevices")) {
            return true;
          } else {
            toast.error("You don't have permission to access this page");
            return { path: "" };
          }
        },
      },
      {
        path: "export",
        name: "export-devices",
        component: () => import("../views/devices/ExportView.vue"),
        meta: { transition: "fade" },
        beforeEnter: () => {
          const authStore = useAuthStore();
          if (!authStore.isLoggedIn) {
            toast.error("You must be logged in to access this page");
            return { name: "login" };
          }
          if (authStore.hasPermission("canExportDeviceList")) {
            return true;
          } else {
            toast.error("You don't have permission to access this page");
            return { path: "" };
          }
        },
      },

      {
        path: "edit/:id",
        name: "edit-device",
        component: () => import("../views/devices/ConfigView.vue"),
        meta: { transition: "fade" },
        props: true,
        beforeEnter: () => {
          const authStore = useAuthStore();
          if (!authStore.isLoggedIn) {
            toast.error("You must be logged in to access this page");
            return { name: "login" };
          }
          if (
            authStore.hasPermission("canUpdateDevices") ||
            authStore.hasPermission("canUpdateVirtualDevices")
          ) {
            return true;
          } else {
            toast.error("You don't have permission to access this page");
            return { path: "" };
          }
        },
      },
    ],
    meta: { title: "VDPM | Devices" },
  },
  {
    path: "/guides",
    component: GuidesView,
    children: [
        {
            path: "",
            name: "guides-front",
            component: () => import("../views/guides/GuidesOverview.vue"),
        },
        {
            path: ":id",
            name: "guide-front",
            component: () => import("../views/guides/GuideView.vue"),
        }
      ],
    meta: { title: "VDPM | Guides" },
  },
  {
    path: "/manufacturers",
    children: [
      {
        path: "",
        name: "manufacturers",
        component: () => import("../views/manufacturers/ListView.vue"),
        meta: { transition: "fade" },
        beforeEnter: () => {
          const authStore = useAuthStore();
          if (!authStore.isLoggedIn) {
            toast.error("You must be logged in to access this page");
            return { name: "login" };
          }
          if (authStore.hasPermission("canAccessManufacturersList")) {
            return true;
          } else {
            toast.error("You don't have permission to access this page");
            return { path: "" };
          }
        },
      },
      {
        path: "create",
        name: "create-manufacturer",
        component: () => import("../views/manufacturers/ConfigView.vue"),
        meta: { transition: "fade" },
        beforeEnter: () => {
          const authStore = useAuthStore();
          if (!authStore.isLoggedIn) {
            toast.error("You must be logged in to access this page");
            return { name: "login" };
          }
          if (authStore.hasPermission("canCreateManufacturer")) {
            return true;
          } else {
            toast.error("You don't have permission to access this page");
            return { path: "" };
          }
        },
      },
      {
        path: ":id/edit",
        name: "edit-manufacturer",
        component: () => import("../views/manufacturers/ConfigView.vue"),
        meta: { transition: "fade" },
        beforeEnter: () => {
          const authStore = useAuthStore();
          if (!authStore.isLoggedIn) {
            toast.error("You must be logged in to access this page");
            return { name: "login" };
          }
          if (authStore.hasPermission("canUpdateManufacturer")) {
            return true;
          } else {
            toast.error("You don't have permission to access this page");
            return { path: "" };
          }
        },
      },
    ],
    meta: { title: "VDPM | Manufacturers" },
  },
  {
    path: "/login",
    name: "login",
    component: () => import("../views/LoginView.vue"),
    meta: { transition: "fade", title: "VDPM | Login" },
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
    meta: { title: "VDPM | User Settings" },
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
          if (authStore.hasPermission("canAccessMsisdnManager")) {
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
          if (
            authStore.hasPermission("canAccessMsisdnManager") &&
            authStore.hasPermission("canUpdateMsisdn")
          ) {
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
          if (
            authStore.hasPermission("canAccessMsisdnManager") &&
            authStore.hasPermission("canCreateMsisdn")
          ) {
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
          if (
            authStore.hasPermission("canAccessAdmin") &&
            authStore.hasPermission("canAccessAccountManager")
          ) {
            return true;
          } else {
            toast.error("You are not allowed to access this page");
            return { path: "" };
          }
        },
      },
      {
        path: "pool-builder",
        name: "pool-builder",
        component: () => import("../views/admin/BuilderView.vue"),
        children: [
          {
            path: "",
            name: "locations",
            component: () => import("../views/admin/builder/LocationsView.vue"),
          },
          {
            path: "location/:id",
            name: "location",
            component: () => import("../views/admin/builder/CabinetsView.vue"),
          },
          {
            path: "cabinet/:id",
            name: "cabinet",
            component: () => import("../views/admin/builder/CabinetView.vue"),
          },
        ],
        beforeEnter: () => {
          const authStore = useAuthStore();
          if (!authStore.isLoggedIn) {
            toast.error("You must be logged in to access this page");
            return { name: "login" };
          }
          if (
            authStore.hasPermission("canAccessAdmin") &&
            authStore.hasPermission("canAccessPoolBuilder")
          ) {
            return true;
          } else {
            toast.error("You are not allowed to access this page");
            return { name: "devices" };
          }
        },
      },
      {
        path: "guides",
        name: "",
        component: () => import("../views/admin/GuideMeView.vue"),
        beforeEnter: () => {
          const authStore = useAuthStore();
          if (
            authStore.hasPermission("canAccessAdmin") &&
            authStore.hasPermission("canAccessGuideMeManager")
          ) {
            return true;
          } else {
            toast.error("You are not allowed to access this page");
            return { path: "" };
          }
        },
        children: [
          {
            path: "",
            name: "guides",
            component: () =>
              import("../views/admin/guideme/GuideMeListView.vue"),
          },
          {
            path: "create",
            name: "admin-guide-create",
            component: () =>
              import("../views/admin/guideme/GuideMeEditorView.vue"),
          },
          {
            path: "edit/:id",
            name: "admin-guide-edit",
            component: () =>
              import("../views/admin/guideme/GuideMeEditorView.vue"),
          },
          {
            path: ":id",
            name: "admin-guide-slides",
            component: () =>
              import("../views/admin/guideme/SlidesManagerView.vue"),
          },
          {
            path: "slides/:id",
            name: "admin-guide-slide-edit",
            component: () => import("../views/admin/guideme/EditSlide.vue"),
          },
        ],
      },
    ],
    meta: { title: "VDPM | Administration" },
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

router.beforeEach((to, from, next) => {
  document.title = to.meta.title;
  next();
});

export default router;
