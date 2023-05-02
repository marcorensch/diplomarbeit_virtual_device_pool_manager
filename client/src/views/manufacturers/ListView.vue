<template>
  <div
    class="uk-section uk-section-small devices-list-view"
    uk-height-viewport="offset-top:true"
  >
    <div class="uk-container">
      <h1>Manufacturers</h1>
      <div
        class="uk-width-1-1 uk-border-rounded uk-background-muted uk-padding-small"
      >
        <div class="uk-flex uk-flex-right">
          <div v-if="authStore.hasPermission('canCreateManufacturer')">
            <router-link
              :to="{ name: 'create-manufacturer' }"
              class="uk-button uk-button-primary uk-flex uk-flex-middle"
            >
              <div>
                <font-awesome-icon :icon="['fas', 'plus']" /> Add Manufacturer
              </div>
            </router-link>
          </div>
        </div>
      </div>
    </div>
    <div class="uk-container">
      <table class="uk-table uk-table-divider">
        <thead>
          <tr>
            <th>Logo</th>
            <th>Name</th>
            <th class="uk-text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="manufacturer of manufacturers" :key="manufacturer.id">
            <td class="uk-width-1-5">
              <img :src="manufacturer.image" alt="LOGO" />
            </td>
            <td class="uk-width-expand">{{ manufacturer.name }}</td>
            <td>
              <div class="uk-button-group">
                <button
                  class="uk-button uk-button-default"
                  @click="editManufacturer(manufacturer.id)"
                >
                  <font-awesome-icon
                    class="uk-preserve-width"
                    :icon="['fas', 'pencil']"
                  />
                </button>
                <button class="uk-button uk-button-danger">
                  <font-awesome-icon
                    class="uk-preserve-width"
                    :icon="['fas', 'trash']"
                  />
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import { useAuthStore } from "@/stores/auth";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

export default {
  name: "listView",
  components: { FontAwesomeIcon },
  setup() {
    const authStore = useAuthStore();
    return {
      authStore,
    };
  },
  data() {
    return {
      manufacturers: [],
    };
  },
  mounted() {
    this.fetchManufacturers().then((manufacturers) => {
      console.log("done");
      console.log(manufacturers);
      this.manufacturers = manufacturers;
    });
  },
  methods: {
    async fetchManufacturers() {
      const result = await axios.get("/api/manufacturers");
      return result.data;
    },
    editManufacturer(id) {
      console.log(id);
      this.$router.push({ name: "edit-manufacturer", params: { id: id } });
    },
  },
};
</script>

<style scoped></style>
