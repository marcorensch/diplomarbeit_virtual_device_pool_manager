<template>
  <div>
    <h1>Locations</h1>
    <div
      uk-scrollspy="target: > div .animate ; cls: uk-animation-fade; delay: 60"
    >
      <div id="locations" uk-sortable="target: > div; animation: 150;">
        <template v-if="locations">
          <template v-for="location of locations" :key="location.id">
            <div
              class="location-element uk-margin animate"
              :data-id="location.id"
            >
              <div class="uk-card uk-card-default">
                <div class="uk-card-header uk-position-relative uk-drag">
                  <h3 v-if="location.name">{{ location.name }}</h3>
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
                        <p>{{ location.description }}</p>
                      </div>
                      <div>
                        <p>{{ location.hidden }}</p>
                      </div>
                    </div>
                  </div>

                  <div
                    class="uk-position-cover select-location-div"
                    @click="handleSwitchToLocation(location.id)"
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
                    @click="handleEditLocationClicked(location)"
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
        </template>
      </div>

      <div
        class="uk-margin nxd-no-select"
        uk-scrollspy="cls:uk-animation-fade;delay:200"
      >
        <div
          class="uk-card uk-card-body nx-card-add uk-card-hover uk-flex uk-flex-center"
          @click="handleAddLocationClicked"
        >
          <div class="uk-text-large uk-width-auto">
            <font-awesome-icon :icon="['fas', 'plus']" /> Add Location
          </div>
        </div>
      </div>
    </div>
    <div id="location-config-modal" class="uk-flex-top" uk-modal="">
      <div class="uk-modal-dialog uk-margin-auto-vertical">
        <template v-if="currentLocation">
          <button
            class="uk-modal-close uk-modal-close-default"
            uk-close
            type="button"
          ></button>
          <div class="uk-modal-header">
            <h2 class="uk-modal-title">
              <font-awesome-icon
                :icon="['fas', 'building']"
                class="uk-margin-right"
              />
              <template v-if="currentLocation && currentLocation.id"
                >Edit {{ currentLocation.name }}</template
              >
              <template v-else>Add Location</template>
            </h2>
          </div>
          <div class="uk-modal-body">
            <div class="uk-form" v-if="currentLocation">
              <div class="uk-margin">
                <label for="name" class="uk-form-label">Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  class="uk-input"
                  v-model="currentLocation.name"
                  placeholder="Location Name"
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
                  v-model="currentLocation.description"
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
                  v-model="currentLocation.hidden"
                  placeholder="Hidden Information"
                ></textarea>
              </div>
              <div class="uk-margin">
                <h4>Parameters</h4>
                <div>
                  <label for="cabinets-orientation">Cabinets Orientation</label>
                  <div
                    class="uk-margin uk-grid-small uk-child-width-auto uk-grid"
                  >
                    <label
                      ><input
                        class="uk-radio"
                        type="radio"
                        name="cabinets-orientation"
                        value="horizontal"
                        v-model="currentLocation.params.cabinetsOrientation"
                      />
                      Horizontal</label
                    >
                    <label
                      ><input
                        class="uk-radio"
                        type="radio"
                        name="cabinets-orientation"
                        value="vertical"
                        v-model="currentLocation.params.cabinetsOrientation"
                      />
                      Vertical</label
                    >
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="uk-modal-footer">
            <div class="uk-grid-small" uk-grid>
              <div v-if="currentLocation.id">
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
                      :class="{ 'uk-disabled': !currentLocation.name }"
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
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";
import UIkit from "uikit";
import BuilderItem from "@/models/BuilderItem.mjs";
import {useBuilderItemStore} from "@/stores/builderItemStore";
import {useBuilderCategoriesStore} from "@/stores/builderCategoriesStore";

export default {
  name: "LocationsView",
  components: { FontAwesomeIcon },
  setup() {
    const categoriesStore = useBuilderCategoriesStore();
    const builderItemStore = useBuilderItemStore();

    return {
      categoriesStore,
      builderItemStore,
    };
  },
  data() {
    return {
      categories: [],
      locations: [],
      locationCategoryId: null,
      currentLocation: null,
      locationDataFallback: null,
      modalSaveCLicked: false,
    };
  },
  async mounted() {
    this.handleSortable("#locations");
    this.handleModalFeatures();
    this.categories = await this.categoriesStore.loadCategories();
    this.locationCategoryId =
      this.categoriesStore.findCategoryIdByName("Location");

    this.locations = await this.builderItemStore.loadItems(
      this.locationCategoryId
    );
  },
  methods: {
    handleAddLocationClicked() {
      this.currentLocation = new BuilderItem();
      this.currentLocation.categoryId = this.locationCategoryId;
      this.currentLocation.sorting = this.locations.length + 1;
      this.modalSaveOrDeleteClicked = false;
      UIkit.modal("#location-config-modal").show();
    },
    handleModalFeatures() {
      UIkit.util.on("#location-config-modal", "shown", () => {
        this.$nextTick(() => {
          document.getElementById("name").focus();
        });
      });
      UIkit.util.on("#location-config-modal", "hide", () => {
        if (!this.modalSaveOrDeleteClicked) {
          if (this.currentLocation?.id) {
            const location = this.locations.find((loc) => {
              if (loc.id === this.currentLocation.id) return loc;
            });
            Object.assign(location, this.locationDataFallback);
          }
        }
      });
      UIkit.util.on("#location-config-modal", "hidden", () => {
        this.$nextTick(() => {
          this.currentLocation = null;
          this.locationDataFallback = null;
        });
      });
    },
    handleEditLocationClicked(location) {
      this.modalSaveOrDeleteClicked = false;
      this.locationDataFallback = { ...location };
      this.currentLocation = location;
      this.modalSaveCLicked = false;
      UIkit.modal("#location-config-modal").show();
    },
    async handleModalSaveClicked() {
      this.modalSaveOrDeleteClicked = true;
      this.currentLocation.category_id = this.locationCategoryId;
      const params = { ...this.currentLocation.params };
      this.currentLocation.params = JSON.stringify(this.currentLocation.params);
      if (this.currentLocation.id) {
        await this.builderItemStore.updateItem(this.currentLocation);
      } else {
        const status = await this.builderItemStore.saveItem(
          this.currentLocation
        );
        if (status) {
          this.locations = await this.builderItemStore.loadItems(
            this.locationCategoryId
          );
        }
      }
      this.currentLocation.params = params;
      UIkit.modal("#location-config-modal").hide();
    },
    handleModalDeleteClicked() {
      UIkit.modal
        .confirm(
          "<h3>Sure?</h3>Are you sure you want to delete this location and all its structure? This cannot be undone. Linked devices will be kept but unlinked from this location.",
          { stack: true }
        )
        .then(() => {
          const status = this.builderItemStore.deleteItem(
            this.currentLocation.id
          );
          if (status) {
            this.locations = this.locations.filter(
              (location) => location.id !== this.currentLocation.id
            );
          }
          this.modalSaveOrDeleteClicked = true;
          UIkit.modal("#location-config-modal").hide();
        });
    },

    handleSortable(container) {
      console.log("handle sortable");
      UIkit.util.on(container, "moved", (e) => {
        const children = e.target.children;
        for (let i = 0; i < children.length; i++) {
          this.locations.find((location) => {
            if (location.id === parseInt(children[i].dataset.id)) {
              location.sorting = i + 1;
            }
          });
        }
        this.builderItemStore.updateSorting(this.locations);
      });
    },
    handleSwitchToLocation(id) {
      this.$router.push({ path: `/admin/pool-builder/location/${id}` });
    },
  },
};
</script>

<style scoped></style>
