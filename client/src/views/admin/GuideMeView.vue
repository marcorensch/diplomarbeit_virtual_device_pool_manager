<template>
  <div class="uk-section uk-section-small builder-view">
    <div class="uk-container">
      <div>
        <h1 class="uk-h4 uk-margin-remove-bottom">GuideMe Manager</h1>
      </div>
      <div>
        <router-view v-slot="{ Component, route }">
          <transition :name="route.meta.transition || 'fade'" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "GuideMeView",
  components: {},
};
</script>

<style scoped></style>
