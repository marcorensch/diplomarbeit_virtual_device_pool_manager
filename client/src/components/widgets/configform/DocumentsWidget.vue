<template>
  <div class="uk-card uk-card-default">
    <div class="uk-card-header">
      <h3 class="uk-card-title">Documents</h3>
    </div>
    <div class="uk-card-body">
      <ul class="uk-list uk-list-small uk-list-divider">
        <template v-for="doc of documents" :key="doc.id">
          <li class="uk-text-truncate">
            <div class="uk-display-inline">
              <font-awesome-icon :icon="['fas', 'file']" />
              <span class="uk-margin-small-left"
                >This is areally long name lets see what happens now if there is
                no space left</span
              >
            </div>
            <div uk-drop>
              <div
                class="uk-card uk-card-default uk-padding-small uk-width-auto"
              >
                <div class="uk-button-group">
                  <button
                    :href="buildDocumentUri(doc)"
                    target="_blank"
                    class="uk-button uk-button-default uk-button-small uk-flex uk-flex-middle"
                  >
                    <font-awesome-icon :icon="['fas', 'eye']" />
                  </button>
                  <a
                    :href="buildDocumentUri(doc)"
                    download="true"
                    class="uk-button uk-button-default uk-button-small uk-flex uk-flex-middle"
                  >
                    <font-awesome-icon :icon="['fas', 'cloud-arrow-down']" />
                  </a>

                  <button
                    class="uk-button uk-button-default uk-button-small uk-flex uk-flex-middle"
                    @click="handleDocumentUnlink(doc)"
                  >
                    <font-awesome-icon :icon="['fas', 'unlink']" />
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
                :class="{ 'uk-disabled': !this.selectedFile }"
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
  components: { FileManager, FontAwesomeIcon },
  data() {
    return {
      documents: [],
      selectedFile: null,
      updateTriggerCounter: 0,
    };
  },
  methods: {
    show() {
      UIkit.modal("#documents-manager-modal").show();
    },
    buildDocumentUri(document) {
      console.log(document);
    },
    handleDocumentUnlink(document) {
      console.log(document);
    },
    handleFileSelected(file) {
      console.log(file);
    },
    handleDocumentSelected() {
      console.log("handleDocumentSelected");
    },
  },
};
</script>

<style scoped></style>
