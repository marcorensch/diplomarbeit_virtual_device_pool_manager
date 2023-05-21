<template>
  <div
    class="uk-section uk-section-small device-config-view uk-position-relative"
    uk-height-viewport="offset-top:true"
  >
    <div v-if="device" class="uk-container nxd-padding-xlarge-bottom">
      <h1 v-if="!device.id">Add Device</h1>
      <h1 v-else>Edit {{ device.name }}</h1>
      <div
        class="uk-position-relative uk-grid-match"
        uk-grid=""
        uk-height-match="target: .uk-card-body"
      >
        <div class="uk-width-1-1 uk-width-2-3@s">
          <div class="uk-card uk-card-default">
            <div class="uk-card-header">
              <h3 class="uk-card-title">Basics</h3>
            </div>
            <div class="uk-card-body">
              <div class="uk-child-width-1-1 uk-child-width-1-2@m" uk-grid>
                <div>
                  <label for="brand">Brand / Manufacturer</label>
                  <select
                    id="brand"
                    class="uk-select"
                    v-model="device.manufacturer_id"
                  >
                    <option
                      v-for="manufacturer of manufacturers"
                      :value="manufacturer.id"
                      :key="manufacturer.id"
                    >
                      {{ manufacturer.name }}
                    </option>
                  </select>
                </div>
                <div>
                  <div class="uk-margin">
                    <label for="model">Model / Name</label>
                    <input
                      type="text"
                      class="uk-input"
                      v-model="device.name"
                      :class="{
                        'form-invalid': v$.device.name.$errors.length,
                      }"
                    />
                    <div
                      v-for="error of v$.device.name.$errors"
                      :key="error"
                      class="uk-text-danger"
                    >
                      {{ error.$message }}
                    </div>
                  </div>
                </div>
              </div>
              <div
                class="uk-margin uk-child-width-1-1 uk-child-width-1-2@m"
                uk-grid
              >
                <div>
                  <div>
                    <label>Device Type</label>
                    <div
                      class="form-container"
                      :class="{
                        'container-invalid':
                          v$.device.device_type_id.$errors.length,
                      }"
                    >
                      <div
                        class="uk-child-width-1-4 uk-grid-small uk-grid-match device-type-selector-container"
                        uk-grid
                      >
                        <div v-for="type of deviceTypes" :key="type.id">
                          <div
                            class="uk-padding-small uk-text-large uk-card-default uk-text-center device-type-selector-option"
                            :class="{
                              'uk-card-primary':
                                type.id === device.device_type_id,
                            }"
                            @click="handleDeviceTypeClicked(type.id)"
                            :uk-tooltip="'title:' + type.name"
                          >
                            <font-awesome-icon :icon="'fas fa-' + type.icon" />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div
                      v-for="error of v$.device.device_type_id.$errors"
                      :key="error"
                      class="uk-text-danger"
                    >
                      {{ error.$message }}
                    </div>
                  </div>
                </div>
                <div>
                  <div class="uk-margin">
                    <label for="model">IMEI's</label>
                    <div
                      :class="{ 'uk-margin-small-top': index > 0 }"
                      v-for="(imei, index) of device.imei"
                      :key="index"
                    >
                      <div class="uk-grid-small uk-grid-match" uk-grid>
                        <div class="uk-width-expand">
                          <input
                            type="number"
                            ref="imei"
                            class="uk-input"
                            @keyup="v$.$validate()"
                            :class="{
                              'form-invalid':
                                v$.device.imei.$each.$response &&
                                v$.device.imei.$each.$response.$errors[index]
                                  .imei.length,
                            }"
                            v-model="imei.imei"
                          />
                        </div>
                        <div class="uk-width-auto uk-flex-middle">
                          <font-awesome-icon
                            icon="fas fa-trash"
                            @click="handleRemoveImeiClicked(index)"
                          />
                        </div>
                      </div>
                      <template v-if="v$.device.imei.$each.$response">
                        <div
                          class="uk-text-danger uk-text-small"
                          v-for="error in v$.device.imei.$each.$response
                            .$errors[index].imei"
                          :key="error"
                        >
                          {{ error.$message }}
                        </div>
                      </template>
                    </div>
                    <div class="uk-margin-small-top">
                      <button
                        class="uk-button uk-button-secondary uk-button-small uk-width-1-1"
                        @click="handleAddImeiClicked"
                      >
                        Add IMEI
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="uk-width-1-1 uk-width-1-3@s">
          <ImageWidget
            :title="'Image'"
            :image="device.image"
            :baseDir="'images'"
            @image-changed="handleImageChanged"
          />
        </div>
        <div class="uk-width-1-1 uk-width-2-3@s" v-if="canSetPhysicalDevices()">
          <div>
            <div class="uk-card uk-card-default">
              <div class="uk-card-header">
                <h3 class="uk-card-title">Location</h3>
              </div>
              <div class="uk-card-body">
                <div class="uk-child-width-1-1 uk-child-width-1-2@s" uk-grid>
                  <div>
                    <div class="uk-margin">
                      <label for="added">In Pool since</label>
                      <input
                        type="date"
                        class="uk-input"
                        v-model="device.added"
                        :class="{
                          'form-invalid': v$.device.added.$errors.length,
                        }"
                      />
                      <div
                        v-for="error of v$.device.added.$errors"
                        :key="error"
                        class="uk-text-danger"
                      >
                        {{ error.$message }}
                      </div>
                    </div>
                  </div>
                  <div>
                    <div class="uk-margin">
                      <label for="pool-location">Pool Location</label>
                      <div>
                        <span>{{
                          device.slot_id && device.slot?.label
                            ? device.slot.label
                            : "Not set"
                        }}</span>

                        <button
                          class="uk-button uk-button-danger uk-button-small uk-width-auto"
                          v-if="device.slot_id"
                          @click="handleRemoveLocationLinkClicked"
                        >
                          <font-awesome-icon icon="fas fa-trash" />
                        </button>
                      </div>
                      <div class="uk-flex uk-flex-right">
                        <button
                          class="uk-margin-small-top uk-button uk-button-small uk-button-secondary uk-width-1-1"
                          @click="handleSetLocationClicked"
                        >
                          Set Location
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="uk-width-1-1 uk-width-2-3@s">
          <MsisdnWidget
            :storedDeviceMsisdns="device.msisdns"
            @msisdnSelected="handleUpdateSelectedMsisdns"
          />
        </div>
        <div class="uk-width-1-1 uk-width-1-3@s">
          <NotesWidget />
        </div>
        <div class="uk-width-1-1 uk-width-2-3@s">
          <WeblinksWidget
            :in-card="true"
            :weblinks="device.weblinks"
            @link-added-edited="handleLinkAddedOrEdited($event)"
            @link-deleted="handleLinkDeleted($event)"
            @sorting-changed="handleLinksSortingChanged($event)"
          />
        </div>
      </div>
    </div>
    <ControlsFooterWidget
      @cancel="handleCancelClicked"
      @save="handleSaveClicked"
    />
    <PoolSelector ref="poolSelector" @selected="handleSlotSelected($event)" />
  </div>
</template>

<script>
import ImageWidget from "@/components/widgets/configform/ImageWidget.vue";
import NotesWidget from "@/components/widgets/configform/NotesWidget.vue";
import ControlsFooterWidget from "@/components/ControlsFooterWidget.vue";
import MsisdnWidget from "@/components/widgets/configform/MsisdnWidget.vue";
import { useVuelidate } from "@vuelidate/core";
import { required, numeric, helpers } from "@vuelidate/validators";
import DeviceHelper from "@/helpers/DeviceHelper.mjs";
import PoolSelector from "@/components/PoolSelector.vue";
import WeblinksWidget from "@/components/widgets/configform/weblinksWidget.vue";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { useAuthStore } from "@/stores/auth";
import { useToast } from "vue-toastification";
const toast = useToast();

const exactLength = (length) => (value) => value.toString().length === length;

export default {
  name: "DeviceConfigView",
  components: {
    FontAwesomeIcon,
    WeblinksWidget,
    PoolSelector,
    NotesWidget,
    ImageWidget,
    ControlsFooterWidget,
    MsisdnWidget,
  },
  props: {
    id: {
      type: String,
      required: false,
    },
  },
  setup() {
    const v$ = useVuelidate();
    const authStore = useAuthStore();
    return { v$, authStore };
  },
  validations() {
    return {
      device: {
        name: { required },
        device_type_id: { required },
        added: { required },
        imei: {
          $each: helpers.forEach({
            imei: {
              required,
              numeric,
              exactLength: helpers.withMessage(
                "IMEI must be 15 digits long",
                exactLength(15)
              ),
            },
          }),
          $lazy: true,
        },
      },
    };
  },
  data() {
    return {
      device: null,
      deviceTypes: [],
      manufacturers: [],
      slot: null,
    };
  },
  async beforeMount() {
    // Handle the case where the user has no permission to update the device
    const deviceData = await DeviceHelper.loadDevice(this.id);

    if (this.id) {
      if (deviceData.slot_id) {
        if (!this.authStore.hasPermission("canUpdateDevices")) {
          toast.error("You do not have permission to update devices");
          return this.$router.push({ name: "deviceslist" });
        }
      } else {
        if (!this.authStore.hasPermission("canUpdateVirtualDevices")) {
          toast.error("You do not have permission to update virtual devices");
          return this.$router.push({ name: "deviceslist" });
        }
      }
    }
    this.device = deviceData;
  },
  async mounted() {
    this.deviceTypes = await DeviceHelper.getDeviceTypes();
    this.manufacturers = await DeviceHelper.getManufacturers();
  },
  methods: {
    canSetPhysicalDevices() {
      return (
        this.authStore.hasPermission("canCreateDevices") ||
        this.authStore.hasPermission("canUpdateDevices")
      );
    },
    handleSlotSelected(slot) {
      this.device.slot_id = slot.id;
      this.device.slot = slot;
    },
    handleUpdateSelectedMsisdns(msisdns) {
      this.device.msisdns = msisdns;
      console.log(this.device);
    },
    handleImageChanged(imageRelativePath) {
      let path = imageRelativePath.length ? "/public/" + imageRelativePath : "";
      this.device.image = path;
    },
    handleCancelClicked() {
      this.$router.push({ name: "deviceslist" });
    },

    handleAddImeiClicked() {
      this.device.imei.push({ imei: "" });
      this.$nextTick(() => {
        this.$refs.imei[this.device.imei.length - 1].focus();
        this.$nextTick(() => {
          this.v$.$reset();
        });
      });
    },
    handleRemoveImeiClicked(index) {
      this.device.imei.splice(index, 1);
    },
    async handleSaveClicked() {
      const formIsValid = await this.v$.device.$validate();
      if (!formIsValid) return;
      await DeviceHelper.store(this.device);
      this.$router.push({ name: "deviceslist" });
    },

    handleDeviceTypeClicked(deviceTypeId) {
      this.device.device_type_id = deviceTypeId;
    },
    handleSetLocationClicked() {
      this.$refs.poolSelector.showModal();
    },
    handleRemoveLocationLinkClicked() {
      this.device.slot_id = null;
      this.device.slot = null;
    },
    handleLinkAddedOrEdited(link) {
      if (link.id) {
        this.device.weblinks = this.device.weblinks.map((l) => {
          if (l.uri === link.uri) {
            l = link;
          }
          return l;
        });
      } else {
        this.device.weblinks.push(link);
      }
    },
    handleLinkDeleted(link) {
      this.device.weblinks = this.device.weblinks.map((l) => {
        if (l.uri === link.uri) {
          l.toDelete = true;
        }
        return l;
      });
    },
    handleLinksSortingChanged(sortingMap) {
      for (let i = 0; i < sortingMap.length; i++) {
        this.device.weblinks.find((l) => l.uri === sortingMap[i].uri).sorting =
          i + 1;
      }
      console.log(this.device.weblinks);
    },
  },
};
</script>
