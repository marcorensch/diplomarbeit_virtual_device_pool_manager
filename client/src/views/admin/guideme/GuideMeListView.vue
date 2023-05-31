<template>
  <div class="uk-section uk-padding-remove guideme-list-view">
    <div class="uk-container">
      <h1 class="uk-margin-remove-top">Guides</h1>
      <div
        class="actions uk-background-muted uk-border-rounded uk-padding-small"
      >
        <div class="uk-hidden@m uk-flex uk-grid-small">
          <div class="uk-button-group">
            <button
              v-if="auth.hasPermission('canCreateGuides')"
              class="uk-button uk-button-primary"
              @click="handleCreateGuideClicked"
            >
              <font-awesome-icon
                :icon="['fas', 'plus']"
                class="uk-preserve-width"
              />
            </button>
          </div>
          <div>
            <input
              type="text"
              id="search_guide_mobile"
              class="uk-input"
              placeholder="Filter Guides"
              v-model="search_guide"
              @keyup="filterGuideList"
            />
          </div>
        </div>
        <div class="uk-flex uk-visible@m">
          <div>
            <button
              v-if="auth.hasPermission('canCreateGuides')"
              class="uk-button uk-button-primary"
              @click="handleCreateGuideClicked"
            >
              <font-awesome-icon :icon="['fas', 'plus']" />
              Add Guide
            </button>
          </div>
          <div class="uk-width-expand">
            <div class="uk-flex uk-flex-right uk-flex-middle uk-grid-small">
              <div class="uk-width-medium uk-position-relative">
                <input
                  type="text"
                  id="search_account"
                  class="uk-input"
                  placeholder="Filter Guides"
                  v-model="search_guide"
                  @keyup="filterGuideList"
                />
                <div
                  v-if="search_guide.length > 0"
                  class="uk-position-center-right clear-search-icon"
                  style="margin-right: 15px"
                  @click="handleClearSearchGuideClicked"
                  uk-tooltip="Clear search filter"
                >
                  <font-awesome-icon :icon="['fas', 'xmark']" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div>
        <div
          class="uk-margin-small-top"
          v-for="guide of guides"
          :key="guide.id"
        >
          <div class="uk-card uk-card-default uk-position-relative">
            <router-link
              :to="{ name: 'admin-guide-item', params: { id: guide.id } }"
              class="uk-position-cover"
            ></router-link>
            <div class="uk-position-top-right uk-padding-small edit-div">
              <router-link
                class="uk-position-cover"
                :to="{ name: 'admin-guide-edit', params: { id: guide.id } }"
              >
              </router-link>
              <font-awesome-icon :icon="['fas', 'cog']" />
            </div>

            <div class="uk-grid-small uk-flex-middle" uk-grid>
              <div class="uk-width-expand">
                <div class="uk-card-header">
                  <h3 class="uk-card-title">{{ guide.name }}</h3>
                </div>
                <div class="uk-card-body">
                  <div v-html="guide.description"></div>
                </div>
              </div>
              <div class="uk-width-small uk-text-right">
                <div class="uk-padding">
                  <font-awesome-icon
                    class="uk-preserve-width uk-text-large nxd-link-icon"
                    :icon="['fas', 'chevron-right']"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useAuthStore } from "@/stores/auth";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

export default {
  name: "GuideMeListView",
  components: { FontAwesomeIcon },
  setup() {
    const auth = useAuthStore();
    return { auth };
  },
  data() {
    return {
      guides: [],
      search_guide: "",
    };
  },
  mounted() {
    this.getGuides();
  },
  methods: {
    async getGuides() {
      const response = await axios.get("/api/admin/guides");
      console.log(response.data.guides);
      this.guides = response.data.guides;
    },
    handleCreateGuideClicked() {
      this.$router.push({ name: "admin-guide-create" });
    },
    handleClearSearchGuideClicked() {
      this.search_guide = "";
      this.filterGuideList();
    },
    filterGuideList() {
      let search = this.search_guide.toLowerCase();
      this.guides = this.guides.map((guide) => {
        if (!search) {
          guide.isVisible = true;
        } else {
          guide.isVisible = guide.name.toLowerCase().includes(search);
        }
        return guide;
      });
    },
  },
};
</script>

<style scoped></style>
