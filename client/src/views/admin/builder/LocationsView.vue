<template>
  <div>
    <h2>Locations</h2>
    <div
      uk-scrollspy="target: > div .animate ; cls: uk-animation-fade; delay: 60"
    >
      <div
        v-if="locations.length"
        id="locations"
        uk-sortable="handle: .uk-card-header; animation: 150; group: location"
      >
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
                <hr />
              </div>
              <div class="uk-card-body">
                <div class="uk-grid-small" uk-grid>
                  <div class="uk-width-expand">
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
                    class="uk-width-1-4 uk-flex uk-flex-middle uk-flex-right select-location-div"
                    @click="handleSwitchToLocation(location.id)"
                  >
                    <div class="uk-padding-small">
                      <span class="uk-text-large"
                        ><font-awesome-icon
                          class="uk-preserve-width"
                          :icon="['fas', 'chevron-right']"
                      /></span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
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
import axios from "axios";
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";
import {useToast} from "vue-toastification";
import UIkit from "uikit";
import BuilderItem from "@/models/BuilderItem.mjs";

const toast = useToast();

export default {
  name: "LocationsView",
  components: { FontAwesomeIcon },
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
    this.handleSortable();
    this.handleModalHidden();
    this.categories = await this.getCategories();
    this.locationCategoryId = this.categories.find(
      (category) => category.name === "Location"
    ).id;
    this.locations = this.getLocations();
  },
  methods: {
    handleAddLocationClicked() {
      this.currentLocation = new BuilderItem();
      this.currentLocation.categoryId = this.locationCategoryId;
      this.currentLocation.sorting = this.locations.length + 1;
      this.modalSaveCLicked = false;
      UIkit.modal("#location-config-modal").show();
    },
    handleModalHidden() {
      UIkit.util.on("#location-config-modal", "hide", () => {
        if (!this.modalSaveCLicked) {
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
      this.locationDataFallback = { ...location };
      this.currentLocation = location;
      this.modalSaveCLicked = false;
      UIkit.modal("#location-config-modal").show();
    },
    handleModalSaveClicked() {
      this.modalSaveCLicked = true;
      const params = { ...this.currentLocation.params };
      this.currentLocation.params = JSON.stringify(this.currentLocation.params);
      if (this.currentLocation.id) {
        this.updateLocation();
      } else {
        this.addLocation();
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
          this.deleteLocation();
          UIkit.modal("#location-config-modal").hide();
        });
    },

    async deleteLocation() {
      try {
        await axios.delete(
          `/api/admin/poolbuilder/items/${this.currentLocation.id}`
        );
        this.locations = this.getLocations();
        toast.success("Location deleted");
      } catch (error) {
        toast.error("Something went wrong while deleting location");
        console.log(error);
      }
    },
    async updateLocation() {
      console.log(this.currentLocation);
      try {
        await axios.put(
          `/api/admin/poolbuilder/items/${this.currentLocation.id}`,
          this.currentLocation
        );
        toast.success("Location updated");
      } catch (error) {
        toast.error("Something went wrong while updating location");
        console.log(error);
      }
    },
    async addLocation() {
      try {
        await axios.post("/api/admin/poolbuilder/items", {
          ...this.currentLocation,
          category_id: this.locationCategoryId,
        });
        toast.success("Location added");
        this.locations = this.getLocations();
      } catch (e) {
        toast.error("Something went wrong while adding location");
        console.log(e);
      }
    },

    handleSortable() {
      UIkit.util.on("#locations", "moved", (e) => {
        const children = e.target.children;
        for (let i = 0; i < children.length; i++) {
          this.locations.find((location) => {
            if (location.id === parseInt(children[i].dataset.id)) {
              location.sorting = i + 1;
            }
          });
        }
        this.saveNewSorting();
      });
    },
    saveNewSorting() {
      const sortingMap = this.locations.map((location) => {
        return { id: location.id, sorting: location.sorting };
      });
      axios
        .post("/api/admin/poolbuilder/items/sort", sortingMap)
        .then(() => {
          toast.success("Sorting updated");
        })
        .catch((error) => {
          toast.error("Something went wrong while storing new sorting");
          console.log(error);
        });
    },
    handleSwitchToLocation(id) {
      this.$router.push({ path: `/admin/pool-builder/location/${id}` });
    },
    async getCategories() {
      try {
        const result = await axios.get("/api/admin/poolbuilder/categories");
        return result.data;
      } catch (e) {
        console.log(e);
      }
    },
    async getLocations() {
      try {
        const result = await axios.get(
          `/api/admin/poolbuilder/items?category_id=${this.locationCategoryId}`
        );
        this.locations = result.data.map((location) => {
          const builderItem = new BuilderItem();
          builderItem.setData(location);
          return builderItem;
        });
      } catch (e) {
        console.log(e);
      }
    },
  },
};
</script>

<style scoped></style>
