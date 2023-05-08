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
      <table class="uk-table uk-table-divider uk-table-middle">
        <thead>
          <tr>
            <th>Logo</th>
            <th>Name</th>
            <th
              class="uk-text-center"
              v-if="
                authStore.hasPermission('canUpdateManufacturer') ||
                authStore.hasPermission('canDeleteManufacturer')
              "
            >
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="manufacturer of manufacturers" :key="manufacturer.id">
            <td class="">
              <img
                v-if="manufacturer.image"
                :src="manufacturer.image"
                :alt="manufacturer.name"
                width="150"
                class="uk-border-rounded"
              />
            </td>
            <td class="uk-width-expand">{{ manufacturer.name }}</td>
            <td
              v-if="
                authStore.hasPermission('canUpdateManufacturer') ||
                authStore.hasPermission('canDeleteManufacturer')
              "
            >
              <div class="uk-button-group">
                <button
                  class="uk-button uk-button-default"
                  @click="editManufacturer(manufacturer.id)"
                  v-if="authStore.hasPermission('canUpdateManufacturer')"
                >
                  <font-awesome-icon
                    class="uk-preserve-width"
                    :icon="['fas', 'pencil']"
                  />
                </button>
                <button
                  class="uk-button uk-button-danger"
                  v-if="authStore.hasPermission('canDeleteManufacturer')"
                  @click="deleteManufacturer(manufacturer)"
                >
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
import UIkit from "uikit";

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
      this.manufacturers = manufacturers;
    });
  },
  methods: {
    async fetchManufacturers() {
      const result = await axios.get("/api/manufacturers");
      return result.data;
    },
    editManufacturer(id) {
      this.$router.push({ name: "edit-manufacturer", params: { id: id } });
    },
    async deleteManufacturer(manufacturer) {
      const confirm = await UIkit.modal
        .confirm(
          `Are you sure you want to delete <b>${manufacturer.name}</b> from the list of Manufacturers?<br>Linked devices to this manufacturer will not be deleted.`,
          {
            labels: { ok: "Yes", cancel: "No" },
          }
        )
        .then(
          function () {
            return true;
          },
          function () {
            return false;
          }
        );

      if (!confirm) return;
      const result = await axios.delete(
        "/api/manufacturers/" + manufacturer.id
      );
      if (result.status === 200) {
        this.fetchManufacturers().then((manufacturers) => {
          this.manufacturers = manufacturers;
        });
      }
    },
  },
};
</script>

<style scoped></style>
