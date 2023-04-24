<template>
  <div>
    <div class="uk-card uk-card-default">
      <div class="uk-card-header">
        <h3 class="uk-card-title">
          <font-awesome-icon :icon="['fas', 'user']" /> Username
        </h3>
      </div>
      <div class="uk-card-body">
        <div class="uk-form">
          <div class="uk-margin">
            <label class="uk-form-label" for="username">Username</label>
            <div class="uk-form-controls">
              <input
                class="uk-input"
                id="username"
                type="text"
                v-model="username"
                :class="{ 'form-invalid': v$.username.$errors.length }"
              />
            </div>
            <div
              class="uk-alert uk-alert-danger uk-text-small"
              v-for="error of v$.username.$errors"
              :key="error.$uid"
            >
              The Username has to be at least {{ USERNAMEMINLENGTH }} characters
            </div>
          </div>
        </div>
      </div>
      <div class="uk-card-footer">
        <div
          class="uk-flex-right@m uk-grid-small uk-child-width-1-1 uk-child-width-auto@m"
          uk-grid
        >
          <div>
            <button
              class="uk-button uk-button-primary"
              type="button"
              @click="updateUsername"
              :class="{
                'uk-disabled': usernameHasChanged,
              }"
            >
              Update
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useAuthStore } from "@/stores/auth";
import { useVuelidate } from "@vuelidate/core";
import { minLength } from "@vuelidate/validators";
import { useToast } from "vue-toastification";
const toast = useToast();

export default {
  name: "UsernameWidget",
  inject: ["USERNAMEMINLENGTH"],
  setup() {
    return {
      v$: useVuelidate(),
    };
  },
  data() {
    return {
      auth: useAuthStore(),
      username: "",
    };
  },
  validations() {
    return {
      username: {
        minLength: minLength(this.USERNAMEMINLENGTH),
      },
    };
  },
  mounted() {
    this.username = this.auth.user.username;
  },
  computed: {
    usernameHasChanged() {
      return this.username === this.auth.user.username;
    },
  },
  methods: {
    async updateUsername() {
      const formIsValid = await this.v$.$validate();
      if (!formIsValid) return;
      const success = await this.auth.updateProfile({
        username: this.username,
      });
      if (!success) {
        toast.error("Error while updating profile, Username might be taken");
        this.username = this.auth.user.username;
      }
      this.v$.$reset();
    },
  },
};
</script>

<style scoped></style>
