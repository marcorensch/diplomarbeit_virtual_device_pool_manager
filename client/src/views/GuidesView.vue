<template>
  <div class="devices-view uk-position-relative">
    <router-view v-slot="{ Component, route }">
      <transition :name="route.meta.transition || 'fade'" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>
  </div>
</template>

<script>

export default {
  name: "GuidesView"
}
</script>



<style scoped>

</style>