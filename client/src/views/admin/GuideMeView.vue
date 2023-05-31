<template>
  <div class="uk-section uk-section-small builder-view">
    <div class="uk-container">
      <div>
        <h4 class="uk-margin-remove-bottom">GuideMe Manager</h4>
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
