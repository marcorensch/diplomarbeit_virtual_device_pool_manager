<template>
  <div>
    <div class="uk-grid-small" uk-grid>
      <div>
        <router-link :to="{ name: 'locations' }">
          <font-awesome-icon :icon="['fas', 'arrow-left']" class="uk-h1" />
        </router-link>
      </div>
      <div>
        <h1 :class="{ 'skeleton skeleton-large uk-h1': !location }">
          {{ location ? location.name + " Cabinets" : "" }}
        </h1>
      </div>
    </div>
    <div class="cabinets-container">
      <template v-for="cabinet of cabinets" :key="cabinet.id">
        <div class="uk-card uk-card-default">
          <div class="uk-card-header"></div>
          <div class="uk-card-body"></div>
        </div>
      </template>
    </div>
    <div>
      <div
        class="uk-margin nxd-no-select"
        uk-scrollspy="cls:uk-animation-fade;delay:200"
      >
        <div
          class="uk-card uk-card-body nx-card-add uk-card-hover uk-flex uk-flex-center"
          @click="handleAddCabinetClicked"
        >
          <div class="uk-text-large uk-width-auto">
            <font-awesome-icon :icon="['fas', 'plus']" /> Add Cabinet
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {useBuilderItemStore} from "@/stores/builderItemStore";
import {useBuilderCategoriesStore} from "@/stores/builderCategoriesStore";

export default {
  name: "CabinetsView",
  setup() {
    return {
      builderItemStore: useBuilderItemStore(),
      categoriesStore: useBuilderCategoriesStore(),
    };
  },
  data() {
    return {
      locationId: null,
      location: null,
      categories: [],
    };
  },
  async mounted() {
    console.log("CabinetsView mounted");
    console.log(this.$route.params.id);
    this.categories = await this.categoriesStore.loadCategories();

    this.locationId = this.$route.params.id;
    this.location = await this.builderItemStore.loadItem(this.locationId);
    this.cabinets = await this.builderItemStore.getChildItems(
      this.categoriesStore.findCategoryIdByName("Cabinet")
    );
  },
};
</script>

<style scoped></style>
