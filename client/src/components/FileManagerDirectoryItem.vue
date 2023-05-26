<template>
  <div>
    <a
      href="#"
      :class="{ selected: folder.selected }"
      class="uk-display-inline-block uk-text-nowrap uk-width-small"
      @click="emitSubFolderSelected(folder)"
      :data-fullpath="folder.fullPath"
    >
      <font-awesome-icon
        v-if="folder.selected"
        :icon="['fas', 'folder-open']"
        class="uk-preserve-width"
      />
      <font-awesome-icon
        v-else
        :icon="['fas', 'folder']"
        class="uk-preserve-width"
      />
      <div class="folder-name" :uk-tooltip="folder.name">
        <span>{{ folder.name }}</span>
      </div>
    </a>
    <ul class="media-tree media-tree-item uk-width-small">
      <li
        class="media-tree-item media-tree-item uk-width-1-1 uk-margin-remove-right"
        v-for="(subFolder, index) in folder.subFolders"
        :key="index"
      >
        <FileManagerDirectoryItem
          :folder="subFolder"
          @subFolderSelected="emitSubFolderSelected"
        />
      </li>
    </ul>
  </div>
</template>
<script>
export default {
  name: "FileManagerDirectoryItem",
  emits: ["sub-folder-selected", "update-contents"],
  props: {
    folder: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {};
  },
  methods: {
    emitSubFolderSelected(folder) {
      this.$emit("sub-folder-selected", folder);
    },
  },
};
</script>
