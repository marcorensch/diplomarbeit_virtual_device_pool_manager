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
                            class="uk-input"
                            v-model="imei.imei"
                            :class="{
                              'form-invalid':
                                v$.device.imei.$each.$response.$errors[index]
                                  .imei.length,
                            }"
                          />
                        </div>
                        <div class="uk-width-auto uk-flex-middle">
                          <font-awesome-icon
                            icon="fas fa-trash"
                            @click="handleRemoveImeiClicked(index)"
                          />
                        </div>
                      </div>
                      <div
                        class="uk-text-danger uk-text-small"
                        v-for="error in v$.device.imei.$each.$response.$errors[
                          index
                        ].imei"
                        :key="error"
                      >
                        {{ error.$message }}
                      </div>
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
        <div class="uk-width-1-1 uk-width-2-3@s">
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
                      <div>Chur, 1.304</div>
                      <button
                        class="uk-margin-small-top uk-button uk-button-small uk-button-secondary"
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
        <div class="uk-width-1-1 uk-width-2-3@s">
          <MsisdnWidget
            :storedDeviceMsisdns="device.msisdns"
            @msisdnSelected="handleUpdateSelectedMsisdns"
          />
        </div>
        <div class="uk-width-1-1 uk-width-1-3@s">
          <NotesWidget />
        </div>
      </div>
    </div>
    <ControlsFooterWidget
      @cancel="handleCancelClicked"
      @save="handleSaveClicked"
    />
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

const exactLength = (length) => (value) => value.toString().length === length;

export default {
  name: "DeviceConfigView",
  components: {
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
    return { v$ };
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
        },
      },
    };
  },
  data() {
    return {
      device: null,
      deviceTypes: [],
      manufacturers: [],
    };
  },
  async mounted() {
    this.device = await DeviceHelper.loadDevice(this.id);
    this.deviceTypes = await DeviceHelper.getDeviceTypes();
    this.manufacturers = await DeviceHelper.getManufacturers();
  },
  methods: {
    handleUpdateSelectedMsisdns(msisdns) {
      this.device.msisdns = msisdns;
      console.log(this.device);
    },
    handleImageChanged(imageRelativePath) {
      let path = imageRelativePath.length ? "/public/" + imageRelativePath : "";
      this.device.image = path;
    },
    handleCancelClicked() {
      this.$router.push({ name: "widgets" });
    },

    handleAddImeiClicked() {
      this.device.imei.push({ imei: "" });
    },
    handleRemoveImeiClicked(index) {
      this.device.imei.splice(index, 1);
    },
    async handleSaveClicked() {
      const formIsValid = await this.v$.$validate();
      if (!formIsValid) return;
      await DeviceHelper.store(this.device);
    },
    handleDeviceTypeClicked(deviceTypeId) {
      this.device.device_type_id = deviceTypeId;
    },
  },
};
</script>
