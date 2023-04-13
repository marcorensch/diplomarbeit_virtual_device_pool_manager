<template>
  <div class="uk-section">
    <div class="uk-container">
      <div class="uk-width-large uk-margin-auto">
        <div class="uk-card uk-card-default">
          <div class="uk-card-header">
            <h3 class="uk-card-title">
              <font-awesome-icon :icon="['fas', 'user']" />
              <span class="uk-margin-small-left">Login</span>
            </h3>
          </div>
          <div class="uk-card-body">
            <div class="uk-form">
              <div class="uk-margin">
                <input
                  class="uk-input"
                  type="text"
                  name="username"
                  placeholder="Username"
                  v-model="username"
                />
              </div>

              <div class="uk-margin">
                <input
                  class="uk-input"
                  type="password"
                  name="password"
                  placeholder="Password"
                  v-model="password"
                />
              </div>
            </div>
          </div>
          <div class="uk-card-footer uk-flex uk-flex-right">
            <button
              class="uk-button uk-button-primary"
              @click="handleLoginClicked"
            >
              Login
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "LoginView",
  data() {
    return {
      username: "",
      password: "",
    };
  },
  methods: {
    handleLoginClicked() {},
  },
};
</script>

<style scoped></style>
