<template>
  <div class="uk-section user-list-view uk-padding-remove">
    <div class="uk-container nxd-padding-xlarge-bottom">
      <div class="uk-grid-small uk-flex uk-flex-middle" uk-grid>
        <div>
          <router-link :to="{ name: 'guides' }" class="go-back-link">
            <font-awesome-icon
                class="uk-h2 uk-preserve-width uk-margin-remove-bottom"
                :icon="['fas', 'arrow-left']"
            />
          </router-link>
        </div>
        <div>
          <h2 class="uk-h1" v-if="guide.id">Edit Guide {{ guide.name }}</h2>
          <h2 class="uk-h1" v-else>Create New Guide</h2>
        </div>
      </div>
      <div class="uk-margin">
        <div class="uk-card uk-card-default">
          <div class="uk-card-header">
            <h3 class="uk-card-title">Information</h3>
          </div>
          <div class="uk-card-body">
            <div class="uk-margin">
              <div class="uk-grid-small uk-flex-middle" uk-grid>
                <div class="uk-width-1-1 uk-width-3-4@m">
                  <label class="uk-form-label" for="name"> Name </label>
                  <div class="uk-form-controls">
                    <input id="name"
                           class="uk-input"
                           type="text"
                           placeholder="Guide Name"
                           v-model="guide.name"
                           :class="{
                        'uk-form-invalid':
                          v$.guide.name.$errors.length,
                      }"
                    />
                    <div
                        v-for="error of v$.guide.name.$errors"
                        :key="error"
                        class="uk-text-danger"
                    >
                      {{ error.$message }}
                    </div>
                  </div>
                </div>
                <div class="uk-width-expand">
                  <label class="uk-form-label" for="visible"> Visibility </label>
                  <div class="uk-form-controls">
                    <select id="visible"
                            class="uk-select uk-border-rounded"
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
      </div>
      <div v-if="guide.id" class="uk-margin">
        <div class="uk-card uk-card-default uk-position-relative">
          <router-link
              :to="{ name: 'admin-guide-slides', params: { id: guide.id } }"
              class="uk-position-cover"
          />
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
                    class="uk-text-large uk-preserve-width nxd-link-icon"
                    :icon="['fas', 'chevron-right']"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-if="guide.id" class="uk-margin">
        <div class="uk-card uk-card-default nxd-cursor-pointer" @click="handleShowDeviceSelectionModal">
          <div class="uk-flex uk-flex-middle uk-grid-small uk-grid">
            <div class="uk-width-expand">
              <div class="uk-card-header">
                <h3 class="uk-card-title">Linked Devices</h3>
              </div>
              <div class="uk-card-body">
                <div class="uk-flex uk-grid-small linked-devices" uk-grid>
                  <template v-for="d of linkedDevices" :key="d.id">
                    <div>
                      <div class="uk-label">{{ d.name }}</div>
                    </div>
                  </template>
                </div>
              </div>
            </div>
            <div class="uk-padding uk-text-right">
              <font-awesome-icon class="uk-text-large uk-preserve-width nxd-link-icon" :icon="['fas', 'chevron-right']"/>
            </div>
          </div>
        </div>
      </div>
    </div>
    <ControlsFooterWidget
        :can-delete="guide.id && auth.hasPermission('canDeleteGuides')"
        @cancel="handleCancelClicked"
        @delete="handleDeleteClicked"
        @save="handleSaveClicked"
    />
    <DevicesSelectionModal :linkedDeviceIds="this.guide.linkedDeviceIds" ref="devicesSelectionModal"
                           @updateLinkedDevices="getLinkedDevices"/>
  </div>
</template>

<script>
import ControlsFooterWidget from "@/components/ControlsFooterWidget.vue";
import axios from "axios";
import {useAuthStore} from "@/stores/auth";
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";
import {useToast} from "vue-toastification";
import DevicesSelectionModal from "@/components/guides/DevicesSelectionModal.vue";
import GuideMeItem from "@/models/GuideMeItem.mjs";
import { useVuelidate } from "@vuelidate/core";
import { required, minLength } from "@vuelidate/validators";

export default {
  name: "GuideMeEditorView",
  components: {DevicesSelectionModal, FontAwesomeIcon, ControlsFooterWidget},
  setup() {
    const auth = useAuthStore();
    const toast = useToast();
    const v$ = useVuelidate();
    return {auth, toast, v$};
  },
  data() {
    return {
      guide: new GuideMeItem(),
      linkedDevices: [],
    };
  },
  validations() {
    return {
      guide: {
        name: {required, minLength: minLength(5)},
      },
    };
  },
  async mounted() {
    if (this.$route.params.id) {
      await this.getGuide(this.$route.params.id);
      await this.getLinkedDevices();
    }
    ;
  },
  methods: {
    async getGuide(id) {
      const result = await axios.get(`/api/admin/guides/${id}`);
      this.guide.setData(result.data.guide)
    },
    handleCancelClicked() {
      this.$router.push({name: "guides"});
    },
    async handleDeleteClicked() {
      if (!this.guide.id) return;
      try {
        await axios.delete(`/api/admin/guides/${this.guide.id}`);
        this.$router.push({name: "guides"});
      } catch (error) {
        this.toast.error("Unable to delete guide");
      }
    },
    async handleSaveClicked() {
      const validation = await this.v$.$validate();
      if (!validation) return;
      try {
        if (this.guide.id) {
          await axios.put(`/api/admin/guides/${this.guide.id}`, this.guide);
        } else {
          await axios.post("/api/admin/guides", this.guide);
        }
        this.$router.push({name: "guides"});
      } catch (error) {
        this.toast.error("Unable to save guide");
      }
    },
    handleShowDeviceSelectionModal() {
      this.$refs.devicesSelectionModal.show();
    },
    async getLinkedDevices() {
      try {
        const response = await axios.get(`/api/admin/guides/${this.guide.id}/devices`);
        this.linkedDevices = response.data.devices;
      } catch (error) {
        console.log(error);
      }
    },
  },
};
</script>

<style scoped></style>
