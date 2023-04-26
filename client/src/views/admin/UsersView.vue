<template>
  <div class="uk-section uk-section-small user-list-view">
    <div class="uk-container">
      <h1>Account Manager</h1>
      <div
        class="actions uk-background-muted uk-border-rounded uk-padding-small"
      >
        <div class="uk-hidden@m uk-flex uk-grid-small">
          <div class="uk-button-group">
            <button
              class="uk-button uk-button-primary"
              @click="handleAddAccClicked"
            >
              <font-awesome-icon
                :icon="['fas', 'user-plus']"
                class="uk-preserve-width"
              />
            </button>
            <button
              class="uk-button"
              :class="{ 'uk-disabled': !sortbyField }"
              @click="sortby(null, null)"
            >
              <font-awesome-icon
                :icon="['fas', 'sort']"
                class="uk-preserve-width"
              />
            </button>
          </div>
          <div>
            <input
              type="text"
              id="search_account_mobile"
              class="uk-input"
              placeholder="Filter accounts"
              v-model="search_account"
              @keyup="filterAccountList"
            />
          </div>
        </div>
        <div class="uk-flex uk-visible@m">
          <div>
            <button
              class="uk-button uk-button-primary"
              @click="handleAddAccClicked"
            >
              <font-awesome-icon :icon="['fas', 'user-plus']" />
              Add Account
            </button>
          </div>
          <div class="uk-width-expand">
            <div class="uk-flex uk-flex-right uk-flex-middle uk-grid-small">
              <div>
                <button
                  class="uk-button uk-button-secondary"
                  style="min-width: 0"
                  :class="{ 'uk-disabled': !sortbyField }"
                  @click="sortby(null, null)"
                >
                  <span>Reset Sort</span>
                </button>
              </div>
              <div class="uk-width-medium uk-position-relative">
                <input
                  type="text"
                  id="search_account"
                  class="uk-input"
                  placeholder="Filter accounts"
                  v-model="search_account"
                  @keyup="filterAccountList"
                />
                <div
                  v-if="search_account.length > 0"
                  class="uk-position-center-right clear-search-icon"
                  style="margin-right: 15px"
                  @click="handleClearSearchAccClicked"
                  uk-tooltip="Clear search filter"
                >
                  <font-awesome-icon :icon="['fas', 'xmark']" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <table
        class="uk-table uk-table-striped uk-table-hover uk-table-small uk-table-middle"
      >
        <thead>
          <tr>
            <th class="uk-width-1-6">
              <TableSortByHeader
                :label="'Username'"
                :context="'username'"
                :sortby-field="sortbyField"
                :sortby-direction="sortbyDirection"
                @sortby="sortby"
              />
            </th>

            <th class="uk-width-1-6 uk-visible@m">
              <TableSortByHeader
                :label="'Firstname'"
                :context="'firstname'"
                :sortby-field="sortbyField"
                :sortby-direction="sortbyDirection"
                @sortby="sortby"
              />
            </th>
            <th class="uk-width-1-6 uk-visible@s">
              <TableSortByHeader
                :label="'Lastname'"
                :context="'lastname'"
                :sortby-field="sortbyField"
                :sortby-direction="sortbyDirection"
                @sortby="sortby"
              />
            </th>
            <th class="uk-width-expand">
              <TableSortByHeader
                :label="'Role'"
                :context="'role'"
                :sortby-field="sortbyField"
                :sortby-direction="sortbyDirection"
                @sortby="sortby"
              />
            </th>
            <th class="uk-table-shrink uk-text-nowrap">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="user in users"
            :key="user.id"
            :class="{ 'uk-hidden': !user.isVisible }"
          >
            <td>{{ user.username }}</td>
            <td class="uk-visible@m">{{ user.firstname }}</td>
            <td class="uk-visible@s">{{ user.lastname }}</td>
            <td :data-user-type="user.role">
              <div v-if="user.role === 'ADMIN'">
                <font-awesome-icon
                  :icon="['fas', 'user-shield']"
                  class="uk-text-success"
                />
                <span class="uk-margin-small-left uk-visible@m"
                  >Administrator
                </span>
              </div>
              <div v-else-if="user.role === 'USER'">
                <font-awesome-icon :icon="['fas', 'user']" />
                <span class="uk-margin-small-left uk-visible@m"
                  >Registered User
                </span>
              </div>
              <div v-else-if="user.role === 'GUEST'">
                <font-awesome-icon :icon="['fas', 'user']" />
                <span class="uk-margin-small-left uk-visible@m"
                  >Registered Guest
                </span>
              </div>
              <div v-else>
                <font-awesome-icon :icon="['fas', 'user']" />
                <span class="uk-margin-small-left">{{ user.role }} </span>
              </div>
            </td>
            <td>
              <div class="uk-button-group" v-if="currentUser.id !== user.id">
                <button
                  class="uk-button uk-button-default"
                  @click="handleEditAccClicked(user)"
                >
                  <font-awesome-icon
                    class="uk-preserve-width"
                    :icon="['fas', 'user-edit']"
                  />
                </button>
                <button
                  class="uk-button uk-button-danger"
                  @click="handleDeleteAccountClicked(user)"
                >
                  <font-awesome-icon
                    class="uk-preserve-width"
                    :icon="['fas', 'trash']"
                  />
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
      <AccountDetailsModal
        :account="selectedAccount"
        ref="modal"
        @accountCreated="getUsers"
        @accountUpdated="getUsers"
        @modalClosed="selectedAccount = null"
      />
    </div>
  </div>
</template>

<script>
// @ is an alias to /src

import axios from "axios";
import AccountDetailsModal from "@/components/AccountDetailsModal.vue";
import { useToast } from "vue-toastification";
import { useAuthStore } from "@/stores/auth";
import UIkit from "uikit";
import TableSortByHeader from "@/components/TableSortByHeader.vue";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

const toast = useToast();

function debounce(func, timeout = 400) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func.apply(this, args);
    }, timeout);
  };
}

export default {
  name: "UsersView",
  components: { FontAwesomeIcon, TableSortByHeader, AccountDetailsModal },
  setup() {
    return {
      toast,
    };
  },
  data() {
    return {
      currentUser: useAuthStore().user,
      search_account: "",
      users: [],
      selectedAccount: null,
      sortbyField: null,
      sortbyDirection: null,
    };
  },
  mounted() {
    this.getUsers();
  },
  methods: {
    sortby(field, direction) {
      this.sortbyField = field;
      this.sortbyDirection = direction;
      if (!direction && !field) {
        this.users.sort((a, b) => a.id - b.id);
        return;
      }
      this.users.sort((a, b) => {
        if (a[field] < b[field]) {
          switch (direction) {
            case "down":
              return 1;
            case "up":
              return -1;
          }
        }
        if (a[field] > b[field]) {
          switch (direction) {
            case "down":
              return -1;
            case "up":
              return 1;
          }
        }
        return 0;
      });
    },
    handleClearSearchAccClicked() {
      this.search_account = "";
      this.filterAccountList();
    },
    filterAccountList() {
      debounce(() => {
        const filter = this.search_account.toUpperCase();
        this.users.forEach((user) => {
          if (
            user.username.toUpperCase().includes(filter) ||
            user.firstname.toUpperCase().includes(filter) ||
            user.lastname.toUpperCase().includes(filter)
          ) {
            user.isVisible = true;
          } else {
            user.isVisible = false;
          }
        });
      })();
    },
    handleAddAccClicked() {
      this.$refs.modal.showModal();
    },
    handleEditAccClicked(user) {
      this.selectedAccount = user;
      this.$refs.modal.showModal();
    },
    async getUsers() {
      try {
        const response = await axios.get("/api/admin/accounts");
        this.users = response.data.users.map((user) => {
          user.isVisible = true;
          return user;
        });
      } catch (error) {
        if (error.response.status === 401) {
          this.$router.push("/login");
        }
      }
    },
    async handleDeleteAccountClicked(user) {
      const confirmation = await UIkit.modal
        .confirm(
          `Are you sure you want to delete <b>${
            user.firstname.length
              ? user.firstname + "'s (" + user.username + ")"
              : user.username + "'s"
          }</b> account?`,
          {
            i18n: { ok: "Yes" },
          }
        )
        .then(
          function () {
            return true;
          },
          function () {
            return false;
          }
        );
      if (!confirmation) return;
      try {
        await axios.delete(`/api/admin/accounts/${user.id}`);
        toast.success("Account deleted");
        await this.getUsers();
      } catch (error) {
        if (error.response.status === 401) {
          toast.error("You are not authorized to delete this account");
        }
      }
    },
  },
};
</script>

<style lang="less" scoped>
@import "@/assets/less/admin.less";
</style>
