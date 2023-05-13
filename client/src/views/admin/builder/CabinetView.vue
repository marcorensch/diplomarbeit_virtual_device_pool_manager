<template>
  <div v-if="cabinet && categories">
    <div class="uk-grid-small" uk-grid>
      <div>
        <router-link
          :to="{ name: 'location', params: { id: cabinet.parent_id } }"
          class="go-back-link"
        >
          <font-awesome-icon :icon="['fas', 'arrow-left']" class="uk-h1" />
        </router-link>
      </div>
      <div>
        <h1>
          {{ cabinet ? 'Cabinet "' + cabinet.name + '"' : "" }}
        </h1>
      </div>
    </div>
    <div id="cabinet" uk-height-viewport="offset-top:true; offset-bottom:60px;">
      <div
        id="nxd-cabinet-placeholder"
        v-if="!rows.length"
        class="uk-position-center"
        @click="handleAddRowClicked"
      >
        <h3 class="uk-margin-remove uk-text-muted uk-text-light uk-text-center">
          It looks a bit empty here...<br />Click here to add your first row to
          this cabinet.
        </h3>
        <div class="uk-text-muted uk-text-light uk-text-center">
          Hint: you can use shift & click to add two rows in one go.
        </div>
      </div>
      <template v-else>
        <div id="cabinet-rows">
          <div
            v-for="(index, row) in rows"
            :key="index"
            class="uk-margin-bottom"
          >
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
          </div>
        </div>
        <div class="uk-margin">
          <div
            class="nxd-no-select"
            uk-scrollspy="cls:uk-animation-fade;delay:200"
          >
            <div
              class="uk-card uk-card-body nx-card-add uk-card-hover uk-flex uk-flex-center"
              @click="handleAddRowClicked"
            >
              <div class="uk-text-large uk-width-auto">
                <font-awesome-icon :icon="['fas', 'plus']" /> Add Row
              </div>
            </div>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import {useBuilderItemStore} from "@/stores/builderItemStore";
import {useBuilderCategoriesStore} from "@/stores/builderCategoriesStore";

export default {
  name: "CabinetView",
  setup() {
    const builderItemStore = useBuilderItemStore();
    const categoriesStore = useBuilderCategoriesStore();
    return { builderItemStore, categoriesStore };
  },
  data() {
    return {
      cabinet: null,
      categories: [],
      rowCategoryId: null,
      slotCategoryId: null,
      rows: [],
    };
  },
  async mounted() {
    this.cabinet = await this.builderItemStore.loadItem(this.$route.params.id);
    this.categories = await this.categoriesStore.loadCategories();
    this.rowCategoryId = this.categoriesStore.findCategoryIdByName("Row");
    this.slotCategoryId = this.categoriesStore.findCategoryIdByName("Slot");
    this.rows = await this.builderItemStore.getChildItems(this.rowCategoryId);
  },
  methods: {
    async handleAddRowClicked() {
      const name = "Row " + (this.rows.length + 1);
      await this.builderItemStore.createItem(
        this.rowCategoryId,
        this.cabinet.id,
        name
      );
      this.rows = await this.builderItemStore.getChildItems(this.rowCategoryId);
    },
  },
};
</script>

<style lang="less" scoped>
@import "@/assets/less/variables.less";
#cabinet {
  position: relative;
  width: 100%;
  background-color: @color-white;
  border: 2px dashed @color-grey-lighter;
  border-radius: @nxd-border-radius;
  padding: 10px;
  margin: 10px;
}
#nxd-cabinet-placeholder {
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  &:hover > * {
    color: @color-primary !important;
    transition: all 0.2s ease-in-out;
  }
}
</style>
