<template>
  <div class="uk-section uk-section-small">
    <div class="uk-container">
      <h1>Dashboard</h1>
      <div
        class="uk-grid uk-grid-match uk-child-width-1-1 uk-child-width-1-2@s uk-child-width-1-3@m"
        uk-grid
        uk-scrollspy="cls: uk-animation-fade; target: > div; delay: 200; repeat: true"
      >
        <div v-for="(item, index) of dashboardItems" :key="index">
          <div
            class="uk-card uk-card-default uk-card-hover uk-card-body uk-text-center"
          >
            <font-awesome-icon :icon="item.icon" size="4x" />
            <h3>{{ item.label }}</h3>
            <router-link :to="item.route" class="uk-position-cover" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "DashboardView",
  data() {
    return {
      dashboardItems: [
        {
          label: "MISISDN Manager",
          icon: "fas fa-mobile-screen-button",
          route: "/admin/msisdn-manager",
        },
        {
          label: "Pool Builder",
          icon: "fas fa-database",
          route: "/admin/pool-builder",
        },
        {
          label: "GuideMe Manager",
          icon: "fas fa-book",
          route: "/admin/guideme-manager",
        },
      ],
    };
  },
};
</script>

<style scoped></style>
