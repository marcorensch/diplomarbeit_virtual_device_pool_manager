<template>
  <div :class="{ 'uk-margin uk-card uk-card-default': inCard }">
    <div class="uk-card-header" v-if="inCard">
      <h3 class="uk-card-title">Weblinks</h3>
    </div>
    <div :class="{ 'uk-card-body': inCard }">
      <table class="uk-table uk-table-divider uk-table-small uk-table-middle">
        <thead>
          <th class="uk-table-shrink">
            <font-awesome-icon
              :icon="['fas', 'grip-lines-vertical']"
              class="uk-preserve-width"
              style="opacity: 0"
            />
          </th>
          <th>Label</th>
          <th>URL</th>
          <th></th>
        </thead>
        <tbody
          id="weblinks-sortable-table"
          uk-sortable="target: > tr; handler: .weblinks-sort-handler"
        >
          <template v-for="link of weblinks" :key="link.id">
            <tr
              :data-uri="link.uri"
              :class="{
                'uk-text-italic': link.id === 0,
                'uk-hidden': link.toDelete,
              }"
            >
              <td>
                <div class="weblinks-sort-handler uk-drag">
                  <font-awesome-icon
                    :icon="['fas', 'grip-lines-vertical']"
                    class="uk-preserve-width"
                  />
                </div>
              </td>
              <td class="uk-width-small">{{ link.name }}</td>
              <td class="uk-table-expand" :uk-tooltip="link.description">
                <span class="uk-display-inline-block">{{ link.uri }}</span>
              </td>
              <td class="uk-width-small">
                <div class="uk-button-group">
                  <button
                    v-if="authStore.hasPermission('canUpdateLinks')"
                    class="uk-button uk-button-default"
                    @click="handleEditClicked(link)"
                  >
                    <font-awesome-icon
                      :icon="['fas', 'pencil']"
                      class="uk-preserve-width"
                    />
                  </button>
                  <button
                    v-if="authStore.hasPermission('canDeleteLinks')"
                    class="uk-button uk-button-danger"
                    @click="handleDeleteClicked(link)"
                  >
                    <font-awesome-icon
                      :icon="['fas', 'trash']"
                      class="uk-preserve-width"
                    />
                  </button>
                </div>
              </td>
            </tr>
          </template>
        </tbody>
      </table>
    </div>
    <div class="uk-card-footer uk-flex uk-flex-right">
      <button
        v-if="authStore.hasPermission('canCreateLinks')"
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
              <label for="name" class="uk-form-label"
                >Label
                <input
                  type="text"
                  ref="labelInput"
                  name="name"
                  id="name"
                  class="uk-input"
                  placeholder="Label"
                  v-model="form.name"
                  @input="v$.form.name.$touch()"
                  @blur="v$.form.name.$touch()"
                />
              </label>
              <div
                v-for="error of v$.form.name.$errors"
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
                  @input="v$.form.uri.$touch()"
                  @blur="v$.form.uri.$touch()"
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
import { required, url, helpers } from "@vuelidate/validators";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { useAuthStore } from "@/stores/auth";
import { useToast } from "vue-toastification";

class WeblinkItem {
  constructor() {
    this.id = 0;
    this.name = "";
    this.uri = "";
    this.description = "";
    this.sorting = 999;
    this.toDelete = false;
  }

  static fromObject(obj) {
    const item = new WeblinkItem();
    item.id = obj.id;
    item.name = obj.name;
    item.uri = obj.uri;
    item.description = obj.description || "";
    item.sorting = obj.sorting || 999;
    item.toDelete = obj.toDelete || false;
    return item;
  }
}

function alreadySet(value) {
  return !this.linkElementsTocompareWith.some((link) => link.uri === value);
}
function nameAlreadySet(value) {
  return !this.linkElementsTocompareWith.some((link) => link.name === value);
}

export default {
  name: "weblinksWidget",
  components: { FontAwesomeIcon },
  emits: ["link-added-edited", "link-deleted", "sorting-changed"],
  setup() {
    const v$ = useVuelidate();
    const authStore = useAuthStore();
    const toast = useToast();
    return { v$, authStore, toast };
  },
  props: {
    inCard: {
      type: Boolean,
      default: true,
    },
    weblinks: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      form: new WeblinkItem(),
      linkElementsTocompareWith: [],
    };
  },
  validations() {
    return {
      form: {
        name: {
          required,
          nameAlreadySet: helpers.withMessage(
            "Name already set.",
            nameAlreadySet
          ),
        },
        uri: {
          required,
          url,
          alreadySet: helpers.withMessage("URL already set.", alreadySet),
        },
      },
    };
  },
  mounted() {
    UIkit.util.on("#weblink-add-modal", "shown", () => {
      this.$nextTick(() => {
        this.$refs.labelInput.focus();
      });
    });
    UIkit.util.on("#weblink-add-modal", "hidden", () => {
      this.form = new WeblinkItem();
      this.v$.$reset();
    });
    UIkit.util.on("#weblinks-sortable-table", "moved", (e, sortable) => {
      if (this.authStore.hasPermission("canUpdateLinks")) {
        const sortingMap = [];
        sortable.items.forEach(function (item) {
          sortingMap.push({ uri: UIkit.util.data(item, "uri") });
        });
        this.$emit("sorting-changed", sortingMap);
      } else {
        sortable.cancel();
        this.toast.error("You are not allowed to change the sorting.");
      }
    });
  },
  methods: {
    handleAddLinkClicked() {
      this.linkElementsTocompareWith = this.weblinks;
      this.v$.$reset();
      UIkit.modal("#weblink-add-modal").show();
    },
    async handleSaveLinkClicked() {
      this.v$.$reset();
      const formIsValid = await this.v$.$validate();
      if (!formIsValid) return;
      const item = { ...this.form };
      await UIkit.modal("#weblink-add-modal").hide();
      this.$emit("link-added-edited", item);
    },
    handleDeleteClicked(link) {
      this.$emit("link-deleted", link);
    },
    handleEditClicked(link) {
      this.linkElementsTocompareWith = this.weblinks.filter(
        (item) => item.uri !== link.uri
      );
      this.v$.$reset();
      this.form = link;

      UIkit.modal("#weblink-add-modal").show();
    },
  },
};
</script>

<style scoped></style>
