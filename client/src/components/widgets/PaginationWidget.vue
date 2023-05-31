<template>
  <div class="uk-width-1-1 uk-padding">
    <div class="uk-width-max-content uk-margin-auto">
      <div>
        <ul class="uk-pagination uk-flex-center" uk-margin>
          <li>
            <a href="#" @click="handlePrevPageSelected"
              ><span uk-pagination-previous></span
            ></a>
          </li>
          <template v-for="page in available_pages" :key="page">
            <li :class="{ 'uk-active': selected_page === page }">
              <a href="#" @click="handlePageSelected(page)">{{ page }}</a>
            </li>
          </template>
          <li>
            <a href="#" @click="handleNextPageSelected"
              ><span uk-pagination-next></span
            ></a>
          </li>
        </ul>
      </div>
      <div class="uk-width-max-content uk-margin-auto">
        <select
          name="select_page_size"
          class="uk-select uk-form-width-small uk-text-center uk-border-rounded"
          id="select_page_size"
          v-model="selected_page_size"
          @change="$emit('page-size-change', $event.target.value)"
        >
          <option
            v-for="page_size in page_sizes"
            :key="page_size"
            :value="page_size"
          >
            {{ page_size }}
          </option>
        </select>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "PaginationWidget",
  emits: ["page-size-change", "page-change"],
  props: {
    total_count: {
      type: Number,
      required: true,
    },
    default_page_size: {
      type: Number,
      default: 10,
    },
    updateTrigger: {
      type: Number,
      default: 0,
    },
  },
  watch: {
    total_count: function () {
      this.pages = Math.ceil(this.total_count / this.selected_page_size);
      this.updateAvailablePages();
    },
    updateTrigger: function () {
      console.log("updateTrigger");
      this.pages = Math.ceil(this.total_count / this.selected_page_size);
      this.updateAvailablePages();
    },
  },
  data() {
    return {
      selected_page: 1,
      pages: 0,
      available_pages: [],
      selected_page_size: this.default_page_size,
      page_sizes: [1, 10, 20, 50, 100],
    };
  },
  methods: {
    updateAvailablePages() {
      this.available_pages = [];
      const limit = 5;
      if (this.selected_page > this.pages) {
        this.selected_page = this.pages;
      }
      let start = this.selected_page - Math.floor(limit / 2);
      if (start < 1) {
        start = 1;
      }
      let end = start + limit - 1;
      if (end > this.pages) {
        end = this.pages;
      }
      for (let i = start; i <= end; i++) {
        this.available_pages.push(i);
      }
      if (this.selected_page > end) {
        this.selected_page = end;
      }
    },
    handlePrevPageSelected() {
      this.selected_page -= 1;
      if (this.selected_page < 1) {
        this.selected_page = 1;
      }
      this.$emit("page-change", this.selected_page);
    },
    handleNextPageSelected() {
      this.selected_page += 1;
      if (this.selected_page > this.pages) {
        this.selected_page = this.pages;
      }
      this.$emit("page-change", this.selected_page);
    },
    handlePageSelected(page) {
      this.selected_page = page;
      this.$emit("page-change", page);
    },
  },
};
</script>

<style scoped></style>
