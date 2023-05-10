<template>
  <div>
    <div>
      <div
        class="uk-position-relative"
        uk-height-viewport="offset-top:true; offset-bottom:100px"
        style="overflow: auto"
      >
        <div class="uk-position-cover">
          <div class="uk-padding-small uk-animation-fade">
            <h4>Locations</h4>
            <ul
              class="uk-list uk-list-divider"
              v-if="locations"
              uk-scrollspy="target: > li > div >span; cls: uk-animation-slide-left-small; delay: 80"
            >
              <li
                v-for="location of locations"
                :key="location.id"
                @click="handleLocationSelected(location)"
                :class="{ selected: location.selected }"
              >
                <div>
                  <font-awesome-icon :icon="['fas', 'building']" />
                  <span class="uk-margin-small-left uk-display-inline-block">{{
                    location.name
                  }}</span>
                  <span class="uk-float-right"
                    ><font-awesome-icon :icon="['fas', 'chevron-right']"
                  /></span>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
    <div class="uk-position-relative uk-padding-small">
      <button
        class="uk-width-1-1 uk-button uk-button-secondary uk-button-small"
        @click="handleAddLocationClicked"
      >
        Add Location
      </button>
    </div>
  </div>
</template>

<script>
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import UIkit from "uikit";
import axios from "axios";

export default {
  name: "BuilderLocationsSection",
  components: { FontAwesomeIcon },
  props: {
    categories: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      locations: [],
      locationCategoryId: null,
    };
  },
  mounted() {
    this.locationCategoryId = this.categories.find(
      (category) => category.name === "Location"
    ).id;
    this.getLocations();
  },
  methods: {
    async getLocations() {
      try {
        const result = await axios.get(
          `/api/admin/poolbuilder?category_id=${this.locationCategoryId}`
        );
        console.log(result.data);
        this.locations = result.data;
      } catch (e) {
        console.log(e);
      }
    },
    handleAddLocationClicked() {
      UIkit.modal.prompt("Location name").then((name) => {
        this.storeLocation(name);
      });
    },
    async storeLocation(name) {
      const category_id = this.locationCategoryId;
      if (!name || !category_id) return;
      try {
        const result = await axios.post("/api/admin/poolbuilder", {
          name,
          category_id,
        });
        this.locations.push(result.data);
        console.log(this.locations);
      } catch (e) {
        console.log(e);
      }
    },
    handleLocationSelected(location) {
      this.locations.forEach((location) => {
        location.selected = false;
      });
      location.selected = true;
      this.$emit("location-selected", location);
    },
  },
};
</script>

<style scoped></style>
