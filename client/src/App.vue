<template>
  <nav>
    <router-link to="/">Home</router-link> |
    <router-link to="/login">Login</router-link> |
    <router-link to="/admin">Administration</router-link> |
    <router-link to="/admin/users">Users</router-link>
  </nav>
  <router-view />
</template>

<style lang="less">
@import "../node_modules/uikit/src/less/uikit.less";
@import "@/assets/less/main.less";
</style>
