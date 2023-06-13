<template>
  <div class="uk-section uk-section-small devices-list-view" uk-height-viewport="offset-top:true">
    <div class="uk-container">
      <h1>GuideMe</h1>
      <p class="uk-text-lead">On this page you will find helpful step by step guides to support you.</p>

      <div class="actions uk-background-muted nxd-padding-xsmall uk-border-rounded">
        <form class="uk-search uk-search-default uk-width-1-1" @submit="handleSearchSubmit">
          <div class="uk-flex uk-grid-small uk-flex-middle" uk-grid>
            <div>
              <div class="uk-position-relative">
                <span v-if="!search.length" class="uk-search-icon-flip" uk-search-icon></span>
                <input
                    tabindex="0"
                    class="uk-search-input uk-width-medium uk-border-rounded"
                    type="search"
                    placeholder="Search Guides"
                    aria-label="Search Guides"
                    ref="search"
                    v-model="search"
                />

                <div v-if="search.length" class="uk-position-center-right nxd-cursor-pointer" @click="resetSearch"
                     style="right:10px;" uk-icon="close"></div>
              </div>


            </div>
            <div>
              <button class="uk-button uk-button-primary" :class="{'uk-disabled' : !search.length}">
                <font-awesome-icon :icon="['fas', 'search']"/>
              </button>
            </div>
          </div>
        </form>
      </div>

      <div class="nxd-min-height-medium uk-margin uk-child-width-1-1 uk-child-width-1-2@m uk-child-width-1-3@l uk-grid-small" uk-grid
           uk-height-match="target: .uk-card-body"
           uk-scrollspy="target: > div > div.uk-card; cls:uk-animation-slide-bottom-small; delay:100;">
        <template v-for="guide of guides" :key="guide.id">
          <div>
            <div class="uk-card uk-card-default uk-card-small uk-position-relative">
              <div class="uk-grid-collapse uk-flex uk-flex-middle" uk-grid>
                <div class="uk-width-expand">
                  <div class="uk-card-header">
                    <h3 class="uk-card-title">{{ guide.name }}</h3>
                  </div>
                  <div class="uk-card-body uk-padding-remove-top uk-padding-remove-right">
                    <p>{{ guide.description }}</p>

                  </div>
                  <div class="uk-card-footer">
                    <div class="uk-flex uk-grid-small" uk-grid>
                      <div v-for="device of guide.devices" :key="device.id">
                        <span class="uk-label">{{ device.name }}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="uk-width-auto">
                  <div class="uk-padding-small">
                    <font-awesome-icon class="uk-preserve-width nxd-link-icon" :icon="['fas', 'chevron-right']"
                                       size="2x"/>
                  </div>
                </div>
              </div>
              <router-link :to="{ name: 'guide-front', params: { id: guide.id } }" class="uk-position-cover"/>
            </div>
          </div>
        </template>

      </div>
    </div>
    <PaginationWidget
        :total_count="total_count"
        :default_page_size="limit"
        :updateTrigger="updateTrigger"
        @pageChange="handlePageChange"
        @pageSizeChange="handlePageSizeChanged"
    />
  </div>
</template>

<script>

import axios from "axios";
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";
import PaginationWidget from "@/components/widgets/PaginationWidget.vue";

export default {
  name: "GuidesOverview",
  components: {PaginationWidget, FontAwesomeIcon},
  data() {
    return {
      guides: [],
      search: "",
      total_count: 0,
      limit: 10,
      page: 1,
      updateTrigger: 0
    }
  },
  async mounted() {
    await this.getGuides();
  },
  methods: {
    async getGuides() {
      let query = this.buildQueryString();
      try {
        const response = await axios.get(`/api/guides${query}`);
        this.guides = response.data.guides;
        this.total_count = response.data.total_count;
      } catch (error) {
        console.log(error);
      }
    },
    buildQueryString() {
      let queryProps = [];
      let query = "";
      if (this.search.length) {
        queryProps.push(`search=${this.search}`);
      }

      if (this.limit) {
        queryProps.push(`limit=${this.limit}`);
      }

      if(this.page) {
        queryProps.push(`page=${this.page}`);
      }

      if(queryProps.length) {
        query = `?${queryProps.join('&')}`;
      }
      return query;
    },
    handleSearchSubmit(event) {
      event.preventDefault();
      this.page = 1;
      this.updateTrigger++;
      this.getGuides();
    },
    resetSearch() {
      this.search = "";
      this.page = 1;
      this.updateTrigger++;
      this.getGuides();
    },
    handlePageChange(page) {
      this.updateTrigger++;
      this.page = page;
      this.getGuides();
    },
    handlePageSizeChanged(pageSize) {
      if(this.limit > this.guides.length && pageSize > this.limit) {
        this.limit = pageSize;
        return;
      }
      if(pageSize === this.limit) {
        return;
      }
      this.updateTrigger++;
      this.limit = pageSize;
      this.getGuides();
    }
  }
}
</script>

<style scoped>

</style>