import { defineStore } from "pinia";
import axios from "axios";
import { useToast } from "vue-toastification";
const toast = useToast();

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: null,
  }),
  getters: {
    isLoggedIn: (state) => {
      return state.user !== null;
    },
    hasPermission: (state) => (permission) => {
      return state.user?.permissions.includes(permission);
    },
    hasPermissions: (state) => (permissions) => {
      return permissions.every((permission) =>
        state.user?.permissions.includes(permission)
      );
    },
  },
  actions: {
    setLocalStorageConfig(key, value) {
      const localStorageConfig = localStorage.getItem("config");
      if (localStorageConfig) {
        const config = JSON.parse(localStorageConfig);
        config[key] = value;
        localStorage.setItem("config", JSON.stringify(config));
      } else {
        const config = {
          [key]: value,
        };
        localStorage.setItem("config", JSON.stringify(config));
      }
    },
    getLocalStorageConfig(key, defaultValue) {
      const localStorageConfig = localStorage.getItem("config");
      if (localStorageConfig) {
        const config = JSON.parse(localStorageConfig);
        if (config[key]) {
          return config[key];
        }
      }
      return defaultValue;
    },
    checkAuth() {
      const user = localStorage.getItem("user");
      if (user) {
        this.user = JSON.parse(user);
      }
    },
    async login(username, password) {
      try {
        const response = await axios.post("/api/auth/login", {
          username,
          password,
        });
        this.user = response.data.user;
        localStorage.setItem("user", JSON.stringify(this.user));
        toast.success("Successfully logged in");
        this.router.push("/");
      } catch (e) {
        console.log(e.response);
        toast.error("Error while logging in, please try again");
      }
    },
    async updatePassword(data) {
      try {
        const response = await axios.put(
          `/api/accounts/${this.user.id}/password`,
          data
        );
        this.user = response.data.user;
        if (this.user) localStorage.setItem("user", JSON.stringify(this.user));
        toast.success("Successfully updated profile");
        return true;
      } catch (e) {
        return false;
      }
    },
    async updateProfile(data) {
      try {
        const response = await axios.put(`/api/accounts/${this.user.id}`, data);
        this.user = response.data.user;
        if (this.user) localStorage.setItem("user", JSON.stringify(this.user));
        toast.success("Successfully updated profile");
        return true;
      } catch (e) {
        toast.error("Error while updating profile");
        return false;
      }
    },
    resetUser() {
      this.user = null;
      localStorage.removeItem("user");
    },
    async logout(withMsg = true) {
      this.resetUser();
      try {
        const response = await axios.get("/api/auth/logout");
        if (response.status === 200) {
          if (withMsg) toast.info("Successfully logged out");
          this.router.push({ name: "login" });
        } else {
          toast.error("Error while logging out");
        }
      } catch (e) {
        console.log(e);
      }
    },
    async logoutEveryhere() {
      this.resetUser();
      try {
        const response = await axios.get("/api/auth/logout-everywhere");
        if (response.status === 200) {
          toast.info("Successfully logged out");
          this.router.push({ name: "login" });
        } else {
          toast.error("Error while logging out");
        }
      } catch (e) {
        console.log(e);
      }
    },
    async deleteAccount() {
      try {
        const response = await axios.delete(`/api/accounts/${this.user.id}`);
        if (response.status === 200) {
          toast.info("Successfully deleted account");
          this.resetUser();
          this.router.push({ name: "devices" });
        } else {
          toast.error("Failed to delete account, Reason:\n" + response.text);
        }
      } catch (e) {
        console.log(e.response);
        toast.error(`Failed to delete account, Reason:\n${e.response.data}`);
      }
    },
  },
});
