<template>
  <div>
    <div id="offcanvas" uk-offcanvas="mode: push; overlay: true">
      <div class="uk-offcanvas-bar uk-flex uk-flex-column">
        <button class="uk-offcanvas-close" type="button" uk-close></button>

        <NavigationElements
          @close-offcanvas="handleCloseOffcanvas"
          :inOffcanvas="true"
          :classNames="['uk-nav', 'uk-nav-primary', 'uk-margin-auto-vertical']"
        />
      </div>
    </div>

    <nav class="uk-navbar-container">
      <div class="uk-container">
        <div uk-navbar>
          <div class="uk-navbar-left">
            <button
              class="uk-button uk-button-default uk-button-small uk-hidden@m"
              style="min-width: 0"
              type="button"
              uk-toggle="target: #offcanvas"
            >
              <span uk-icon="icon: menu"></span>
            </button>

            <NavigationElements
              :classNames="[
                'uk-navbar-nav',
                'main-nav',
                'main-menu',
                'uk-visible@m',
              ]"
            />
          </div>

          <div class="uk-navbar-right">
            <ul
              class="uk-navbar-nav main-nav uk-height-1-1 uk-flex uk-flex-middle"
            >
              <li id="user-icon-link" v-if="auth.isLoggedIn" tabindex="20">
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
                  style="height: 0; padding: 0; margin: 0; tab-index: 999"
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
                          <a :href="href" @click="navigate" tabindex="21">
                            <div class="arrow"></div>
                            <span>Settings</span>
                          </a>
                        </li>
                      </router-link>
                      <li id="logout-link">
                        <a href="#" @click.prevent="logout" tabindex="22">
                          <span>Logout</span>
                        </a>
                      </li>
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
  </div>
</template>

<script>
import UIkit from "uikit";
import Icons from "uikit/dist/js/uikit-icons";
UIkit.use(Icons);
import { useAuthStore } from "@/stores/auth";
import NavigationElements from "@/components/NavigationElements.vue";

export default {
  name: "NavigationBar",
  components: { NavigationElements },
  watch: {},
  data() {
    return {
      auth: useAuthStore(),
    };
  },
  mounted() {},
  methods: {
    handleCloseOffcanvas() {
      UIkit.offcanvas("#offcanvas").hide();
    },
    logout() {
      this.auth.logout();
    },
  },
};
</script>

<style scoped></style>
