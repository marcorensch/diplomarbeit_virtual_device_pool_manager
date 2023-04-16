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
          <th>Firstname</th>
          <th>Lastname</th>
          <th>Role</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="user in users" :key="user.id">
          <td>{{ user.username }}</td>
          <td>{{ user.firstname }}</td>
          <td>{{ user.lastname }}</td>
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
    <AddAccountModal ref="modal" @accountCreated="getUsers" />
  </div>
</template>

<script>
// @ is an alias to /src

import axios from "axios";
import AddAccountModal from "@/components/AddAccountModal.vue";

export default {
  name: "UsersView",
  components: { AddAccountModal },
  data() {
    return {
      users: [],
    };
  },
  mounted() {
    this.getUsers();
  },
  methods: {
    async handleAddUserClicked() {
      this.$refs.modal.showModal();
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
