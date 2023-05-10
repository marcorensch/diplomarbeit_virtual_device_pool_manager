<template>
  <div class="uk-section uk-section-small">
    <div class="uk-container">
      <h1>Dashboard</h1>
      <div
        class="uk-grid uk-grid-match uk-child-width-1-1 uk-child-width-1-2@s uk-child-width-1-3@m"
        uk-grid
        uk-scrollspy="cls: uk-animation-fade; target: > div; delay: 200; repeat: true"
      >
        <template v-for="(item, index) of dashboardItems" :key="index">
          <div v-if="authStore.hasPermissions(item.requiredPermissions)">
            <div
              class="uk-card uk-card-default uk-card-hover uk-card-body uk-text-center"
            >
              <font-awesome-icon :icon="item.icon" size="4x" />
              <h3>{{ item.label }}</h3>
              <router-link :to="item.path" class="uk-position-cover" />
            </div>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import { useAuthStore } from "@/stores/auth";
export default {
  name: "DashboardView",
  emits: ["navSelected"],
  data() {
    return {
      authStore: useAuthStore(),
      dashboardItems: [
        {
          label: "MISISDN Manager",
          icon: "fas fa-mobile-screen-button",
          path: "/admin/msisdn-manager",
          requiredPermissions: ["canAccessMsisdnManager"],
        },
        {
          label: "Account Manager",
          icon: "fas fa-users",
          path: "/admin/accounts",
          requiredPermissions: ["canAccessAccountManager"],
        },
        {
          label: "Pool Builder",
          icon: "fas fa-cubes",
          path: "/admin/pool-builder",
          requiredPermissions: ["canAccessPoolBuilder"],
        },
        {
          label: "GuideMe Manager",
          icon: "fas fa-book",
          path: "/admin/guideme-manager",
          requiredPermissions: ["canAccessGuideMeManager"],
        },
      ],
    };
  },
  methods: {},
  unmounted() {
    this.$emit("navSelected");
  },
};
</script>

<style scoped></style>
