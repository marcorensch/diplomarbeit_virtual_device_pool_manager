<template>
  <div class="uk-padding-small">
    <ul class="uk-list">
      <li v-for="location of locations" :key="location.id">
        <font-awesome-icon :icon="['fas', 'building']" />
        <span class="uk-margin-small-left">{{ location.name }}</span>
      </li>
    </ul>
  </div>
</template>

<script>
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

export default {
  name: "BuilderLocationsSection",
  components: { FontAwesomeIcon },
  data() {
    return {
      locations: [
        { id: 1, name: "Chur" },
        { id: 2, name: "Lausanne" },
        { id: 3, name: "Mels" },
      ],
    };
  },
};
</script>

<style scoped></style>
