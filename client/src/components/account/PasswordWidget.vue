<template>
  <div>
    <div class="uk-card uk-card-default">
      <div class="uk-card-header">
        <h3 class="uk-card-title">
          <font-awesome-icon :icon="['fas', 'key']" /> Password
        </h3>
      </div>
      <div class="uk-card-body">
        <div class="uk-form">
          <div class="uk-margin">
            <label class="uk-form-label" for="password">Password</label>
            <div class="uk-form-controls">
              <input
                class="uk-input"
                id="password"
                type="password"
                v-model="password"
                :class="{ 'form-invalid': v$.password.$errors.length }"
              />
            </div>
            <div
              class="uk-alert uk-alert-danger uk-text-small"
              v-for="error of v$.password.$errors"
              :key="error.$uid"
            >
              Password must be at least {{ PWDMINLENGTH }} characters long.
            </div>
          </div>
          <div class="uk-margin">
            <label class="uk-form-label" for="password-confirm"
              >Confirm Password</label
            >
            <div class="uk-form-controls">
              <input
                class="uk-input"
                id="password-confirm"
                type="password"
                v-model="passwordConfirm"
                :class="{ 'form-invalid': v$.passwordConfirm.$errors.length }"
              />
              <div
                class="uk-alert uk-alert-danger uk-text-small"
                v-for="error of v$.passwordConfirm.$errors"
                :key="error.$uid"
              >
                Passwords do not match.
              </div>
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
              class="uk-button uk-button-primary uk-width-1-1"
              @click="handleSaveClicked"
              type="button"
              :class="{ 'uk-disabled': !password.length }"
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
import { sameAs, minLength } from "@vuelidate/validators";
import { useToast } from "vue-toastification";
const toast = useToast();
export default {
  name: "PasswordWidget",
  inject: ["PWDMINLENGTH"],
  setup() {
    return {
      v$: useVuelidate(),
    };
  },
  data() {
    return {
      auth: useAuthStore(),
      password: "",
      passwordConfirm: "",
    };
  },
  validations() {
    return {
      password: {
        minLength: this.password ? minLength(this.PWDMINLENGTH) : {},
      },
      passwordConfirm: {
        sameAs: sameAs(this.password),
      },
    };
  },
  methods: {
    async handleSaveClicked() {
      const formIsValid = await this.v$.$validate();
      if (!formIsValid) return;
      const success = await this.auth.updateProfile({
        password: this.password,
      });
      if (!success) {
        toast.error(
          "Error while updating profile, Please try again later. Your Password was not changed."
        );
      }
      this.password = "";
      this.passwordConfirm = "";
      this.v$.$reset();
    },
  },
};
</script>

<style scoped></style>
