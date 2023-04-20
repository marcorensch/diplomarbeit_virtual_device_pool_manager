<template>
  <div class="userlist">
    <h1>Userlist</h1>
    <div class="actions uk-background-muted uk-border-rounded uk-padding-small">
      <div class="uk-flex uk-flex-right uk-flex-middle uk-grid-small">
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
        <div>
          <button
            class="uk-button uk-button-primary"
            @click="handleAddAccClicked"
          >
            <font-awesome-icon :icon="['fas', 'user-plus']" />
            Add Account
          </button>
        </div>
      </div>
    </div>

    <table
      class="uk-table uk-table-striped uk-table-hover uk-table-small uk-table-middle"
    >
      <thead>
        <tr>
          <th class="uk-width-1-6">Username</th>
          <th class="uk-width-1-6">Firstname</th>
          <th class="uk-width-1-6">Lastname</th>
          <th class="uk-width-expand">Role</th>
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
          <td>{{ user.firstname }}</td>
          <td>{{ user.lastname }}</td>
          <td :data-user-type="user.role">
            <div v-if="user.role === 'ADMIN'">
              <font-awesome-icon :icon="['fas', 'user-shield']" />
              <span class="uk-margin-small-left">Administrator </span>
            </div>
            <div v-else-if="user.role === 'USER'">
              <font-awesome-icon :icon="['fas', 'user']" />
              <span class="uk-margin-small-left">User </span>
            </div>
            <div v-else>
              <font-awesome-icon :icon="['fas', 'user']" />
              <span class="uk-margin-small-left">{{ user.role }} </span>
            </div>
          </td>
          <td>
            <div class="uk-button-group">
              <button class="uk-button uk-button-default">
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
    <AddAccountModal ref="modal" @accountCreated="getUsers" />
  </div>
</template>

<script>
// @ is an alias to /src

import axios from "axios";
import AddAccountModal from "@/components/AddAccountModal.vue";
import { useToast } from "vue-toastification";
import UIkit from "uikit";

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
  components: { AddAccountModal },
  setup() {
    return {
      toast,
    };
  },
  data() {
    return {
      search_account: "",
      users: [],
    };
  },
  mounted() {
    this.getUsers();
  },
  methods: {
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
    async handleAddAccClicked() {
      this.$refs.modal.showModal();
    },
    async getUsers() {
      try {
        const response = await axios.get("/api/users");
        this.users = response.data.users.map((user) => {
          return {
            id: user.id,
            username: user.username,
            firstname: user.firstname,
            lastname: user.lastname,
            role: user.role,
            isVisible: true,
          };
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
        await axios.delete(`/api/users/${user.id}`);
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
