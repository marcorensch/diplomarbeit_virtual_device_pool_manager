<template>
  <div
    class="uk-section uk-section-small devices-list-view"
    uk-height-viewport="offset-top:true"
  >
    <div class="uk-container">
      <h1>Device Brands</h1>
      <div
        class="uk-width-1-1 uk-border-rounded uk-background-muted uk-padding-small"
      >
        <div class="uk-flex uk-flex-right">
          <div v-if="authStore.hasPermission('can')">
            <router-link
              :to="{ name: 'create-device' }"
              class="uk-button uk-button-primary"
            >
              <font-awesome-icon :icon="['fas', 'plus']" /> Add Device
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "listView",
};
</script>

<style scoped></style>
