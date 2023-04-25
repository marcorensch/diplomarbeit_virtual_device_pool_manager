<template>
  <div
    class="uk-section uk-section-small uk-flex uk-flex-middle"
    uk-height-viewport="offset-top:true"
  >
    <div class="uk-container">
      <LoginContainer />
    </div>
  </div>
</template>
<script>
import LoginContainer from "@/components/LoginContainer.vue";

export default {
  name: "LoginView",
  components: { LoginContainer },
};
</script>

<style></style>
