<template>
  <div class="uk-hidden@m">
    <div class="uk-height-large uk-flex uk-flex-middle uk-flex-center">
      <div class="uk-width-large uk-text-center uk-text-muted">
        <div class="icon-container uk-position-relative">
          <font-awesome-icon
            icon="fas fa-mobile-screen-button"
            size="10x"
            class="no-mobile-support-icon"
          />
          <div class="uk-position-cover uk-animation-fade">
            <font-awesome-icon
              icon="fas fa-slash"
              size="10x"
              class="no-mobile-slash-icon fa-inverse"
              style="scale: 1.5"
            />
          </div>
          <div class="uk-position-cover uk-animation-fade">
            <font-awesome-icon
              icon="fas fa-slash"
              size="10x"
              class="no-mobile-slash-icon"
            />
          </div>
        </div>

        <h3 class="uk-text-muted" v-html="message"></h3>
      </div>
    </div>
  </div>
</template>

<script>
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

export default {
  name: "NotAvailableMobile",
  components: { FontAwesomeIcon },
  props: {
    message: {
      type: String,
      default: "This Widget is not available<br />on Small Screen Devices",
    },
  },
};
</script>

<style scoped></style>
