<template>
  <div>SLOT</div>
</template>

<script>
export default {
  name: "BuilderSlot",
  props: {
    builderSlot: {
      type: Object,
      required: true,
    },
    builderRow: {
      type: Object,
      required: true,
    },
  },
};
</script>

<style scoped></style>
