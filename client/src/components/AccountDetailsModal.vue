<template>
  <div id="accountModal" class="uk-flex-top" uk-modal>
    <div class="uk-modal-dialog uk-margin-auto-vertical">
      <div class="uk-modal-header">
        <h3 class="uk-modal-title" v-if="!account">
          <font-awesome-icon :icon="['fas', 'user-plus']" />
          Add Account
        </h3>
        <h3 class="uk-modal-title" v-else>
          <font-awesome-icon :icon="['fas', 'user-edit']" />
          Edit <span class="uk-visible@m">{{ account.username }}'</span> Account
        </h3>
      </div>
      <div class="uk-modal-body">
        <form id="account-form" class="uk-form" autocomplete="off">
          <input v-if="account" type="hidden" name="id" v-model="form.id" />
          <div class="uk-grid uk-child-width-expand uk-grid-small">
            <div>
              <div class="uk-margin">
                <input
                  tabindex="1"
                  class="uk-input"
                  type="text"
                  name="firstname"
                  placeholder="Firstname"
                  v-model="form.firstname"
                />
              </div>
            </div>
            <div>
              <div class="uk-margin">
                <input
                  tabindex="2"
                  class="uk-input"
                  type="text"
                  name="lastname"
                  placeholder="Lastname"
                  v-model="form.lastname"
                />
              </div>
            </div>
          </div>
          <div class="uk-margin">
            <input
              tabindex="3"
              class="uk-input"
              type="email"
              name="email"
              placeholder="user@operator.tld"
              v-model="form.email"
            />
          </div>
          <hr />
          <div class="uk-margin">
            <input
              tabindex="4"
              class="uk-input"
              :class="{ 'form-invalid': v$.form.username.$errors }"
              type="text"
              name="username"
              placeholder="Username"
              v-model="form.username"
            />
          </div>

          <div
            class="uk-alert uk-alert-danger uk-text-small"
            v-for="error of v$.form.username.$errors"
            :key="error.$uid"
          >
            Username is required and must be between 7 and 30 characters.
          </div>

          <div class="uk-grid uk-grid-small uk-child-width-expand">
            <div>
              <div class="uk-margin">
                <input
                  tabindex="5"
                  class="uk-input"
                  type="password"
                  name="password"
                  placeholder="Password"
                  v-model="form.password"
                />
              </div>
              <div class="uk-text-meta uk-text-small" v-if="account">
                Leave blank to keep current password.
              </div>
              <div
                class="uk-alert uk-alert-danger uk-text-small"
                v-for="error of v$.form.password.$errors"
                :key="error.$uid"
              >
                Password is required and must be at least 8 characters.
              </div>
            </div>
            <div>
              <div class="uk-margin">
                <input
                  tabindex="6"
                  class="uk-input"
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  v-model="form.confirmPassword"
                />
              </div>
              <div
                class="uk-alert uk-alert-danger uk-text-small"
                v-for="error of v$.form.confirmPassword.$errors"
                :key="error.$uid"
              >
                Given Passwords do not match.
              </div>
            </div>
          </div>

          <div class="uk-margin">
            <select
              tabindex="7"
              class="uk-select"
              v-model="form.role_id"
              :class="{ 'form-invalid': v$.form.role_id.$errors }"
            >
              <option
                v-for="role in roleOptions"
                :value="role.id"
                :key="role.id"
              >
                {{ role.label }}
              </option>
            </select>
            <div
              class="uk-alert uk-alert-danger uk-text-small"
              v-for="error of v$.form.role_id.$errors"
              :key="error.$uid"
            >
              Select Role for this Account
            </div>
          </div>
          <div class="notes-section">
            <a href="#" @click="showNotes = !showNotes">
              <span v-if="!showNotes"
                ><font-awesome-icon :icon="['fas', 'chevron-down']" /> Show
                Notes</span
              >
              <span v-else
                ><font-awesome-icon :icon="['fas', 'chevron-up']" /> Hide
                Notes</span
              >
            </a>
          </div>
          <div class="uk-animation-fade" :class="{ 'uk-hidden': !showNotes }">
            <div class="uk-margin">
              <textarea
                tabindex="8"
                class="uk-textarea"
                rows="3"
                placeholder="Notes"
                v-model="form.notes"
              ></textarea>
            </div>
            <div class="uk-margin" :class="{ 'uk-hidden': !showNotes }">
              <textarea
                tabindex="9"
                class="uk-textarea"
                rows="3"
                placeholder="Hidden Notes"
                v-model="form.hidden"
              ></textarea>
            </div>
          </div>
        </form>
      </div>
      <div class="uk-card-footer">
        <div
          class="uk-flex-right@m uk-grid-small uk-child-width-1-1 uk-child-width-auto@m"
          uk-grid
        >
          <div>
            <button
              class="uk-button uk-button-secondary uk-modal-close uk-width-1-1 uk-width-auto@m"
            >
              Cancel
            </button>
          </div>
          <div>
            <button
              v-if="!account"
              class="uk-button uk-button-primary uk-width-1-1 uk-width-auto@m"
              @click="addAccount"
            >
              Create Account
            </button>
            <button
              v-else
              class="uk-button uk-button-success uk-width-1-1 uk-width-auto@m"
              @click="updateAccount"
            >
              Update Account
            </button>
          </div>
        </div>
      </div>
      <button class="uk-modal-close-default" type="button" uk-close></button>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import Role from "../models/Role";
import UIkit from "uikit";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { useVuelidate } from "@vuelidate/core";
import { required, sameAs, minValue, minLength } from "@vuelidate/validators";
import { useToast } from "vue-toastification";

const toast = useToast();

export default {
  name: "AccountDetailsModal",
  setup() {
    return {
      v$: useVuelidate(),
      toast,
    };
  },
  props: {
    account: {
      type: Object,
      default: () => {
        return null;
      },
    },
  },
  emits: ["account-created", "modal-closed"],
  components: { FontAwesomeIcon },
  data() {
    return {
      showNotes: false,
      form: {
        id: null,
        firstname: "",
        lastname: "",
        email: "",
        username: "",
        password: "",
        confirmPassword: "",
        role_id: "",
        notes: "",
        hidden: "",
      },
      roleOptions: [],
    };
  },
  validations() {
    if (this.account) {
      return {
        form: {
          username: {
            required,
            minLength: minLength(7),
          },
          password: {
            required: this.hasEnteredPassword(),
            minLength: minLength(8),
          },
          confirmPassword: {
            required: this.hasEnteredPassword(),
            sameAsPassword: this.hasEnteredPassword()
              ? sameAs(this.form.password)
              : {},
          },
          role_id: {
            required,
            minValueValue: minValue(1),
          },
        },
      };
    } else {
      return {
        form: {
          username: {
            required,
            minLength: minLength(7),
          },
          password: {
            required,
            minLength: minLength(8),
          },
          confirmPassword: {
            required,
            sameAsPassword: sameAs(this.form.password),
          },
          role_id: {
            required,
            minValueValue: minValue(1),
          },
        },
      };
    }
  },
  async mounted() {
    await this.getUserRoles();
    const modal = document.getElementById("accountModal");
    modal.addEventListener("hide", () => {
      this.v$.$reset();
      this.$emit("modal-closed");
    });
  },
  methods: {
    hasEnteredPassword() {
      return this.form.password.length > 0;
    },
    showModal() {
      document.getElementById("account-form").reset();
      this.v$.$reset();
      this.$nextTick(() => {
        if (this.account) {
          const form = { ...this.form, ...this.account };
          this.form = form;
        }
        UIkit.modal("#accountModal").show();
      });
    },
    async getUserRoles() {
      try {
        const response = await axios.get("/api/roles");
        response.data.roles.map((role) => {
          this.roleOptions.push(new Role(role.id, role.name));
        });
        this.roleOptions.unshift({ id: 0, label: "Select Role" });
        console.log(this.roleOptions);
      } catch (error) {
        console.log(error);
      }
    },
    async updateAccount() {
      const formIsValid = await this.v$.$validate();
      if (!formIsValid) return;
      console.log(this.form);
      try {
        await axios.put(`/api/admin/accounts/${this.form.id}`, this.form);
        this.hideModal();
        this.toast.success("Account Updated Successfully");
        this.$emit("account-updated");
      } catch (error) {
        console.log(error);
        this.toast.error("Error Updating Account - Please Try Again");
      }
    },
    async addAccount() {
      if (!(await this.v$.$validate())) return;
      try {
        const response = await axios.post("/api/admin/accounts", this.form);
        console.log(response);
        this.toast.success("Account Created Successfully");
        this.$emit("account-created");
        this.hideModal();
      } catch (error) {
        console.log(error);
        this.toast.error("Error Creating Account - Please Try Again");
      }
    },

    hideModal() {
      UIkit.modal("#accountModal").hide();
    },
  },
};
</script>
