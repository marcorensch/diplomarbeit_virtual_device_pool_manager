<template>
  <div class="uk-section">
    <div class="uk-container">
      <div class="uk-width-large uk-margin-auto">
        <div class="uk-card uk-card-default login">
          <div class="uk-card-header">
            <h3 class="uk-card-title">
              <div class="uk-flex uk-grid-small">
                <div class="uk-flex uk-flex-middle">
                  <font-awesome-icon :icon="['fas', 'user']" />
                </div>
                <div>
                  <div class="uk-h3 uk-text-bold uk-margin-remove">
                    Virtual Device Pool Manager
                  </div>
                  <div class="uk-text-large">Login</div>
                </div>
              </div>
            </h3>
          </div>
          <form @submit="handleLoginClicked">
            <div class="uk-card-body">
              <div class="uk-form">
                <div class="uk-margin">
                  <input
                    class="uk-input"
                    type="text"
                    name="username"
                    placeholder="Username"
                    v-model="form.username"
                  />
                </div>

                <div class="uk-margin">
                  <input
                    class="uk-input"
                    type="password"
                    name="password"
                    placeholder="Password"
                    v-model="form.password"
                  />
                </div>
              </div>
            </div>
            <div
              class="uk-card-footer uk-flex uk-flex-right uk-grid-small uk-child-width-expand"
            >
              <div>
                <button
                  class="uk-button uk-button-secondary uk-width-1-1"
                  @click="handleRequestAccountClicked"
                  type="button"
                >
                  Request Account
                </button>
              </div>
              <div>
                <button
                  class="uk-button uk-button-primary uk-width-1-1"
                  type="submit"
                >
                  Login
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { useAuthStore } from "@/stores/auth";
const auth = useAuthStore();

export default {
  name: "LoginContainer",
  data() {
    return {
      auth: auth,
      form: {
        username: "",
        password: "",
      },
    };
  },
  methods: {
    handleLoginClicked(e) {
      e.preventDefault();
      this.auth.login(this.form.username, this.form.password);
    },
    handleRequestAccountClicked() {
      console.log("Request Account Clicked");
    },
  },
};
</script>

<style></style>
