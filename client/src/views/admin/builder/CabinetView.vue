<template>
  <div v-if="cabinet && categories" class="nxd-no-select">
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
        @click.exact="handleAddRowClicked"
        v-on:click.shift="handleAddRowClicked(2)"
      >
        <h3 class="uk-margin-remove uk-text-muted uk-text-light uk-text-center">
          It looks a bit empty here...<br />Click here to add your first row to
          this cabinet.
        </h3>
        <div class="uk-text-muted uk-text-light uk-text-center">
          Hint: you can use
          <span
            style="
              border: 1px solid grey;
              display: inline-block;
              padding: 3px;
              border-radius: 3px;
              line-height: 13px;
              font-size: 13px;
              position: relative;
              top: -2px;
            "
            >shift</span
          >
          + click to add two rows in one go.
        </div>
      </div>
      <template v-else>
        <div id="cabinet-rows">
          <div
            v-for="(row, index) in rows"
            :key="index"
            class="uk-margin-bottom"
          >
            <BuilderRow
              :builderRow="row"
              :builderCabinet="cabinet"
              :slotCategoryId="slotCategoryId"
              @editRow="handleEditRowClicked"
            />
          </div>
        </div>
        <div class="uk-margin">
          <div
            class="nxd-no-select"
            uk-scrollspy="cls:uk-animation-fade;delay:200"
          >
            <div
              class="uk-card uk-card-body nx-card-add uk-card-hover uk-flex uk-flex-center"
              @click.exact="handleAddRowClicked"
              v-on:click.shift="handleAddRowClicked(2)"
            >
              <div class="uk-text-large uk-width-auto">
                <font-awesome-icon :icon="['fas', 'plus']" /> Add Row
              </div>
            </div>
          </div>
        </div>
      </template>
    </div>
    <div id="config-modal" class="uk-flex-top" uk-modal="">
      <div class="uk-modal-dialog uk-margin-auto-vertical">
        <template v-if="currentSelectedItem">
          <button
            class="uk-modal-close uk-modal-close-default"
            uk-close
            type="button"
          ></button>
          <div class="uk-modal-header">
            <h2 class="uk-modal-title">
              <font-awesome-icon
                :icon="['fas', 'cubes']"
                class="uk-margin-right"
              />
              <template v-if="currentSelectedItem && currentSelectedItem.id"
                >Edit {{ currentSelectedItem.categoryName }}
                {{ currentSelectedItem.name }}
              </template>
              <template v-else>Edit</template>
            </h2>
          </div>
          <div class="uk-modal-body">
            <div class="uk-form" v-if="currentSelectedItem">
              <div class="uk-margin">
                <label for="name" class="uk-form-label">Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  class="uk-input"
                  v-model="currentSelectedItem.name"
                  placeholder="Cabinet Name"
                />
              </div>
              <div class="uk-margin">
                <label for="description" class="uk-form-label"
                  >Description</label
                >
                <textarea
                  id="description"
                  name="description"
                  type="textarea"
                  class="uk-textarea"
                  v-model="currentSelectedItem.description"
                  placeholder="Location Description"
                ></textarea>
              </div>
              <div class="uk-margin">
                <label for="hidden" class="uk-form-label">Description</label>
                <textarea
                  type="textarea"
                  id="hidden"
                  name="hidden"
                  class="uk-textarea"
                  v-model="currentSelectedItem.hidden"
                  placeholder="Hidden Information"
                ></textarea>
              </div>
            </div>
          </div>
          <div class="uk-modal-footer">
            <div class="uk-grid-small" uk-grid>
              <div v-if="currentSelectedItem.id">
                <button
                  class="uk-button uk-button-danger"
                  @click="handleModalDeleteClicked"
                >
                  Delete
                </button>
              </div>
              <div class="uk-width-expand">
                <div class="uk-grid-small uk-flex uk-flex-right" uk-grid>
                  <div>
                    <button
                      class="uk-button uk-button-secondary uk-modal-close"
                    >
                      Cancel
                    </button>
                  </div>
                  <div>
                    <button
                      class="uk-button uk-button-primary"
                      :class="{ 'uk-disabled': !currentSelectedItem.name }"
                      @click="handleModalSaveClicked"
                    >
                      Save
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import { useBuilderItemStore } from "@/stores/builderItemStore";
import { useBuilderCategoriesStore } from "@/stores/builderCategoriesStore";
import BuilderRow from "@/components/builder/BuilderRow.vue";
import UIkit from "uikit";

export default {
  name: "CabinetView",
  components: {
    BuilderRow,
  },
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
      currentSelectedItem: null,
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
    handleEditRowClicked(builderRowElement) {
      this.currentSelectedItem = builderRowElement;
      this.currentSelectedItem.categoryName = "Row";
      UIkit.modal("#config-modal").show();
    },
    handleEditSlotClicked(builderSlotElement, callback) {
      this.currentSelectedItem = builderSlotElement;
      this.currentSelectedItem.categoryName = "Slot";
      this.currentSelectedItem.callback = callback;
      UIkit.modal("#config-modal").show();
    },
    async handleAddRowClicked(times) {
      if (isNaN(times)) {
        times = 1;
      }
      for (let i = 0; i < times; ) {
        await this.addRow(i);
        i++;
      }

      this.rows = await this.builderItemStore.getChildItems(this.rowCategoryId);
    },
    async addRow(loopIndex) {
      const name = this.rows.length + 1 + loopIndex;
      await this.builderItemStore.createItem(
        this.rowCategoryId,
        this.cabinet.id,
        name
      );
    },
    async handleModalSaveClicked() {
      await this.builderItemStore.updateItem(this.currentSelectedItem);
      UIkit.modal("#config-modal").hide();
      this.currentSelectedItem = null;
    },
    async handleModalDeleteClicked() {
      await this.builderItemStore.deleteItem(this.currentSelectedItem);
      UIkit.modal("#config-modal").hide();
      this.currentSelectedItem = null;
    },
  },
};
</script>

<style lang="less" scoped></style>
