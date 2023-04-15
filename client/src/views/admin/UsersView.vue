<template>
  <div class="userlist">
    <h1>Userlist</h1>
    <button class="uk-button uk-button-primary" @click="handleAddUserClicked">
      <font-awesome-icon :icon="['fas', 'user-plus']" /> Add User
    </button>
    <table class="uk-table uk-table-striped uk-table-hover">
      <thead>
        <tr>
          <th>Username</th>
          <th>Role</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="user in users" :key="user.id">
          <td>{{ user.username }}</td>
          <td :data-user-type="user.role">
            <template v-if="user.role === 'admin'">
              <font-awesome-icon :icon="['fas', 'user-shield']" /> Administrator
            </template>
            <template v-else>
              <font-awesome-icon :icon="['fas', 'user']" /> User
            </template>
          </td>
        </tr>
      </tbody>
    </table>
    <div id="addUserModal" class="uk-modal-container" uk-modal>
      <div class="uk-modal-dialog">
        <div class="uk-modal-header">
          <h2 class="uk-modal-title">Add User</h2>
        </div>
        <div class="uk-modal-body">
          <div class="uk-form">
            <div class="uk-margin">
              <input
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
                type="password"
                name="password"
                placeholder="Password"
                v-model="form.password"
              />
            </div>
            <div class="uk-margin">
              <input
                class="uk-input"
                type="password"
                name="password-confirm"
                placeholder="Confirm Password"
                v-model="form.password"
              />
            </div>
            <div class="uk-margin">
              <select class="uk-select" v-model="form.role">
                <option value="0" disabled>Select Role</option>
                <option
                  v-for="role in roleOptions"
                  :value="role.id"
                  :key="role.id"
                >
                  {{ role.label }}
                </option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src

import axios from "axios";
import UIkit from "uikit";
import Role from "@/models/Roles.mjs";

export default {
  name: "UsersView",
  components: {},
  data() {
    return {
      users: [],
      form: {
        username: "",
        password: "",
        role: "0",
      },
      roleOptions: [],
    };
  },
  mounted() {
    this.getUsers();
  },
  methods: {
    async handleAddUserClicked() {
      await this.getUserRoles();
      UIkit.modal("#addUserModal").show();
    },
    async getUserRoles() {
      try {
        const response = await axios.get("/api/roles");
        response.data.roles.map((role) => {
          this.roleOptions.push(new Role(role.id, role.name));
        });
        console.log(this.roleOptions);
      } catch (error) {
        if (error.response.status === 401) {
          this.$router.push("/login");
        }
      }
    },
    async handleSaveNewUserClicked() {
      try {
        await axios.post("/api/users", this.form);
        await this.getUsers();
      } catch (error) {
        if (error.response.status === 401) {
          this.$router.push("/login");
        }
      }
    },
    async getUsers() {
      try {
        const response = await axios.get("/api/users");
        this.users = response.data.users;
      } catch (error) {
        if (error.response.status === 401) {
          this.$router.push("/login");
        }
      }
    },
  },
};
</script>
