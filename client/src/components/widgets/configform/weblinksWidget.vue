<template>
  <div :class="{ 'uk-margin uk-card uk-card-default': inCard }">
    <div class="uk-card-header" v-if="inCard">
      <h3 class="uk-card-title">Weblinks</h3>
    </div>
    <div :class="{ 'uk-card-body': inCard }">
      <table class="uk-table uk-table-divider uk-table-small">
        <thead>
          <th>Label</th>
          <th>URL</th>
          <th></th>
        </thead>
        <tbody>
          <tr v-for="link of weblinks" :key="link.id">
            <td>{{ link.label }}</td>
            <td>{{ link.uri }}</td>
            <td></td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="uk-card-footer uk-flex uk-flex-right">
      <button
        class="uk-button uk-button-secondary uk-button-small uk-width-1-1 uk-width-auto@m"
        @click="handleAddLinkClicked"
      >
        Add Weblink
      </button>
    </div>
    <div id="weblink-add-modal" class="uk-flex-top" uk-modal>
      <div class="uk-modal-dialog uk-margin-auto-vertical">
        <button class="uk-modal-close-default" type="button" uk-close></button>
        <div class="uk-modal-header">
          <h3 class="uk-modal-title">Add Weblink</h3>
        </div>
        <div class="uk-modal-body">
          <div class="uk-form">
            <div class="uk-margin">
              <label for="label" class="uk-form-label"
                >Label
                <input
                  type="text"
                  ref="labelInput"
                  name="label"
                  id="label"
                  class="uk-input"
                  placeholder="Label"
                  v-model="form.label"
                />
              </label>
              <div
                v-for="error of v$.form.label.$errors"
                :key="error"
                class="uk-text-danger"
              >
                {{ error.$message }}
              </div>
            </div>
            <div class="uk-margin">
              <label for="uri" class="uk-form-label"
                >URI
                <input
                  type="url"
                  name="uri"
                  id="uri"
                  class="uk-input"
                  placeholder="https://www.website.tld"
                  v-model="form.uri"
                />
              </label>
              <div
                v-for="error of v$.form.uri.$errors"
                :key="error"
                class="uk-text-danger"
              >
                {{ error.$message }}
              </div>
            </div>
            <div class="uk-margin">
              <label for="description"
                >Description
                <textarea
                  name="description"
                  id="description"
                  class="uk-textarea"
                  placeholder="What can we find on this website?"
                  v-model="form.description"
                ></textarea>
              </label>
            </div>
          </div>
        </div>
        <div class="uk-modal-footer">
          <div class="uk-flex uk-flex-right@m uk-grid-small" uk-grid>
            <div class="uk-width-1-1 uk-width-auto@m">
              <button
                class="uk-width-1-1 uk-button uk-button-secondary uk-modal-close"
                type="button"
              >
                Cancel
              </button>
            </div>
            <div class="uk-width-1-1 uk-width-auto@m">
              <button
                class="uk-width-1-1 uk-button uk-button-primary"
                type="button"
                @click="handleSaveLinkClicked"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import UIkit from "uikit";
import { useVuelidate } from "@vuelidate/core";
import { required, url } from "@vuelidate/validators";

export default {
  name: "weblinksWidget",
  emits: ["link-added"],
  setup() {
    const v$ = useVuelidate();
    return { v$ };
  },
  props: {
    inCard: {
      type: Boolean,
      default: true,
    },
    links: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      weblinks: [],
      form: {
        label: "",
        uri: "",
        description: "",
      },
    };
  },
  validations() {
    return {
      form: {
        label: { required },
        uri: { required, url },
      },
    };
  },
  mounted() {
    UIkit.util.on("#weblink-add-modal", "shown", () => {
      this.$refs.labelInput.focus();
    });
  },
  methods: {
    handleAddLinkClicked() {
      this.form.label = "";
      this.form.uri = "";
      this.v$.$reset();
      UIkit.modal("#weblink-add-modal").show();
    },
    async handleSaveLinkClicked() {
      const formIsValid = await this.v$.$validate();
      if (!formIsValid) return;
      const linkItem = {
        label: this.form.label,
        uri: this.form.uri,
        description: this.form.description,
        id: 0,
      };
      this.$emit("link-added", linkItem);
      UIkit.modal("#weblink-add-modal").hide();
    },
  },
};
</script>

<style scoped></style>
