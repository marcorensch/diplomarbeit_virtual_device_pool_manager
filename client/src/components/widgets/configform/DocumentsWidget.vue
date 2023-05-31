<template>
  <div class="uk-card uk-card-default">
    <div class="uk-card-header">
      <h3 class="uk-card-title">Documents</h3>
    </div>
    <div class="uk-card-body">
      <ul
        id="documents-list"
        class="uk-list uk-list-small uk-list-divider"
        uk-sortable="handler: .document-icon"
      >
        <template v-for="doc of documents" :key="doc.id">
          <li class="uk-text-truncate" :data-uri="doc.uri">
            <div class="uk-display-inline">
              <font-awesome-icon
                class="document-icon uk-drag"
                :icon="['fas', 'file']"
              />
              <span
                :uk-tooltip="
                  !doc.id
                    ? 'Click Save to link element'
                    : 'Click to show actions'
                "
                class="uk-margin-small-left nxd-cursor-pointer"
                :class="{
                  'uk-text-italic uk-text-muted': !doc.id,
                  'uk-text-danger': doc.id && doc.toDelete,
                }"
                >{{ doc.name }}</span
              >
              <div uk-drop="mode:click">
                <div
                  class="uk-button-group uk-card uk-card-default uk-card-small"
                >
                  <a
                    :href="buildDocumentUri(doc)"
                    target="_blank"
                    class="uk-button uk-button-default uk-button-small uk-flex uk-flex-middle"
                  >
                    <font-awesome-icon
                      class="uk-preserve-width"
                      style="font-size: 1.2em"
                      :icon="['fas', 'eye']"
                    />
                  </a>
                  <a
                    :href="buildDocumentUri(doc)"
                    download="true"
                    class="uk-button uk-button-default uk-button-small uk-flex uk-flex-middle"
                  >
                    <font-awesome-icon
                      class="uk-preserve-width"
                      style="font-size: 1.2em"
                      :icon="['fas', 'cloud-arrow-down']"
                    />
                  </a>

                  <button
                    class="uk-button uk-button-default uk-button-small uk-flex uk-flex-middle"
                    @click="handleDocumentUnlink(doc)"
                  >
                    <font-awesome-icon
                      class="uk-preserve-width"
                      style="font-size: 1.2em"
                      :icon="['fas', 'unlink']"
                    />
                  </button>
                  <button
                    class="uk-button uk-button-default uk-button-small uk-flex uk-flex-middle"
                    @click="handleDocumentRename(doc)"
                  >
                    <font-awesome-icon
                      class="uk-preserve-width"
                      style="font-size: 1.2em"
                      :icon="['fas', 'pencil']"
                    />
                  </button>
                </div>
              </div>
            </div>
          </li>
        </template>
      </ul>
    </div>
    <div class="uk-card-footer">
      <div class="uk-flex uk-flex-right">
        <div>
          <button
            class="uk-button uk-button-secondary uk-button-small"
            @click="show"
          >
            Add Document
          </button>
        </div>
      </div>
    </div>
    <div id="documents-manager-modal" class="uk-modal-container" uk-modal>
      <div class="uk-modal-dialog">
        <div class="uk-modal-header">
          <h3 class="uk-modal-title">Select Document</h3>
        </div>
        <div class="uk-modal-body uk-padding-remove">
          <FileManager
            :id="'documents-manager'"
            :updateTriggerCounter="updateTriggerCounter"
            :baseDir="'documents'"
            :allowed-filetypes="'image/jpeg, image/png, image/gif, image/webp, application/pdf, application/msword, application/vnd.openxmlformats-officedocument.wordprocessingml.document, application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-powerpoint, application/vnd.openxmlformats-officedocument.presentationml.presentation, text/plain, application/zip, application/x-rar-compressed, application/x-7z-compressed, application/x-tar, application/x-bzip, application/x-bzip2, application/gzip,'"
            @file-selected="handleFileSelected"
          />
        </div>
        <div class="uk-modal-footer">
          <div
            class="uk-child-width-1-1 uk-child-width-auto@s uk-grid-small uk-flex-right@s"
            uk-grid
          >
            <div>
              <button
                class="uk-width-1-1 uk-button uk-button-secondary uk-modal-close"
              >
                Cancel
              </button>
            </div>
            <div>
              <button
                class="uk-width-1-1 uk-button uk-button-primary uk-modal-close"
                :class="{ 'uk-disabled': !this.fileFromManager }"
                @click="handleDocumentSelected"
              >
                Select
              </button>
            </div>
          </div>
        </div>
        <button class="uk-modal-close-default" type="button" uk-close></button>
      </div>
    </div>
  </div>
</template>

<script>
import UIkit from "uikit";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import FileManager from "@/components/FileManager.vue";

export default {
  name: "DocumentsWidget",
  emits: ["doc-linked", "doc-unlinked", "update-value"],
  props: {
    documents: {
      type: Array,
      default: () => [],
    },
  },
  components: { FileManager, FontAwesomeIcon },
  watch: {
    documents: {
      handler() {
        this.updateTriggerCounter++;
      },
      deep: true,
    },
  },
  data() {
    return {
      fileFromManager: null,
      updateTriggerCounter: 0,
      saveClicked: false,
    };
  },
  mounted() {
    UIkit.util.on("#documents-manager-modal", "hidden", () => {
      if (this.saveClicked) {
        this.saveClicked = false;
        this.$emit("update-value", this.fileFromManager);
      } else {
        this.$emit("update-value", null);
      }
      this.fileFromManager = null;
      this.updateTriggerCounter++;
    });
    UIkit.util.on("#documents-list", "moved", (e, sortable) => {
      for (let i = 0; i < sortable.items.length; i++) {
        const doc = this.documents.find(
          (doc) => doc.uri === UIkit.util.data(sortable.items[i], "uri")
        );
        if (doc) doc.sorting = i + 1;
      }
    });
  },
  methods: {
    show() {
      this.updateTriggerCounter++;
      this.$nextTick(() => {
        UIkit.modal("#documents-manager-modal").show();
      });
    },
    buildDocumentUri(doc) {
      return `/public/${doc.uri}`;
    },
    handleDocumentUnlink(document) {
      this.$emit("doc-unlinked", document);
    },
    handleFileSelected(file) {
      if (file) {
        file.uri = file.fullPath;
        this.fileFromManager = file;
      } else {
        this.fileFromManager = null;
      }
    },
    handleDocumentSelected() {
      this.saveClicked = true;
    },
    handleDocumentRename(document) {
      UIkit.modal.prompt("Rename document", document.name).then((name) => {
        if (name) {
          document.name = name;
        }
      });
    },
  },
};
</script>

<style scoped></style>
