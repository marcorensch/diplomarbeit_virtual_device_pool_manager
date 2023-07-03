<template>
  <div>
    <div class="uk-card uk-card-default">
      <div class="uk-card-header">
        <h3 class="uk-card-title">
          <font-awesome-icon :icon="['fas', 'trash']" /> Delete Account
        </h3>
      </div>
      <div class="uk-card-body">
        <p class="uk-text-muted uk-text-center">
          A deleted account cannot be restored.
        </p>
      </div>
      <div class="uk-card-footer">
        <div class="uk-grid-small" uk-grid>
          <div class="uk-flex uk-flex-middle">
            <input
              type="checkbox"
              id="verify-delete-account"
              class="nxd-slide-checkbox"
              v-model="verifyDeleteAccount"
            />
          </div>
          <div class="uk-width-expand">
            <button
              class="uk-button uk-button-danger uk-width-1-1"
              type="button"
              @click="deleteAccount"
              :class="{ 'uk-disabled': !verifyDeleteAccount }"
            >
              Delete account
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useAuthStore } from "@/stores/auth";
export default {
  name: "DeleteAccountWidget",
  data() {
    return {
      auth: useAuthStore(),
      verifyDeleteAccount: false,
    };
  },
  methods: {
    async deleteAccount() {
      await this.auth.deleteAccount();
    },
  },
};
</script>

<style scoped></style>
