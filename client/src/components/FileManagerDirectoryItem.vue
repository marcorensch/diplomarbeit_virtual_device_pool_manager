<template>
  <div>
    <a
      href="#"
      :class="{ selected: folder.selected }"
      @click="emitSubFolderSelected(folder)"
      :data-fullpath="folder.fullPath"
    >
      <font-awesome-icon
        v-if="folder.selected"
        :icon="['fas', 'folder-open']"
      />
      <font-awesome-icon v-else :icon="['fas', 'folder']" />
      <div class="folder-name" :uk-tooltip="folder.name">
        {{ folder.name }}
      </div>
    </a>
    <ul class="media-tree">
      <li
        class="media-tree-item"
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
