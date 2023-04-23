<template>
  <div
    class="uk-flex uk-flex-middle uk-grid-small sort-by-table-header"
    @click="sortBy"
  >
    <div>{{ label }}</div>
    <div>
      <font-awesome-icon
        class="uk-preserve-width"
        v-if="sortbyField !== context"
        :icon="['fas', 'sort']"
      />
      <font-awesome-icon
        class="uk-preserve-width"
        v-if="sortbyField === context && sortbyDirection === 'down'"
        :icon="['fas', 'sort-down']"
      />
      <font-awesome-icon
        class="uk-preserve-width"
        v-if="sortbyField === context && sortbyDirection === 'up'"
        :icon="['fas', 'sort-up']"
      />
    </div>
  </div>
</template>

<script>
export default {
  name: "TableSortByHeader",
  emits: ["sortby"],
  props: {
    context: {
      type: String,
      required: true,
    },
    label: {
      type: String,
      required: true,
    },
    sortbyField: {
      required: true,
    },
    sortbyDirection: {
      required: true,
    },
  },
  methods: {
    sortBy() {
      let field = this.context;
      let direction = this.sortbyDirection === "down" ? "up" : "down";

      this.$emit("sortby", field, direction);
    },
  },
};
</script>

<style scoped></style>
