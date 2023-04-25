<template>
  <div class="uk-section uk-section-small">
    <div class="uk-container">
      <h1><font-awesome-icon :icon="['fas', 'gears']" /> Settings</h1>
      <h2>
        {{ dayTimeGreeting() }} {{ auth.user.firstname || auth.user.username }}!
      </h2>
      <div
        class="uk-child-width-1-1 uk-child-width-1-3@m"
        uk-grid
        uk-height-match="target: .uk-card-body"
      >
        <div>
          <PersonalWidget />
        </div>
        <div>
          <UsernameWidget />
        </div>
        <div>
          <PasswordWidget />
        </div>
        <div>
          <DeleteAccountWidget />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useAuthStore } from "@/stores/auth";
import PasswordWidget from "@/components/account/PasswordWidget.vue";
import PersonalWidget from "@/components/account/PersonalWidget.vue";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import UsernameWidget from "@/components/account/UsernameWidget.vue";
import DeleteAccountWidget from "@/components/account/DeleteAccountWidget.vue";

export default {
  name: "UserSettingsView",
  components: {
    DeleteAccountWidget,
    UsernameWidget,
    FontAwesomeIcon,
    PersonalWidget,
    PasswordWidget,
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
