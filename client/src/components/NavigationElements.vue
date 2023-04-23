<template>
  <ul :class="buildClassNamesString()">
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
        <a :href="href" @click="navigate"><span>Administration</span></a>
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
</template>

<script>
import { useAuthStore } from "@/stores/auth";
export default {
  name: "NavigationElements",
  emits: ["closeOffcanvas"],
  props: {
    inOffcanvas: {
      type: Boolean,
      default: false,
    },
    classNames: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      auth: useAuthStore(),
    };
  },
  mounted() {
    this.$nextTick(() => {
      if (this.inOffcanvas) {
        this.$el.querySelectorAll("li").forEach((li) => {
          li.addEventListener("click", () => {
            this.$emit("closeOffcanvas");
          });
        });
      }
    });
  },
  methods: {
    buildClassNamesString() {
      return this.classNames.join(" ");
    },
  },
};
</script>

<style scoped></style>
