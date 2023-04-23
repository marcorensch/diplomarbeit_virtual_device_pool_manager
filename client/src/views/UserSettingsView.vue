<template>
  <div>
    <h1><font-awesome-icon :icon="['fas', 'gears']" /> Settings</h1>
    <h2>
      {{ dayTimeGreeting() }} {{ auth.user.firstname || auth.user.username }}!
    </h2>
    <div class="" uk-grid uk-height-match="target: .uk-card-body">
      <div class="uk-width-1-1 uk-width-1-3@m">
        <PersonalComponent />
      </div>
      <div class="uk-width-1-1 uk-width-1-3@m">
        <UsernameComponent />
      </div>
      <div class="uk-width-1-1 uk-width-1-3@m">
        <PasswordComponent />
      </div>
      <div class="uk-width-1-1 uk-width-2-3@m">
        <div>
          <div class="uk-card uk-card-default uk-card-body">Foo</div>
        </div>
      </div>
      <div class="uk-width-1-1 uk-width-1-3@m">
        <div>
          <div class="uk-card uk-card-default">
            <div class="uk-card-header">
              <h3 class="uk-card-title">
                <font-awesome-icon :icon="['fas', 'trash']" /> Delete account
              </h3>
            </div>
            <div class="uk-card-body">
              <p class="uk-text-muted uk-text-center">
                A deleted account cannot be restored.
              </p>
            </div>
            <div class="uk-card-footer">
              <button
                class="uk-button uk-button-danger uk-width-1-1"
                type="button"
                @click="deleteAccount"
              >
                Delete account
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useAuthStore } from "@/stores/auth";
import PasswordComponent from "@/components/account/PasswordComponent.vue";
import PersonalComponent from "@/components/account/PersonalComponent.vue";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import UsernameComponent from "@/components/account/UsernameComponent.vue";

export default {
  name: "UserSettingsView",
  components: {
    UsernameComponent,
    FontAwesomeIcon,
    PersonalComponent,
    PasswordComponent,
  },
  data() {
    return {
      auth: useAuthStore(),
    };
  },
  methods: {
    dayTimeGreeting() {
      const hour = new Date().getHours();
      if (hour < 12) {
        return "Good morning, ";
      } else if (hour < 18) {
        return "Good afternoon, ";
      } else {
        return "Good evening, ";
      }
    },
  },
};
</script>

<style scoped></style>
