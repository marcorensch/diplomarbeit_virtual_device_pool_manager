<template>
  <div class="uk-section uk-padding-remove guideme-list-view">
    <div class="uk-container">

      <h1 class="uk-margin-remove-top">Guides</h1>

      <div class="actions uk-background-muted uk-border-rounded uk-padding-small">
        <div class="uk-flex">
          <div>
            <button
                v-if="auth.hasPermission('canCreateGuides')"
                class="uk-button uk-button-primary"
                @click="handleCreateGuideClicked"
            >
              <font-awesome-icon :icon="['fas', 'plus']"/>
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
                    placeholder="Search Guide"
                    v-model="search_guide"
                    @keyup="searchTimeOut"
                />
                <div
                    v-if="search_guide.length > 0"
                    class="uk-position-center-right clear-search-icon"
                    style="margin-right: 15px"
                    @click="handleClearSearchGuideClicked"
                    uk-tooltip="Clear search filter"
                >
                  <font-awesome-icon :icon="['fas', 'xmark']"/>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="uk-width-1-1" v-for="guide of guides" :key="guide.id">
        <div class="uk-margin-small-top">
          <div class="uk-card uk-card-default uk-position-relative" :uk-tooltip="guide.visible === 1 ? 'Guide is visible' : 'Guide is hidden'">
            <router-link class="uk-position-cover" :to="{ name: 'admin-guide-slides', params: { id: guide.id } }"/>
            <div class="uk-position-top-right uk-padding-small edit-div">
              <router-link class="uk-position-cover" :to="{ name: 'admin-guide-edit', params: { id: guide.id } }"/>
              <font-awesome-icon :icon="['fas', 'cog']"/>
            </div>

            <div class="uk-grid-small uk-flex-middle" uk-grid>
              <div class="uk-width-expand">
                <div class="uk-card-header">
                  <h3 class="uk-card-title">
                    {{ guide.name }}
                    <span class="uk-text-small uk-text-middle">
                      <font-awesome-icon class="uk-preserve-width uk-text-success" :icon="['fas', 'eye']"
                                         v-if="guide.visible"
                      />
                      <font-awesome-icon class="uk-preserve-width uk-text-warning" :icon="['fas', 'eye-slash']" v-else/>
                    </span>
                  </h3>
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
    <PaginationWidget
        :total_count="guides_total_count"
        :default_page_size="page_size"
        :updateTrigger="triggerCounter"
        @pageSizeChange="handlePageSizeChange"
        @pageChange="handlePageChange"
    />
  </div>
</template>

<script>
import {useAuthStore} from "@/stores/auth";
import axios from "axios";
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";
import PaginationWidget from "@/components/widgets/PaginationWidget.vue";

export default {
  name: "GuideMeListView",
  components: {PaginationWidget, FontAwesomeIcon},
  setup() {
    const auth = useAuthStore();
    return {auth};
  },
  data() {
    return {
      guides: [],
      search_guide: "",
      guides_total_count: 0,
      page_size: 20,
      page: 1,
      triggerCounter: 0,
    };
  },
  mounted() {
    this.getGuides();
  },
  methods: {
    searchTimeOut(e) {
      if (e.key === "Enter") {
        clearTimeout(this.timer);
        this.timer = null;
        this.getGuides();
        return;
      }
      if (this.timer) {
        clearTimeout(this.timer);
        this.timer = null;
      }
      this.timer = setTimeout(() => {
        this.getGuides();
      }, 500);
    },
    async getGuides() {
      let query = `?limit=${this.page_size}&page=${this.page}`;
      query += this.search_guide.length ? `&search=${this.search_guide}` : "";
      try {
        const response = await axios.get(`/api/admin/guides${query}`);
        this.guides = response.data.guides;
        this.guides_total_count = response.data.total_count;
      } catch (error) {
        console.log(error);
      }
    },
    handlePageSizeChange(page_size) {
      this.triggerCounter++;
      this.page_size = page_size;
      this.getGuides();
    },
    handlePageChange(page) {
      this.page = page;
      this.getGuides();
    },
    handleCreateGuideClicked() {
      this.$router.push({name: "admin-guide-create"});
    },
    handleClearSearchGuideClicked() {
      this.search_guide = "";
      this.getGuides();
    },
  },
};
</script>

<style scoped></style>
