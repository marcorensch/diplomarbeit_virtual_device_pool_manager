<template>
  <div>
    <h2>Cabinets</h2>
    <router-link :to="{ path: '/admin/pool-builder/cabinet' }"
      >Cabinet</router-link
    >
  </div>
</template>

<script>
import {useBuilderItemStore} from "@/stores/builderItemStore";

const builderItemStore = useBuilderItemStore();
export default {
  name: "CabinetsView",
  data() {
    return {
      locationId: null,
    };
  },
  async mounted() {
    console.log("CabinetsView mounted");
    console.log(this.$route.params.id);
    this.locationId = this.$route.params.id;
    await builderItemStore.loadItem(this.locationId);
    console.log(builderItemStore.getItem);
  },
};
</script>

<style scoped></style>
