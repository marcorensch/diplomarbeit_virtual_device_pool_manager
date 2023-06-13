<template>
  <div class="uk-section">
    <div class="uk-container">
      <div class="uk-width-large uk-margin-auto">
        <div class="uk-card uk-card-default login">
          <div class="uk-card-header">
            <h3 class="uk-card-title">
              <div class="uk-flex-middle uk-grid-small" uk-grid>
                <div class="uk-width-auto">
                  <font-awesome-icon
                    :icon="['fas', 'user']"
                    class="uk-preserve-width uk-heading-large"
                  />
                </div>
                <div class="uk-width-expand">
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
                    id="login-username"
                    ref="login-username"
                    tabindex="1"
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
                    tabindex="2"
                    type="password"
                    name="password"
                    placeholder="Password"
                    v-model="form.password"
                  />
                </div>
              </div>
            </div>
            <div class="uk-card-footer">
              <div
                class="uk-flex-right@m uk-grid-small uk-child-width-1-1 uk-child-width-expand@m"
                uk-grid
              >
                <div>
                  <button
                    tabindex="3"
                    class="uk-button uk-button-primary uk-width-1-1"
                    type="submit"
                  >
                    Login
                  </button>
                </div>
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
  refs: ["username"],
  data() {
    return {
      auth: auth,
      form: {
        username: "",
        password: "",
      },
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.$refs["login-username"].focus();
    });
  },
  methods: {
    handleLoginClicked(e) {
      e.preventDefault();
      this.auth.login(this.form.username, this.form.password);
    },
  },
};
</script>

<style></style>
