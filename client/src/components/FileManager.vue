<template>
  <div class="file-manager">
    <div class="folder-controls">
      <div class="uk-flex uk-flex-right uk-flex-middle">
        <div>
          <div class="uk-margin-right">
            <input
              type="text"
              class="uk-input"
              placeholder="Search in Folder"
            />
          </div>
        </div>
        <div>
          <div class="actions">
            <div class="uk-button-group">
              <button
                class="uk-button uk-button-default uk-button-small"
                :class="{ 'uk-active': allSelected }"
                @click="toggleSelectAll"
              >
                <font-awesome-icon
                  v-if="!allSelected"
                  :icon="['fas', 'square-check']"
                />
                <font-awesome-icon
                  v-if="allSelected"
                  :icon="['fas', 'square']"
                />
              </button>
            </div>
            <div class="uk-button-group">
              <button
                class="uk-button uk-button-default uk-button-small"
                @click="handleCreateFolderClicked"
              >
                <font-awesome-icon :icon="['fas', 'folder-plus']" />
              </button>
              <button
                class="uk-button uk-button-default uk-button-small"
                @click="handleShowFileUploadClicked"
              >
                <font-awesome-icon :icon="['fas', 'cloud-arrow-up']" />
              </button>
              <button
                class="uk-button uk-button-default uk-button-small"
                :class="{ 'uk-disabled': !exactlyOneChoosen }"
                @click="handleRenameElementClicked"
              >
                <font-awesome-icon :icon="['fas', 'pencil']" />
              </button>
              <button
                class="uk-button uk-button-danger uk-button-small"
                :class="{ 'uk-disabled': !anyChoosen }"
                @click="handleDeleteClicked"
              >
                <font-awesome-icon :icon="['fas', 'trash']" />
              </button>
            </div>
            <div class="uk-button-group">
              <button class="uk-button uk-button-default uk-button-small">
                <font-awesome-icon :icon="['fas', 'table-list']" />
              </button>
              <button class="uk-button uk-button-default uk-button-small">
                <font-awesome-icon :icon="['fas', 'table-cells']" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="uk-flex uk-grid-match">
      <div class="uk-width-medium">
        <div id="media-tree-container" class="folder-list">
          <ul class="media-tree-root">
            <li class="media-tree-item media-tree-root-item">
              <a
                :data-fullPath="baseDir"
                class="tree-link"
                @click="handleRootFolderSelected"
              >
                <font-awesome-icon :icon="['fas', 'home']" />
                Home
              </a>

              <ul class="media-tree">
                <li
                  class="media-tree-item"
                  v-for="(folder, index) in folderTree"
                  :key="index"
                >
                  <FileManagerDirectoryItem
                    :folder="folder"
                    @subFolderSelected="handleFolderSelected"
                  />
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
      <div class="uk-width-expand">
        <div class="folder-breadcrumbs">
          <div class="uk-flex">
            <div
              v-for="(item, index) of breadcrumbs"
              :key="index"
              class="breadcrumb-item"
            >
              <div class="uk-text-truncate">{{ item.name }}</div>
              <a
                :data-fullpath="item.fullPath"
                @click="triggerFolderSelect(item.fullPath)"
                :uk-tooltip="item.hint"
                class="uk-position-cover"
              ></a>
            </div>
          </div>
        </div>
        <div class="folder-content">
          <div class="uk-grid-small uk-child-width-1-6 uk-text-center" uk-grid>
            <div v-for="(folder, index) of subFolders" :key="index">
              <div
                class="uk-position-relative uk-card uk-card-default uk-card-small uk-card-body"
                :class="{ choosen: folder.choosen }"
              >
                <div class="uk-card-media">
                  <font-awesome-icon
                    :icon="['fas', 'folder']"
                    style="font-size: 50px"
                  />
                </div>
                <div
                  class="uk-text-center uk-margin-small-top uk-text-small uk-text-truncate"
                >
                  {{ folder.name }}
                </div>
                <a
                  href="#"
                  :data-fullpath="folder.fullPath"
                  uk-cover
                  @click="handleItemChoosen(folder, $event)"
                  @dblclick.exact="triggerFolderSelect(folder.fullPath)"
                ></a>
                <div class="item-checkbox">
                  <input
                    type="checkbox"
                    class="uk-checkbox"
                    name="checked"
                    :checked="folder.choosen"
                    @click="handleItemChoosen(folder, $event, true)"
                  />
                </div>
              </div>
            </div>
            <div
              v-for="(file, index) in files"
              :key="index"
              :uk-tooltip="file.name"
            >
              <div
                class="file-media uk-position-relative uk-card uk-card-default uk-card-small uk-card-body"
                :class="{ choosen: file.choosen }"
              >
                <div class="uk-card-media" style="min-height: 50px">
                  <img
                    v-if="checkIsImage(file)"
                    :src="buildUrl(file)"
                    alt=""
                    width="50"
                  />
                  <font-awesome-icon
                    v-else
                    :icon="['fas', 'file']"
                    style="font-size: 50px"
                  />
                </div>
                <div
                  class="uk-text-center uk-margin-small-top uk-text-small uk-text-truncate"
                >
                  {{ file.name }}
                </div>
                <div
                  :href="buildUrl(file)"
                  uk-cover
                  @click="handleItemChoosen(file, $event)"
                  @dblclick="handleShowLightbox($event)"
                ></div>
                <div class="item-checkbox">
                  <input
                    type="checkbox"
                    class="uk-checkbox"
                    name="checked"
                    :checked="file.choosen"
                    @click="handleItemChoosen(file, $event, true)"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div id="upload-modal" uk-modal>
    <div class="uk-modal-dialog">
      <div class="uk-modal-header">
        <h2 class="uk-modal-title">File Upload</h2>
      </div>
      <div class="uk-modal-body">
        <span v-if="currentFolder"
          >Upload files to
          <span class="modal-folder-path">{{
            currentFolder.fullPath === "." ? "root" : currentFolder.fullPath
          }}</span></span
        >
        <div class="uk-margin">
          <input type="file" id="file-upload" multiple />
        </div>
      </div>
      <div class="uk-modal-footer">
        <div class="uk-flex uk-flex-right">
          <button
            class="uk-button uk-button-small uk-button-secondary uk-modal-close"
          >
            Cancel
          </button>
          <button
            class="uk-margin-small-left uk-button uk-button-small uk-button-primary"
            @click="handleFileUploadClicked"
          >
            Upload
          </button>
        </div>
      </div>
      <button class="uk-modal-close-default" uk-close type="button"></button>
    </div>
  </div>
</template>

<script>
import FileManagerDirectoryItem from "@/components/FileManagerDirectoryItem.vue";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { useToast } from "vue-toastification";
import UIkit from "uikit";
import axios from "axios";

const toast = useToast();
const regex = /^[a-z]+[a-z|\d \-_.]*$/i;

export default {
  name: "FileManager",
  components: {
    FontAwesomeIcon,
    FileManagerDirectoryItem,
  },
  emits: ["file-selected"],
  props: {
    updateTriggerCounter: {
      type: Number,
      default: 0,
    },
    baseDir: {
      type: String,
      default: "/",
    },
    allowedExtensions: {
      type: Array,
      default: () => ["jpg", "jpeg", "png", "gif"],
    },
  },
  watch: {
    updateTriggerCounter() {
      this.allSelected = false;
      this.anyChoosen = false;
      this.selectedFile = null;
      this.files.forEach((file) => {
        file.choosen = false;
      });
    },
  },
  data() {
    return {
      allSelected: false,
      displayMode: "grid",
      anyChoosen: false,
      exactlyOneChoosen: false,
      currentFolder: null,
      folderTree: [],
      subFolders: [],
      files: [],
      breadcrumbs: [],
      folderSelectCounter: 0,
      rootFolder: {
        fullPath: this.baseDir,
        name: "root",
      },
      selectedFile: null,
    };
  },
  mounted() {
    this.getFolderContents(this.baseDir);
    this.currentFolder = this.rootFolder;
    this.breadcrumbs = this.buildBreadcrumbs();
  },
  methods: {
    getFolderContents(fullPath) {
      axios
        .get("/api/filemanager", {
          params: {
            path: fullPath,
          },
        })
        .then((response) => {
          this.files = response.data.files;
          this.subFolders = response.data.folders;
          this.updateFolderTree(fullPath, response.data.folders);
        })
        .catch((error) => {
          console.log(error);
        });
    },

    updateFolderTree(fullPath, folders) {
      if (!this.folderTree.length || fullPath === this.rootFolder.fullPath) {
        this.folderTree = folders;
      } else {
        this.updateSubFolderTree(fullPath, folders);
        this.closeFolders(fullPath, this.folderTree);
      }
    },

    closeFolders(pathToBeOpen, folderElements) {
      if (!folderElements) return;
      for (let folder of folderElements) {
        if (!pathToBeOpen.includes(folder.fullPath)) {
          folder.selected = false;
          folder.subFolders = [];
        } else {
          folder.selected = true;
          this.closeFolders(pathToBeOpen, folder.subFolders);
        }
      }
    },

    updateSubFolderTree(
      fullPath,
      arrayOfFolders,
      parentFolders = this.folderTree
    ) {
      for (let parentFolder of parentFolders) {
        if (fullPath.includes(parentFolder.fullPath)) {
          // Parent folder found
          if (fullPath === parentFolder.fullPath) {
            // Found direct parent
            parentFolder.subFolders = arrayOfFolders || [];
          } else {
            this.updateSubFolderTree(
              fullPath,
              arrayOfFolders,
              parentFolder.subFolders
            );
          }
        } else {
          parentFolder.selected = false;
          parentFolder.subFolders = [];
        }
      }
    },

    toggleSelectAll() {
      if (this.allSelected) {
        this.handleDeSelectAll();
      } else {
        this.handleSelectAll();
      }
    },
    handleSelectAll() {
      this.subFolders.forEach((folder) => (folder.choosen = true));
      this.files.forEach((file) => (file.choosen = true));
      this.anyChoosen = true;
      this.exactlyOneChoosen = false;
      this.allSelected = true;
    },
    handleDeSelectAll() {
      this.subFolders.forEach((folder) => (folder.choosen = false));
      this.files.forEach((file) => (file.choosen = false));
      this.anyChoosen = false;
      this.exactlyOneChoosen = false;
      this.allSelected = false;
    },

    handleShowLightbox(e) {
      const img = e.target.closest(".file-media").querySelector("img");
      if (!img) return;
      UIkit.lightboxPanel({
        items: [
          {
            source: img.getAttribute("src"),
          },
        ],
      }).show();
    },
    checkIsImage(file) {
      return (
        file.data.mimeType.startsWith("image") &&
        ["jpg", "jpeg", "png", "gif", "svg"].includes(
          file.data.type.toLowerCase()
        )
      );
    },
    handleDeleteClicked() {
      const checkedFolders = this.subFolders.filter((folder) => folder.choosen);
      const checkedFiles = this.files.filter((file) => file.choosen);

      axios
        .delete("/api/filemanager", {
          data: {
            folders: checkedFolders,
            files: checkedFiles,
          },
        })
        .then((response) => {
          console.log(response);
        })
        .catch((error) => {
          toast.error(error.response.data.message);
        })
        .finally(() => {
          this.triggerFolderSelect(this.currentFolder.fullPath);
          this.anyChoosen = false;
          this.allSelected = false;
          this.files.map((file) => (file.choosen = false));
          this.subFolders.map((folder) => (folder.choosen = false));
        });
    },
    handleItemChoosen(item, e, fromCheckBox = false) {
      if (!fromCheckBox) e.preventDefault();
      if (e.detail === 1) {
        this.$nextTick(() => {
          item.choosen = !item.choosen;
          const selectedFolders = this.subFolders.filter(
            (folder) => folder.choosen
          );
          const selectedFiles = this.files.filter((file) => file.choosen);
          this.anyChoosen = selectedFolders.length || selectedFiles.length;
          this.exactlyOneChoosen =
            selectedFolders.length + selectedFiles.length === 1;
          if (selectedFiles.length === 1) {
            this.$emit("file-selected", selectedFiles[0]);
          } else {
            this.$emit("file-selected", null);
          }
        });
      }
    },

    triggerFolderSelect(fullPath) {
      const mediaTreeContainer = document.getElementById(
        "media-tree-container"
      );
      const element = mediaTreeContainer.querySelector(
        `[data-fullpath="${fullPath}"]`
      );
      if (element) {
        element.click();
      }
    },
    handleShowFileUploadClicked() {
      const uploadModal = document.getElementById("upload-modal");
      UIkit.modal(uploadModal, { stack: true }).show();
    },
    handleFileUploadClicked() {
      const uploadModal = document.getElementById("upload-modal");
      const fileUpload = document.getElementById("file-upload");
      const formData = new FormData();
      for (let i = 0; i < fileUpload.files.length; i++) {
        formData.append("files", fileUpload.files[i]);
      }
      formData.append("relativePath", this.currentFolder.fullPath);
      axios
        .post("/api/filemanager/upload", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((response) => {
          console.log(response);
          fileUpload.value = "";
          this.triggerFolderSelect(this.currentFolder.fullPath);
        })
        .catch((error) => {
          console.log(error);
        })
        .finally(() => {
          UIkit.modal(uploadModal).hide();
        });
    },
    async handleCreateFolderClicked() {
      const parentFolder = this.currentFolder.fullPath;
      if (!parentFolder) {
        alert("Please select a folder");
        return;
      }

      const newFolderName = await UIkit.modal
        .prompt("New Folder Name:", "", {
          stack: true,
        })
        .then((value) => value);

      if (!regex.test(newFolderName)) {
        toast.error(
          "Invalid Folder Name\nFolder not created\nFolder name has to be Alphanumeric and can contain spaces, dashes, underscores & dots"
        );
        return;
      }

      if (newFolderName) {
        axios
          .post("/api/filemanager/create-folder", {
            newFolderName,
            parentFolder,
          })
          .then((response) => {
            console.log(response);
          })
          .catch((error) => {
            console.error(error);
          })
          .finally(() => {
            console.log("finally called");
            this.triggerFolderSelect(this.currentFolder.fullPath);
          });
      }
    },
    buildUrl(file) {
      return `/public/${file.relativePath}/${file.name}`;
    },
    buildBreadcrumbs(limit = 5) {
      let breadcrumbs = [];
      let bcPath = this.currentFolder.fullPath.replace(this.baseDir, "");
      let folders = bcPath?.split("/");

      breadcrumbs.push({
        name: "Home",
        hint: "Home",
        fullPath: this.baseDir,
      });

      if (folders) {
        folders.forEach((folder, index) => {
          if (folder === "") return;
          const fullPath = `${this.baseDir}/${folders
            .slice(0, index + 1)
            .join("/")}`;
          breadcrumbs.push({
            name: folder,
            hint: folder,
            fullPath,
          });
        });
      }

      if (breadcrumbs.length > limit) {
        const itemToReAdd = breadcrumbs[breadcrumbs.length - limit - 1];
        itemToReAdd.name = "...";
        breadcrumbs = breadcrumbs.slice(breadcrumbs.length - limit);
        breadcrumbs.unshift(itemToReAdd);
      }
      return breadcrumbs;
    },
    handleRootFolderSelected() {
      this.$emit("file-selected", null);
      this.anyChoosen = false;
      this.allSelected = false;
      this.currentFolder = this.rootFolder;
      this.breadcrumbs = this.buildBreadcrumbs();
      this.folderTree.map((folder) => {
        folder.selected = false;
        folder.subFolders = [];
      });
      this.getFolderContents(this.baseDir);
    },
    handleFolderSelected(folder) {
      console.log("folder selected", folder);
      this.$emit("file-selected", null);
      this.anyChoosen = false;
      this.allSelected = false;
      this.currentFolder = folder;
      this.breadcrumbs = this.buildBreadcrumbs();
      this.folderTree.forEach((folderTreeItem) => {
        if (!folder.fullPath.includes(folderTreeItem.fullPath)) {
          folderTreeItem.selected = false;
          folderTreeItem.subFolders = [];
        }
      });
      folder.selected = true;
      this.getFolderContents(folder.fullPath);
    },
    async handleRenameElementClicked() {
      const element =
        this.files.filter((file) => file.choosen)[0] ||
        this.subFolders.filter((folder) => folder.choosen)[0];
      const newName = await UIkit.modal
        .prompt("New Name:", element.name, {
          stack: true,
        })
        .then((value) => value);

      if (!regex.test(newName)) {
        toast.error(
          "Invalid Name\nElement not renamed\nElement name has to be Alphanumeric and can contain spaces, dashes, underscores & dots"
        );
        return;
      }

      if (newName) {
        axios
          .put("/api/filemanager/rename", {
            oldName: element.name,
            newName: newName,
            parentDir: element.relativePath,
          })
          .then((response) => {
            console.log(response);
            this.triggerFolderSelect(this.currentFolder.fullPath);
          })
          .catch((error) => {
            console.error(error);
          });
      }
    },
  },
};
</script>

<style lang="less">
@import "@/assets/less/variables.less";

.file-manager-container {
  background-color: #f5f5f5;
}

.uk-modal {
  .modal-folder-path {
    font-size: 0.9em;
    font-family: Consolas, monaco, monospace;
  }
}

.file-manager {
  background-color: #fff;
  border-radius: 0;
  border: 1px solid @color-grey-light;

  .uk-card {
    cursor: pointer;
  }

  .uk-card-media {
    color: @color-grey-lighter;
  }

  .uk-card:hover {
    background-color: @color-horizon !important;

    .uk-card-media > * {
      color: @color-primary;
    }
  }

  .file-manager-logo {
    padding: 5px;
    font-size: 2em;
    font-weight: 200;
  }

  .folder-list {
    background-color: #f5f5f5;
    padding: 20px;
    border-right: 1px solid @color-grey-light;
  }

  .folder-content {
    background-color: #fff;
    border-radius: 0;
    padding: 20px;
    height: 70vh;
  }

  .folder-controls {
    border-bottom: 1px solid @color-grey-light;
    overflow: hidden;
    border-top-right-radius: @nxd-border-radius;
    border-top-left-radius: @nxd-border-radius;

    > .uk-flex {
      > div {
        border-right: 1px solid @color-grey-light;
        padding: 0;

        &:last-child {
          border-right: 0;
        }
      }

      .uk-button-group {
        button {
          min-width: 0;
          border-right: 1px solid @color-grey-lighter;

          &:first-child {
            border-left: 0;
            border-top-left-radius: @nxd-border-radius;
            border-bottom-left-radius: @nxd-border-radius;
          }

          &:last-child {
            border-right: 0;
            border-top-right-radius: @nxd-border-radius;
            border-bottom-right-radius: @nxd-border-radius;
          }

          &:hover {
            background-color: @color-primary;
            color: @color-white;
          }
        }

        overflow: hidden;
      }
    }
  }
}

#media-tree-container {
  max-height: calc(70vh + 34px);
  overflow-y: scroll;
}

.media-tree-root {
  margin: 0;
  padding: 0;
  list-style: none;

  * {
    margin: 0;
    padding: 0;
    font-size: 16px;
  }

  .tree-link {
    cursor: pointer;
  }
}

ul.media-tree {
  list-style: none;
  margin: 0;
  padding: 0;

  li.media-tree-item {
    position: relative;
    margin: 0 20px;
    padding: 0;

    .folder-name {
      display: inline-block;
      margin-left: 4px;
    }

    &:before {
      content: "";
      position: absolute;
      background: @color-grey-lighter;
      height: 1px;
      width: 10px;
      left: -13px;
      top: 10px;
    }

    &:after {
      content: "";
      position: absolute;
      background: @color-grey-lighter;
      width: 1px;
      height: 100%;
      left: -13px;
      top: 0;
    }

    &:last-of-type:after {
      height: 10px;
    }
  }
}

.item-checkbox {
  position: absolute;
  left: 2px;
  top: 0;
  opacity: 0;
  cursor: pointer;
}

.uk-card {
  &.choosen {
    background-color: @color-cloud !important;

    .uk-card-media > * {
      color: @color-primary;
    }

    .item-checkbox {
      opacity: 1;
    }
  }

  &:hover {
    .item-checkbox {
      opacity: 1;
    }
  }
}

.folder-breadcrumbs {
  background: @color-cloud;
  padding: 1px;
  max-height: 34px;
  border-bottom: 1px solid @color-grey-light;
  overflow: hidden;

  .breadcrumb-item {
    cursor: pointer;
    padding: 5px 10px 5px 15px;
    background-color: @color-grey-light;
    margin-right: 5px;
    position: relative;

    &:hover {
      background-color: @color-cloud;

      &:after {
        background: @color-cloud;
      }
    }

    &:last-of-type {
      background-color: @color-horizon;

      &:after {
        background: @color-horizon;
      }
    }

    &:before {
      content: "";
      clip-path: polygon(0% 0%, 50% 0%, 100% 50%, 50% 100%, 0% 100%);
      position: absolute;
      background-color: @color-grey-lighter;
      right: -6px;
      top: 0;
      width: 10px;
      height: 100%;
      bottom: 0;
      z-index: 2;
    }

    &:after {
      content: "";
      clip-path: polygon(0% 0%, 50% 0%, 100% 50%, 50% 100%, 0% 100%);
      position: absolute;
      background-color: @color-grey-light;
      right: -5px;
      top: 0;
      width: 10px;
      height: 100%;
      bottom: 0;
      z-index: 2;
    }

    &:not(:first-of-type) {
      margin-left: -6px;
    }

    > div {
      max-width: 250px;
    }
  }
}

.folder-controls {
  background: @color-horizon;
}
.actions {
  padding: 4px;
  .uk-button-group {
    &:not(:last-of-type) {
      margin-right: 10px;

      &:after {
        content: "";
        display: inline-block;
        width: 1px;
        top: 4px;
        height: 40px;
        background-color: @color-grey-lighter;
        margin-left: 10px;
      }
    }
    &:not(:first-of-type) {
    }
  }
}
</style>
