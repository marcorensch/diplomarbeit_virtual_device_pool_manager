<template>
  <div
      class="uk-section uk-section-small device-config-view uk-position-relative"
      uk-height-viewport="offset-top:true"
  >
    <div class="uk-container nxd-padding-xlarge-bottom">
      <h1 v-if="!manufacturerEditStore.manufacturer.id">Add Manufacturer</h1>
      <h1 v-else>Edit {{ manufacturerEditStore.manufacturer.name }}</h1>
      <div
          class="uk-position-relative"
          uk-grid=""
          uk-height-match="target: .uk-card"
      >
        <div class="uk-width-1-1 uk-width-2-3@m">
          <div class="uk-card uk-card-default uk-card-body">
            <div class="uk-form">
              <div class="uk-margin">
                <label for="name">Name</label>
                <input
                    id="name"
                    class="uk-input"
                    type="text"
                    v-model="manufacturerEditStore.manufacturer.name"
                    :class="{'form-invalid': v$.manufacturerEditStore.manufacturer.name.$errors.length}"
                />
                <div class="uk-text-danger uk-margin-small-top"
                     v-if="v$.manufacturerEditStore.manufacturer.name.$errors.length">
                  <div v-for="error in v$.manufacturerEditStore.manufacturer.name.$errors">
                    {{ error.$message }}
                  </div>
                </div>
              </div>
              <div>
                <label for="notes">Notes</label>
                <textarea
                    id="notes"
                    class="uk-textarea"
                    v-model="manufacturerEditStore.manufacturer.notes"
                ></textarea>
              </div>
              <div
                  class="uk-margin"
                  v-if="authStore.hasPermission('canHandleHiddenInformation')"
              >
                <label for="hidden">Hidden Notes</label>
                <textarea
                    id="hidden"
                    class="uk-textarea"
                    v-model="manufacturerEditStore.manufacturer.hidden"
                ></textarea>
              </div>
            </div>
          </div>
        </div>
        <div class="uk-width-1-1 uk-width-1-3@m uk-flex-last@m">
          <ImageWidget
              :title="'Logo'"
              :image="manufacturerEditStore.manufacturer.image"
              :baseDir="'logos'"
              @imageChanged="handleImageChanged"
              @updateValue="refreshData('image')"
          />
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
import {useManufacturerEditStore} from "@/stores/manufacturerEdit";
import {useAuthStore} from "@/stores/auth";
import ImageWidget from "@/components/widgets/configform/ImageWidget.vue";
import ControlsFooterWidget from "@/components/ControlsFooterWidget.vue";
import {useVuelidate} from "@vuelidate/core";
import {required, minLength, maxLength} from "@vuelidate/validators";
import {useToast} from "vue-toastification";

export default {
  name: "ManufacturerConfigView",
  components: {ImageWidget, ControlsFooterWidget},
  setup() {
    return {
      manufacturerEditStore: useManufacturerEditStore(),
      v$: useVuelidate(),
      toast: useToast(),
      authStore: useAuthStore(),
    };
  },
  data() {
    return {
      id: null,
    };
  },
  validations() {
    return {
      manufacturerEditStore: {
        manufacturer: {
          name: {required, minLength: minLength(3), maxLength: maxLength(50)},
        },
      },
    };
  },
  async beforeMount() {
    if (this.$route.params.id) {
      await this.manufacturerEditStore.load(this.$route.params.id);
      if(!this.manufacturerEditStore.manufacturer.id){
        this.toast.error("Manufacturer not found")
        this.$router.push({name: "manufacturers"});
      }
    } else {
      this.manufacturerEditStore.reset();
    }
  },
  async mounted() {
    this.id = this.$route.params.id || null;
  },
  methods: {
    handleCancelClicked() {
      this.$router.push({name: "manufacturers"});
    },
    async handleSaveClicked() {
      const formValid = await this.v$.$validate();
      if (!formValid) return;
      const success = await this.manufacturerEditStore.save();
      if (success) this.$router.push({name: "manufacturers"});
    },
    handleImageChanged(imageRelativePath) {
      let path = imageRelativePath.length ? "/public/" + imageRelativePath : "";
      this.manufacturerEditStore.manufacturer.image = path;
    },
    async refreshData(key) {
      // This method is required to refresh the data in the device object on possible changes in the filemanager
      if (!this.id) return;
      const newData = await this.manufacturerEditStore.getUpdatedData(this.id);
      if (!newData || !newData[key]) return;
      this.manufacturerEditStore.manufacturer[key] = newData[key];
    },
  },
};
</script>
