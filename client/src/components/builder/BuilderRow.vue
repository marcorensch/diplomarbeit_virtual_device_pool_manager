<template>
  <div class="uk-width-1-1">
    <div class="uk-card uk-card-default">
      <div class="uk-card-header">
        <span class="uk-text-large nxd-text-navy uk-text-light">{{
          row.name ? row.name : "Row"
        }}</span>
      </div>
      <div class="uk-card-body">
        <div class="slot-container"></div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "BuilderRow",
  props: {
    row: {
      type: Object,
      required: true,
    },
    cabinet: {
      type: Object,
      required: true,
    },
  },
};
</script>

<style scoped></style>
