<template>
  <div>
    <div class="uk-card uk-card-default">
      <div class="uk-card-header">
        <h3 class="uk-card-title">
          <font-awesome-icon :icon="['fas', 'user']" /> Personal Information
        </h3>
      </div>
      <div class="uk-card-body">
        <div class="uk-form">
          <div class="uk-margin">
            <label class="uk-form-label" for="firstname">First Name</label>
            <div class="uk-form-controls">
              <input
                class="uk-input"
                id="firstname"
                type="text"
                v-model="firstname"
              />
            </div>
          </div>
          <div class="uk-margin">
            <label class="uk-form-label" for="lastname">Last Name</label>
            <div class="uk-form-controls">
              <input
                class="uk-input"
                id="lastname"
                type="text"
                v-model="lastname"
              />
            </div>
          </div>
          <div class="uk-margin">
            <label class="uk-form-label" for="email">Email</label>
            <div class="uk-form-controls">
              <input
                class="uk-input"
                id="email"
                type="email"
                v-model="email"
                placeholder="name@provider.tld"
                :class="{ 'form-invalid': v$.email.$errors.length }"
              />
            </div>
            <div
              class="uk-alert uk-alert-danger uk-text-small"
              v-for="error of v$.email.$errors"
              :key="error.$uid"
            >
              This E-Mail is not valid.
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
              :class="{
                'uk-disabled':
                  auth.user.firstname === firstname &&
                  auth.user.lastname === lastname &&
                  auth.user.email === email,
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
import { email } from "@vuelidate/validators";
export default {
  name: "PersonalComponent",
  setup() {
    return {
      v$: useVuelidate(),
    };
  },
  data() {
    return {
      auth: useAuthStore(),
      firstname: "",
      lastname: "",
      email: "",
    };
  },
  validations() {
    return {
      email: {
        email: this.email ? email : {},
      },
    };
  },
  mounted() {
    this.v$.$reset();
    this.firstname = this.auth.user.firstname;
    this.lastname = this.auth.user.lastname;
    this.email = this.auth.user.email;
  },
  methods: {
    async handleSaveClicked() {
      const formIsValid = await this.v$.$validate();
      if (!formIsValid) return;
      await this.auth.updateProfile({
        firstname: this.firstname,
        lastname: this.lastname,
        email: this.email,
      });
    },
  },
};
</script>

<style scoped></style>
