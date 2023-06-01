<template>
  <div class="uk-section user-list-view uk-padding-remove">
    <div class="uk-container nxd-padding-xlarge-bottom">
      <h1 v-if="guide.id">Edit Guide {{ guide.name }}</h1>
      <h1 v-else>Create New Guide</h1>
      <div class="uk-margin uk-card uk-card-default">
        <div class="uk-card-header">
          <h3 class="uk-card-title">Information</h3>
        </div>
        <div class="uk-card-body">
          <div class="uk-margin">
            <div class="uk-grid-small uk-flex-middle" uk-grid>
              <div class="uk-width-1-1 uk-width-3-4@m">
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
              <div class="uk-width-expand">
                <label class="uk-form-label" for="visible"> Visibility </label>
                <div class="uk-form-controls">
                  <select
                    class="uk-select uk-border-rounded"
                    id="visible"
                    type="checkbox"
                    v-model="guide.visible"
                  >
                    <option value="0">Hidden</option>
                    <option value="1">Visible</option>
                  </select>
                </div>
              </div>
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
      <div
        v-if="guide.id"
        class="uk-margin uk-card uk-card-default uk-position-relative"
      >
        <router-link
          :to="{ name: 'admin-guide-slides', params: { id: guide.id } }"
          class="uk-position-cover"
        ></router-link>
        <div class="uk-grid-small uk-flex-middle uk-grid" uk-grid>
          <div class="uk-width-expand">
            <div class="uk-card-header">
              <h3 class="uk-card-title">Manage Slides</h3>
            </div>
            <div class="uk-card-body"></div>
          </div>
          <div class="uk-width-small">
            <div class="uk-padding uk-text-right">
              <font-awesome-icon
                class="uk-text-large uk-preserve-width"
                :icon="['fas', 'chevron-right']"
              />
            </div>
          </div>
        </div>
      </div>
      <div v-if="guide.id" class="uk-margin uk-card uk-card-default">
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
      :can-delete="guide.id && auth.hasPermission('canDeleteGuides')"
      @cancel="handleCancelClicked"
      @delete="handleDeleteClicked"
      @save="handleSaveClicked"
    />
  </div>
</template>

<script>
import ControlsFooterWidget from "@/components/ControlsFooterWidget.vue";
import axios from "axios";
import { useAuthStore } from "@/stores/auth";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { useToast } from "vue-toastification";

export default {
  name: "GuideMeEditorView",
  components: { FontAwesomeIcon, ControlsFooterWidget },
  setup() {
    const auth = useAuthStore();
    const toast = useToast();
    return { auth, toast };
  },
  data() {
    return {
      guide: {
        id: null,
        name: "",
        description: "",
        visible: 0,
      },
    };
  },
  mounted() {
    if (this.$route.params.id) this.getGuide(this.$route.params.id);
  },
  methods: {
    async getGuide(id) {
      const result = await axios.get(`/api/admin/guides/${id}`);
      this.guide = result.data.guide;
    },
    handleCancelClicked() {
      this.$router.push({ name: "guides" });
    },
    async handleDeleteClicked() {
      if (!this.guide.id) return;
      try {
        await axios.delete(`/api/admin/guides/${this.guide.id}`);
        this.$router.push({ name: "guides" });
      } catch (error) {
        this.toast.error("Unable to delete guide");
        console.log("handleDeleteClicked", error);
      }
    },
    async handleSaveClicked() {
      try {
        if (this.guide.id) {
          await axios.put(`/api/admin/guides/${this.guide.id}`, this.guide);
        } else {
          await axios.post("/api/admin/guides", this.guide);
        }
        this.$router.push({ name: "guides" });
      } catch (error) {
        this.toast.error("Unable to save guide");
        console.log("handleSaveClicked", error);
      }
    },
  },
};
</script>

<style scoped></style>
