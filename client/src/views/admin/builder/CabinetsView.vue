<template>
  <div v-if="location">
    <div class="uk-grid-small" uk-grid>
      <div>
        <router-link :to="{ name: 'locations' }" class="go-back-link">
          <font-awesome-icon :icon="['fas', 'arrow-left']" class="uk-h1" />
        </router-link>
      </div>
      <div>
        <h1 :class="{ 'skeleton skeleton-large uk-h1': !location }">
          {{ location ? location.name + " Cabinets" : "" }}
        </h1>
      </div>
    </div>
    <div
      id="cabinets"
      uk-scrollspy="target: >div; cls:uk-animation-fade;delay:150"
      uk-sortable="handle: >div;"
    >
      <template v-for="cabinet of cabinets" :key="cabinet.id">
        <div class="cabinet-element uk-margin animate" :data-id="cabinet.id">
          <div class="uk-card uk-card-default">
            <div class="uk-card-header uk-position-relative uk-drag">
              <h3 v-if="cabinet.name">{{ cabinet.name }}</h3>
              <h3 v-else class="uk-text-muted uk-text-italic">
                Location Name...
              </h3>
            </div>
            <div class="uk-card-body">
              <div
                class="uk-width-expand uk-padding uk-padding-remove-left uk-padding-remove-vertical"
              >
                <div class="uk-child-width-1-2 uk-grid-small" uk-grid>
                  <div>
                    <p>{{ cabinet.description }}</p>
                  </div>
                  <div>
                    <p>{{ cabinet.hidden }}</p>
                  </div>
                </div>
              </div>

              <div
                class="uk-position-cover select-location-div"
                @click="handleSwitchToCabinet(cabinet.id)"
              >
                <div class="uk-position-center-right uk-padding">
                  <span class="uk-text-large"
                    ><font-awesome-icon
                      class="uk-preserve-width"
                      :icon="['fas', 'chevron-right']"
                  /></span>
                </div>
              </div>
            </div>
            <div class="uk-position-top-right">
              <div
                class="uk-padding-small edit-div"
                @click="handleEditCabinetClicked(cabinet)"
              >
                <font-awesome-icon
                  class="uk-preserve-width"
                  :icon="['fas', 'cog']"
                />
              </div>
            </div>
          </div>
        </div>
      </template>
    </div>
    <div class="uk-margin">
      <div class="nxd-no-select" uk-scrollspy="cls:uk-animation-fade;delay:200">
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

    <div id="cabinet-config-modal" class="uk-flex-top" uk-modal="">
      <div class="uk-modal-dialog uk-margin-auto-vertical">
        <template v-if="currentCabinet">
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
              <template v-if="currentCabinet && currentCabinet.id"
                >Edit {{ currentCabinet.name }}</template
              >
              <template v-else>Add Cabinet</template>
            </h2>
          </div>
          <div class="uk-modal-body">
            <div class="uk-form" v-if="currentCabinet">
              <div class="uk-margin">
                <label for="name" class="uk-form-label">Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  class="uk-input"
                  v-model="currentCabinet.name"
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
                  v-model="currentCabinet.description"
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
                  v-model="currentCabinet.hidden"
                  placeholder="Hidden Information"
                ></textarea>
              </div>
            </div>
          </div>
          <div class="uk-modal-footer">
            <div class="uk-grid-small" uk-grid>
              <div v-if="currentCabinet.id">
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
                      :class="{ 'uk-disabled': !currentCabinet.name }"
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
import {useBuilderItemStore} from "@/stores/builderItemStore";
import {useBuilderCategoriesStore} from "@/stores/builderCategoriesStore";
import UIkit from "uikit";
import BuilderItem from "@/models/BuilderItem.mjs";

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
      currentCabinet: null,
      cabinets: [],
      cabinetsCategoryId: null,
      cabinetDataFallback: null,
    };
  },
  async mounted() {
    this.categories = await this.categoriesStore.loadCategories();
    this.cabinetsCategoryId =
      this.categoriesStore.findCategoryIdByName("Cabinet");
    this.locationId = this.$route.params.id;
    this.location = await this.builderItemStore.loadItem(this.locationId);
    this.cabinets = await this.builderItemStore.getChildItems(
      this.cabinetsCategoryId
    );
    this.handleSortable("#cabinets");
    this.handleModalFeatures();
  },
  methods: {
    handleAddCabinetClicked() {
      this.currentCabinet = new BuilderItem();
      this.currentCabinet.category_id = this.cabinetsCategoryId;
      this.currentCabinet.sorting = this.cabinets.length + 1;
      this.currentCabinet.parent_id = this.locationId;
      this.modalSaveOrDeleteClicked = false;
      UIkit.modal("#cabinet-config-modal").show();
    },
    handleEditCabinetClicked(cabinet) {
      this.modalSaveOrDeleteClicked = false;
      this.cabinetDataFallback = { ...cabinet };
      this.currentCabinet = cabinet;
      UIkit.modal("#cabinet-config-modal").show();
    },

    async handleModalDeleteClicked() {
      await this.builderItemStore.deleteItem(this.currentCabinet.id);
      this.cabinets = await this.builderItemStore.getChildItems(
        this.cabinetsCategoryId
      );
      UIkit.modal("#cabinet-config-modal").hide();
    },
    handleModalFeatures() {
      UIkit.util.on("#cabinet-config-modal", "shown", () => {
        this.$nextTick(() => {
          document.getElementById("name").focus();
        });
      });
      UIkit.util.on("#cabinet-config-modal", "hide", () => {
        if (!this.modalSaveOrDeleteClicked) {
          if (this.currentCabinet?.id) {
            const cabinet = this.cabinets.find((cab) => {
              if (cab.id === this.currentCabinet.id) return cab;
            });
            Object.assign(cabinet, this.cabinetDataFallback);
          }
        }
      });
      UIkit.util.on("#cabinet-config-modal", "hidden", () => {
        this.$nextTick(() => {
          this.currentCabinet = null;
          this.cabinetDataFallback = null;
        });
      });
    },
    async handleModalSaveClicked() {
      this.modalSaveOrDeleteClicked = true;
      this.currentCabinet.category_id = this.cabinetsCategoryId;
      const params = { ...this.currentCabinet.params };
      this.currentCabinet.params = JSON.stringify(this.currentCabinet.params);
      if (this.currentCabinet.id) {
        await this.builderItemStore.updateItem(this.currentCabinet);
      } else {
        const status = await this.builderItemStore.saveItem(
          this.currentCabinet
        );
        if (status) {
          this.cabinets = await this.builderItemStore.loadItems(
            this.cabinetsCategoryId
          );
        }
      }
      this.currentCabinet.params = params;
      UIkit.modal("#cabinet-config-modal").hide();
    },

    handleSortable(container) {
      UIkit.util.on(container, "moved", (e) => {
        const children = e.target.children;
        for (let i = 0; i < children.length; i++) {
          this.cabinets.find((item) => {
            if (item.id === parseInt(children[i].dataset.id)) {
              item.sorting = i + 1;
            }
          });
        }
        this.builderItemStore.updateSorting(this.cabinets);
      });
    },
  },
};
</script>

<style scoped></style>
