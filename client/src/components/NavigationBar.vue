<template>
  <nav class="uk-navbar-container">
    <div class="uk-container">
      <div uk-navbar>
        <div class="uk-navbar-left">
          <ul class="uk-navbar-nav main-nav main-menu">
            <router-link
              :to="{ name: 'devices' }"
              custom
              v-slot="{ href, navigate, isActive, isExactActive }"
            >
              <li
                id="devices-link"
                :class="{
                  'uk-active active': isActive || isExactActive,
                }"
              >
                <a :href="href" @click="navigate"><span>Devices</span></a>
              </li>
            </router-link>
            <router-link
              v-if="auth.hasPermission('canAccessAdmin')"
              :to="{ name: 'admin' }"
              custom
              v-slot="{ href, navigate, isActive, isExactActive }"
            >
              <li
                id="admin-home-link"
                :class="{
                  'uk-active active': isActive || isExactActive,
                }"
              >
                <a :href="href" @click="navigate"
                  ><span>Administration</span></a
                >
              </li>
            </router-link>
            <router-link
              v-if="
                auth.hasPermission('canAccessAdmin') &&
                auth.hasPermission('canAccessAccountList')
              "
              :to="{ name: 'users' }"
              custom
              v-slot="{ href, navigate, isActive, isExactActive }"
            >
              <li
                id="admin-users-link"
                :class="{
                  'uk-active active': isActive || isExactActive,
                }"
              >
                <a :href="href" @click="navigate"><span>Users</span></a>
              </li>
            </router-link>
          </ul>
        </div>

        <div class="uk-navbar-right">
          <ul
            class="uk-navbar-nav main-nav uk-height-1-1 uk-flex uk-flex-middle"
          >
            <li id="user-icon-link" v-if="auth.isLoggedIn">
              <div class="user-icon-container">
                <div class="uk-position-center">
                  <font-awesome-icon
                    class="user-icon"
                    :icon="['fas', 'user']"
                  />
                </div>
              </div>
              <div
                class="uk-navbar-dropdown uk-position-relative"
                style="height: 0; padding: 0; margin: 0"
              >
                <div class="uk-position-absolute navbar-submenu">
                  <ul class="uk-nav uk-navbar-dropdown-nav">
                    <router-link
                      :to="{ name: 'user-settings' }"
                      custom
                      v-slot="{ href, navigate, isActive, isExactActive }"
                    >
                      <li
                        id="user-settings-link"
                        :class="{
                          'uk-active active': isActive,
                          'uk-active active': isExactActive,
                        }"
                      >
                        <a :href="href" @click="navigate">
                          <div class="arrow"></div>
                          <span>Settings</span>
                        </a>
                      </li>
                    </router-link>
                    <li id="logout-link">
                      <a href="#" @click.prevent="logout">
                        <span>Logout</span>
                      </a>
                    </li>
                    <li><a href="#">Item</a></li>
                  </ul>
                </div>
              </div>
            </li>
            <router-link
              v-if="!auth.isLoggedIn"
              :to="{ name: 'login' }"
              custom
              v-slot="{ href, navigate, isActive, isExactActive }"
            >
              <li
                id="login-link"
                :class="{
                  'uk-active active': isActive || isExactActive,
                }"
              >
                <a :href="href" @click="navigate">
                  <span>Login</span>
                </a>
              </li>
            </router-link>
          </ul>
        </div>
      </div>
    </div>
  </nav>
</template>

<script>
import UIkit from "uikit";
import Icons from "uikit/dist/js/uikit-icons";
UIkit.use(Icons);
import { useAuthStore } from "@/stores/auth";

export default {
  name: "NavigationBar",
  watch: {},
  data() {
    return {
      auth: useAuthStore(),
    };
  },
  mounted() {},
  methods: {
    logout() {
      this.auth.logout();
    },
  },
};
</script>

<style scoped></style>
