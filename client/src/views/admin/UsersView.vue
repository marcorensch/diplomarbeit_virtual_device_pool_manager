<template>
  <div class="userlist">
    <h1>Userlist</h1>
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
          <td>{{ user.role }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
// @ is an alias to /src

import axios from "axios";

export default {
  name: "UsersView",
  components: {},
  data() {
    return {
      users: [],
    };
  },
  mounted() {
    this.getUsers();
  },
  methods: {
    async getUsers() {
      try {
        const response = await axios.get("/api/users");
        this.users = response.data.users;
      } catch (error) {
        console.log(error);
      }
    },
  },
};
</script>
