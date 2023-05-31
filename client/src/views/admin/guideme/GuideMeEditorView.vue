<template>
  <div class="uk-section user-list-view uk-padding-remove">
    <div class="uk-container nxd-padding-xlarge-bottom">
      <h1 v-if="id">Edit Guide {{ guide.name }}</h1>
      <h1 v-else>Create New Guide</h1>
      <div class="uk-margin uk-card uk-card-default">
        <div class="uk-card-header">
          <h3 class="uk-card-title">Information</h3>
        </div>
        <div class="uk-card-body">
          <div class="uk-margin">
            <label class="uk-form-label" for="name"> Name </label>
            <div class="uk-form-controls">
              <input
                class="uk-input"
                id="name"
                type="text"
                placeholder="Guide Name"
                v-model="guide.name"
              />
            </div>
          </div>
          <div class="uk-margin">
            <label class="uk-form-label" for="description"> Description </label>
            <div class="uk-form-controls">
              <textarea
                class="uk-textarea"
                id="description"
                type="text"
                placeholder="Guide Description"
                v-model="guide.description"
              />
            </div>
          </div>
        </div>
      </div>
      <div v-if="id" class="uk-margin uk-card uk-card-default">
        <div class="uk-card-header">
          <h3 class="uk-card-title">Linked Devices</h3>
        </div>
        <div class="uk-card-body">
          <table
            class="uk-table uk-table-striped uk-table-hover uk-table-middle"
          ></table>
        </div>
      </div>
    </div>
    <ControlsFooterWidget
      :can-delete="id && auth.hasPermission('canDeleteGuides')"
      @cancel="handleCancelClicked"
      @delete="handleDeleteClicked"
      @save="handleSaveClicked"
    />
  </div>
</template>

<script>
import ControlsFooterWidget from "@/components/ControlsFooterWidget.vue";
import axios from "axios";

export default {
  name: "GuideMeEditorView",
  components: { ControlsFooterWidget },
  props: {
    id: {
      type: String,
      default: null,
    },
  },
  data() {
    return {
      guide: {},
    };
  },
  mounted() {
    if (this.$route.params.id) this.getGuide(this.$route.params.id);
  },
  methods: {
    getGuide(id) {
      console.log("getGuide", id);
    },
    handleCancelClicked() {
      this.$router.push({ name: "guideme-list" });
    },
    handleDeleteClicked() {
      console.log("handleDeleteClicked");
    },
    async handleSaveClicked() {
      if (this.id) {
        const result = await axios.put(
          `/api/admin/guides/${this.id}`,
          this.guide
        );
        console.log("handleSaveClicked", result);
        return;
      }
      const result = await axios.post("/api/admin/guides", this.guide);
      console.log("handleSaveClicked", result);
    },
  },
};
</script>

<style scoped></style>
