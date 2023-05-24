<template>
  <div
    class="uk-width-1-1 uk-border-rounded uk-background-muted uk-padding-small"
  >
    <div class="actions uk-flex uk-flex-right">
      <div
        v-if="
          authStore.hasPermission('canCreateDevices') ||
          authStore.hasPermission('canCreateVirtualDevices')
        "
      >
        <div
          class="uk-button uk-button-primary uk-flex uk-flex-middle"
          @click="handleAddDeviceClicked"
        >
          <font-awesome-icon :icon="['fas', 'plus']" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useAuthStore } from "@/stores/auth";
export default {
  name: "devicesActionbar",
  emits: ["create-device"],
  setup() {
    const authStore = useAuthStore();
    return {
      authStore,
    };
  },
  methods: {
    handleAddDeviceClicked() {
      this.$emit("create-device");
    },
  },
};
</script>

<style scoped></style>
