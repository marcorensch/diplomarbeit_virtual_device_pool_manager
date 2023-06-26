<template>
  <div :ref="id" class="file-manager">
    <div class="folder-controls">
      <div class="uk-grid-small uk-flex-right@s uk-flex-middle" uk-grid>
        <div class="uk-width-3-4 uk-width-auto@s">
          <div class="uk-padding-small nxd-padding-remove-medium">
            <div class="uk-position-relative">
              <input
                type="text"
                class="uk-input"
                placeholder="Search in Folder"
                v-model="search_folder_contents"
                @keyup="filterFolderView"
              />
              <div
                v-if="search_folder_contents.length > 0"
                class="uk-position-center-right clear-search-icon"
                style="margin-right: 15px"
                @click="clearFilter"
                uk-tooltip="Clear search filter"
              >
                <font-awesome-icon :icon="['fas', 'xmark']" />
              </div>
            </div>
          </div>
        </div>
        <div class="uk-width-1-4 uk-width-auto@s">
          <div class="mobile-actions uk-width-1-1 uk-hidden@m uk-text-right">
            <div
              class="uk-padding-small uk-margin-right"
              uk-toggle="target: #mobile-options"
            >
              <font-awesome-icon
                :icon="['fas', 'bars']"
                class="uk-preserve-width"
              />
            </div>
            <div
              id="mobile-options"
              uk-offcanvas="stack:true; overlay: false; flip: true; bg-close:false"
            >
              <div class="uk-offcanvas-bar uk-flex uk-flex-column">
                <button
                  class="uk-offcanvas-close"
                  type="button"
                  uk-close
                ></button>
                <ul
                  class="uk-nav uk-nav-primary uk-nav-center uk-margin-auto-vertical"
                >
                  <li class="uk-nav-header">Options</li>
                  <li
                    v-if="authStore.hasPermission('canCreateFileManagerItem')"
                  >
                    <a href="#" @click="handleCreateFolderClicked"
                      ><font-awesome-icon :icon="['fas', 'folder-plus']" />
                      Create Folder</a
                    >
                  </li>
                  <li
                    v-if="authStore.hasPermission('canCreateFileManagerItem')"
                  >
                    <a href="#" @click="handleShowFileUploadClicked">
                      <font-awesome-icon :icon="['fas', 'cloud-arrow-up']" />
                      Upload File
                    </a>
                  </li>
                  <li
                    v-if="authStore.hasPermission('canUpdateFileManagerItem')"
                  >
                    <a
                      href="#"
                      :class="{ 'uk-disabled': !exactlyOneChoosen }"
                      @click="handleRenameElementClicked"
                    >
                      <font-awesome-icon :icon="['fas', 'pencil']" /> Rename
                    </a>
                  </li>
                  <li
                    v-if="authStore.hasPermission('canDeleteFileManagerItem')"
                  >
                    <a
                      href="#"
                      :class="{ 'uk-disabled': !anyChoosen }"
                      @click="handleDeleteClicked"
                    >
                      <font-awesome-icon :icon="['fas', 'trash']" /> Delete
                    </a>
                  </li>
                  <li class="uk-nav-header">Layout</li>
                  <li v-if="displayMode === 'grid'">
                    <a
                      href="#"
                      @click="setDisplayMode('table')"
                      :class="{ 'uk-button-primary': displayMode === 'table' }"
                    >
                      <font-awesome-icon :icon="['fas', 'table-list']" />
                      Switch to Table Layout
                    </a>
                  </li>
                  <li v-else>
                    <a
                      href="#"
                      @click="setDisplayMode('grid')"
                      :class="{ 'uk-button-primary': displayMode === 'grid' }"
                    >
                      <font-awesome-icon :icon="['fas', 'table-cells']" />
                      Switch to Grid Layout
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div class="actions uk-visible@m">
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
                v-if="authStore.hasPermission('canCreateFileManagerItem')"
              >
                <font-awesome-icon :icon="['fas', 'folder-plus']" />
              </button>
              <button
                class="uk-button uk-button-default uk-button-small"
                @click="handleShowFileUploadClicked"
                v-if="authStore.hasPermission('canCreateFileManagerItem')"
              >
                <font-awesome-icon :icon="['fas', 'cloud-arrow-up']" />
              </button>
              <button
                class="uk-button uk-button-default uk-button-small"
                :class="{ 'uk-disabled': !exactlyOneChoosen }"
                @click="handleRenameElementClicked"
                v-if="authStore.hasPermission('canUpdateFileManagerItem')"
              >
                <font-awesome-icon :icon="['fas', 'pencil']" />
              </button>
              <button
                class="uk-button uk-button-danger uk-button-small"
                :class="{ 'uk-disabled': !anyChoosen }"
                @click="handleDeleteClicked"
                v-if="authStore.hasPermission('canDeleteFileManagerItem')"
              >
                <font-awesome-icon :icon="['fas', 'trash']" />
              </button>
            </div>
            <div class="uk-button-group">
              <button
                class="uk-button uk-button-default uk-button-small"
                @click="setDisplayMode('table')"
                :class="{ 'uk-button-primary': displayMode === 'table' }"
              >
                <font-awesome-icon :icon="['fas', 'table-list']" />
              </button>
              <button
                class="uk-button uk-button-default uk-button-small"
                @click="setDisplayMode('grid')"
                :class="{ 'uk-button-primary': displayMode === 'grid' }"
              >
                <font-awesome-icon :icon="['fas', 'table-cells']" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="uk-flex uk-grid-match">
      <div class="uk-width-medium uk-visible@m">
        <div :ref="id + '-media-tree-container'" class="folder-list uk-overflow-hidden">
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
                  class="media-tree-item uk-width-1-1 uk-margin-remove-right"
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
          <div
            v-if="displayMode === 'grid'"
            class="uk-grid-small uk-child-width-1-2 uk-child-width-1-3@s uk-child-width-1-4@m uk-child-width-1-6@l uk-text-center"
            uk-grid
          >
            <div
              v-for="(folder, index) of subFolders"
              :key="index"
              :class="{ 'uk-hidden': !folder.visible }"
            >
              <div
                class="uk-position-relative uk-card uk-card-default uk-card-small uk-card-body"
                :class="{ choosen: folder.choosen }"
              >
                <div class="uk-card-media">
                  <font-awesome-icon
                    :icon="['fas', 'folder']"
                    style="font-size: 50px"
                    class="uk-preserve-width"
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
              :class="{ 'uk-hidden': !file.visible }"
            >
              <div
                class="file-media uk-position-relative uk-card uk-card-default uk-card-small uk-card-body"
                :class="{ choosen: file.choosen }"
              >
                <div
                  class="uk-card-media uk-background-contain uk-background-center-center nxd-height-xxsmall"
                  :style="'background-image: url(' + buildUrl(file) + ')'"
                >
                  <font-awesome-icon
                    v-if="!checkIsImage(file)"
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
          <div v-else>
            <table class="uk-table uk-table-divider uk-table-middle">
              <thead>
                <th>
                  <input
                    type="checkbox"
                    class="uk-checkbox"
                    name="checked"
                    :checked="allSelected"
                    @click="toggleSelectAll"
                  />
                </th>
                <th></th>
                <th>Name</th>
              </thead>
              <tbody>
                <tr
                  v-for="(folder, index) of subFolders"
                  :key="index"
                  :class="{ 'uk-hidden': !folder.visible }"
                >
                  <td>
                    <input
                      type="checkbox"
                      class="uk-checkbox"
                      name="checked"
                      :checked="folder.choosen"
                      @click="handleItemChoosen(folder, $event, true)"
                    />
                  </td>
                  <td class="uk-text-center">
                    <font-awesome-icon
                      :icon="['fas', 'folder']"
                      style="font-size: 25px"
                      class="uk-preserve-width"
                    />
                  </td>
                  <td class="uk-width-expand">
                    <a
                      href="#"
                      :data-fullpath="folder.fullPath"
                      @click="triggerFolderSelect(folder.fullPath)"
                      :uk-tooltip="folder.name"
                    >
                      {{ folder.name }}
                    </a>
                  </td>
                </tr>
                <tr
                  v-for="(file, index) in files"
                  :key="index"
                  :class="{ 'uk-hidden': !file.visible }"
                  class="uk-position-relative"
                >
                  <td>
                    <input
                      type="checkbox"
                      class="uk-checkbox"
                      name="checked"
                      :checked="file.choosen"
                      @click="handleItemChoosen(file, $event, true)"
                    />
                  </td>
                  <td class="uk-text-center">
                    <img
                      v-if="checkIsImage(file)"
                      :src="buildUrl(file)"
                      alt=""
                      width="30"
                      class="uk-preserve-width file-media"
                    />
                    <font-awesome-icon
                      v-else
                      :icon="['fas', 'file']"
                      style="font-size: 25px"
                    />
                  </td>
                  <td class="uk-width-expand">
                    <span>
                      {{ file.name }}
                    </span>
                  </td>
                  <div
                    class="uk-position-cover"
                    :uk-tooltip="file.name"
                    :data-fullpath="file.fullPath"
                    @click="handleItemChoosen(file, $event)"
                    @dblclick.exact="handleShowLightbox($event)"
                  ></div>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div :ref="id + '-upload-modal'" uk-modal>
    <div class="uk-modal-dialog">
      <div class="uk-modal-header">
        <h2 class="uk-modal-title">File Upload</h2>
      </div>
      <div class="uk-modal-body">
        <div class="uk-margin">
          <input
            type="file"
            :ref="id + '-file-input'"
            multiple
            :accept="allowedFiletypes"
          />
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
import { useAuthStore } from "@/stores/auth";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { useToast } from "vue-toastification";
import UIkit from "uikit";
import axios from "axios";

const toast = useToast();
const regex = /^[a-z|\d]+[a-z|\d \-_.]*$/i;

export default {
  name: "FileManager",
  setup() {
    const authStore = useAuthStore();
    return {
      authStore,
    };
  },
  components: {
    FontAwesomeIcon,
    FileManagerDirectoryItem,
  },
  emits: ["file-selected"],
  props: {
    id: {
      type: String,
      default: "file-manager",
    },
    updateTriggerCounter: {
      type: Number,
      default: 0,
    },
    baseDir: {
      type: String,
      default: "/",
    },
    allowedFiletypes: {
      type: String,
      default: () => "image/jpeg, image/png, image/gif, image/webp",
    },
  },
  watch: {
    updateTriggerCounter() {
      this.handleDeSelectAll();
    },
  },
  data() {
    return {
      search_folder_contents: "",
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
  computed() {
    return {};
  },
  mounted() {
    this.displayMode = localStorage.getItem("displayMode") || "grid";
    this.getFolderContents(this.baseDir);
    this.currentFolder = this.rootFolder;
    this.breadcrumbs = this.buildBreadcrumbs();
  },
  methods: {
    setDisplayMode(mode) {
      this.displayMode = mode;
      localStorage.setItem("displayMode", mode);
    },
    clearFilter() {
      this.search_folder_contents = "";
      this.filterFolderView();
    },
    filterFolderView() {
      this.subFolders.forEach((folder) => {
        folder.visible = folder.name
          .toLowerCase()
          .includes(this.search_folder_contents.toLowerCase());
      });
      this.files.forEach((file) => {
        file.visible = file.name
          .toLowerCase()
          .includes(this.search_folder_contents.toLowerCase());
      });
    },
    getFolderContents(fullPath) {
      this.clearFilter();
      axios
        .get("/api/filemanager", {
          params: {
            path: fullPath,
          },
        })
        .then((response) => {
          this.files = response.data.files.map((file) => {
            file.choosen = false;
            file.visible = true;
            return file;
          });
          this.subFolders = response.data.folders.map((folder) => {
            folder.chosen = false;
            folder.visible = true;
            return folder;
          });
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
      let img;
      if (this.displayMode === "grid") {
        img = e.target.closest(".file-media")?.querySelector("img");
      } else {
        img = e.target.closest("tr").querySelector("img");
      }
      if (!img) return;
      UIkit.lightboxPanel({
        items: [
          {
            source: img.getAttribute("src"),
            caption: img.getAttribute("alt"),
            maxWidth: "100px",
          },
        ],
      }).show();
    },
    checkIsImage(file) {
      let isImage = false;
      try {
        isImage =
          file.data.mimeType.startsWith("image") &&
          ["jpg", "jpeg", "png", "gif", "svg", "webp"].includes(
            file.data.type.toLowerCase()
          );
      } catch (e) {
        // console.log(e);
      }
      return isImage;
    },
    handleDeleteClicked() {
      const checkedFolders = this.subFolders.filter((folder) => folder.choosen);
      const checkedFiles = this.files.filter((file) => file.choosen);
      this.$emit("file-selected", null);

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
          this.$nextTick(() => {
            this.getFolderContents(this.currentFolder.fullPath);
          });
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
      const mediaTreeContainer = this.$refs[this.id + "-media-tree-container"];
      const element = mediaTreeContainer.querySelector(
        `[data-fullpath="${fullPath}"]`
      );
      if (element) {
        element.click();
      }
    },

    handleShowFileUploadClicked() {
      const uploadModal = this.$refs[this.id + "-upload-modal"];
      UIkit.modal(uploadModal, { stack: true }).show();
    },
    handleFileUploadClicked() {
      const uploadModal = this.$refs[this.id + "-upload-modal"];
      const fileUpload = this.$refs[this.id + "-file-input"];
      const formData = new FormData();
      for (let i = 0; i < fileUpload.files.length; i++) {
        formData.append("files", fileUpload.files[i]);
      }
      axios
        .post(
          `/api/filemanager/upload?path=${this.currentFolder.fullPath}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        )
        .then(() => {
          this.triggerFolderSelect(this.currentFolder.fullPath);
          toast.success("Files uploaded successfully");
        })
        .catch((error) => {
          if (error.response.data.message)
            toast.error(error.response.data.message);
          else toast.error("Something went wrong");
        })
        .finally(() => {
          UIkit.modal(uploadModal).hide();
          fileUpload.value = "";
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
          "Invalid Folder Name\nName has to be Alphanumeric & can contain spaces, dashes, underscores & dots and has to start with a letter or number"
        );
        return;
      }

      if (newFolderName) {
        axios
          .post("/api/filemanager/folders", {
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
          const fullPath = `${this.baseDir}${folders
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
@import "@/assets/less/components/filemanager.less";
</style>
