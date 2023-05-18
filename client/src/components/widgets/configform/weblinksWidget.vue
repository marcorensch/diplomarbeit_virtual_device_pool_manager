<template>
  <div :class="{ 'uk-margin uk-card uk-card-default': inCard }">
    <div class="uk-card-header" v-if="inCard">
      <h3 class="uk-card-title">Weblinks</h3>
    </div>
    <div :class="{ 'uk-card-body': inCard }">
      <table class="uk-table uk-table-divider uk-table-small">
        <thead>
          <th>Label</th>
          <th>URL</th>
          <th></th>
        </thead>
        <tbody>
          <tr v-for="link of links" :key="link.id">
            <td></td>
            <td></td>
            <td></td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="uk-card-footer uk-flex uk-flex-right">
      <button
        class="uk-button uk-button-secondary uk-button-small uk-width-1-1 uk-width-auto@m"
        @click="handleAddLinkClicked"
      >
        Add Weblink
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: "weblinksWidget",
  props: {
    inCard: {
      type: Boolean,
      default: true,
    },
    links: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      weblinks: [],
    };
  },
  mounted() {
    this.weblinks = this.links;
  },
  methods: {
    handleAddLinkClicked() {
      console.log("Add link clicked");
    },
  },
};
</script>

<style scoped></style>
