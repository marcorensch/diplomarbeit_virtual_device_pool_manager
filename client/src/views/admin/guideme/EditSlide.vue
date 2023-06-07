<template>
  <div
    class="uk-section user-list-view uk-padding-remove"
    v-if="guide && slide"
  >
    <div class="uk-container nxd-no-select">
      <div class="uk-grid-small uk-flex uk-flex-middle" uk-grid>
        <div>
          <router-link
            class="go-back-link"
            :to="{ name: 'admin-guide-slides', params: { id: guide.id } }"
          >
            <font-awesome-icon
              class="uk-h2 uk-preserve-width uk-margin-remove"
              :icon="['fas', 'arrow-left']"
            />
          </router-link>
        </div>
        <div>
          <h2 v-if="guide" class="uk-h3 uk-margin-remove">{{ guide.name }}</h2>
          <h3 class="uk-h2 uk-margin-remove">Edit Slide {{ slide.name }}</h3>
        </div>
      </div>

      <div class="uk-button-group">
        <button
          class="uk-button uk-button-default"
          :class="{ 'uk-button-primary': stageSize === 'small' }"
          @click="handleChangeStageSize('small')"
        >
          33%
        </button>
        <button
          class="uk-button uk-button-default"
          :class="{ 'uk-button-primary': stageSize === 'half' }"
          @click="handleChangeStageSize('half')"
        >
          50%
        </button>
        <button
          class="uk-button uk-button-default"
          :class="{ 'uk-button-primary': stageSize === 'full' }"
          @click="handleChangeStageSize('full')"
        >
          100%
        </button>
      </div>
      <div class="uk-margin">
        <div id="stage-container" class="uk-position-relative">
          <div
            id="stage-inner"
            ref="stageInner"
            class="uk-position-relative"
            :class="[
              { 'uk-width-1-1': stageSize === 'full' },
              { 'uk-width-1-2': stageSize === 'half' },
              { 'uk-width-1-3': stageSize === 'small' },
            ]"
          >
            <img
              :src="'/public' + slide.uri"
              alt=""
              ref="slideImage"
              id="slideImage"
            />
            <div
              class="uk-position-cover"
              style="background: rgba(183, 128, 28, 0.5)"
            >
              <v-stage
                ref="stage"
                :config="configKonva"
                @mousedown="handleStageMouseDown"
                @touchstart="handleStageMouseDown"
              >
                <v-layer ref="layer">
                  <template v-for="item in stageItems" :key="item.id">
                    <v-circle
                      v-if="item.type === 'circle'"
                      :config="item"
                      @transformend="handleTransformEnd"
                      @dragstart="handleDragStart($event, item)"
                      @dragend="handleDragEnd($event, item)"
                    ></v-circle>
                    <v-rect
                      v-if="item.type === 'rectangle'"
                      :config="item"
                      @transformend="handleTransformEnd"
                      @dragstart="handleDragStart($event, item)"
                      @dragend="handleDragEnd($event, item)"
                    ></v-rect>
                  </template>
                  <v-transformer ref="transformer" />
                </v-layer>
              </v-stage>
            </div>
          </div>
          <div class="uk-position-top-right">
            <div
              class="uk-card uk-card-default uk-card-small uk-width-medium uk-box-shadow-large"
              uk-sticky="end: !#stage-container; offset: 80"
            >
              <div
                class="uk-padding-small uk-position-relative nxd-cursor-pointer"
                @click="showControls = !showControls"
              >
                <h4 class="uk-h4 uk-margin-remove-bottom">Controls</h4>
                <div class="uk-position-center-right uk-margin-right">
                  <font-awesome-icon
                    v-if="!showControls"
                    :icon="['fas', 'chevron-down']"
                  />
                  <font-awesome-icon v-else :icon="['fas', 'chevron-up']" />
                </div>
              </div>
              <div id="stage-controls" :class="{ 'uk-hidden': !showControls }">
                <div class="uk-card-body">
                  <ul uk-accordion="multiple: true; active:0">
                    <li>
                      <a class="uk-accordion-title" href="#">Image</a>
                      <div class="uk-accordion-content uk-flex uk-flex-right">
                        <button
                          class="uk-button uk-button-secondary uk-button-small"
                          uk-toggle="target: #filemanager-modal"
                        >
                          {{ slide.uri ? "Change" : "Select" }} Image
                        </button>
                      </div>
                    </li>
                    <li>
                      <a class="uk-accordion-title" href="#">Elements</a>
                      <div class="uk-accordion-content">
                        <div id="sliderVisualElements">
                          <div
                            class="uk-margin-small-top"
                            v-for="(el, index) of stageItems"
                            :key="index"
                          >
                            {{ el.name }}
                          </div>
                        </div>
                        <div class="uk-margin-small-top uk-flex uk-flex-right">
                          <div class="uk-button-group">
                            <button
                              class="uk-button uk-button-small uk-button-secondary"
                              @click="handleAddVisualElementClicked('circle')"
                            >
                              Add Circle
                            </button>
                            <button
                              class="uk-button uk-button-small uk-button-secondary"
                              @click="
                                handleAddVisualElementClicked('rectangle')
                              "
                            >
                              Add Rectangle
                            </button>
                          </div>
                        </div>
                      </div>
                    </li>
                  </ul>
                </div>
                <div class="uk-card-footer">
                  <div class="uk-grid-small uk-flex uk-flex-right" uk-grid>
                    <div>
                      <button
                        class="uk-button uk-button-secondary uk-button-small"
                        style="min-width: 100px"
                        @click="
                          this.$router.push({
                            name: 'admin-guide-slides',
                            params: { id: guide.id },
                          })
                        "
                      >
                        Cancel
                      </button>
                    </div>
                    <div>
                      <button
                        class="uk-button uk-button-primary uk-button-small"
                        style="min-width: 100px"
                        @click="saveSlide"
                      >
                        Save
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div id="filemanager-modal" class="uk-flex-top uk-modal-container" uk-modal>
      <div class="uk-modal-dialog uk-margin-auto-vertical">
        <button class="uk-modal-close-default" uk-close type="button"></button>
        <div class="uk-modal-header">
          <h2 class="uk-modal-title">Select Image</h2>
        </div>
        <div class="uk-modal-body uk-padding-remove">
          <FileManager
            :updateTriggerCounter="updateTriggerCounter"
            :base-dir="'/guides'"
            @file-selected="handleFileSelected"
          />
        </div>
        <div class="uk-modal-footer">
          <div class="uk-grid-small uk-flex uk-flex-right" uk-grid>
            <div>
              <button class="uk-button uk-button-secondary uk-modal-close">
                Cancel
              </button>
            </div>
            <div>
              <button
                class="uk-button uk-button-primary uk-modal-close"
                :class="{ 'uk-disabled': !fm_file }"
                @click="handleImageSelected"
              >
                Select
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { useToast } from "vue-toastification";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import FileManager from "@/components/FileManager.vue";
import Konva from "konva";
import { v4 as uuidv4 } from "uuid";

export default {
  name: "EditSlide",
  components: { FileManager, FontAwesomeIcon },
  setup() {
    const toast = useToast();
    return { toast };
  },
  data() {
    return {
      stageSize: "full",
      selectedShapeName: "",
      stageItems: [],
      configKonva: {
        width: 900,
        height: 900,
        fill: "rgba(131,35,35,0.5)",
      },
      guide: null,
      slide: null,
      showControls: true,
      updateTriggerCounter: 0,
      fm_file: null,
      isDragging: false,
    };
  },
  mounted() {
    if (!this.$route.params.id) {
      this.toast.error("Invalid Slide ID");
      this.$router.push({ name: "guides" });
    }
    if (!this.$route.query.gid) {
      this.toast.error("Invalid Guide ID");
      this.$router.push({ name: "guides" });
    }
    this.getGuide();
    this.getSlide();
    this.load();
  },
  methods: {
    handleImageSelected() {
      this.slide.uri = this.fm_file.fullPath;
    },
    handleFileSelected(file) {
      this.fm_file = file;
    },
    handleAddVisualElementClicked(type) {
      console.log("Add Visual Element Clicked " + type);
      const name = uuidv4().replace(/-/g, "");
      const label = `${type.charAt(0).toUpperCase() + type.slice(1)} ${
        this.stageItems.length + 1
      }`;
      const config = {
        type,
        name,
        label,
        fill: Konva.Util.getRandomColor(),
        x: 100,
        y: 100,
        draggable: true,
      };
      if (type === "rectangle") {
        config.width = 100;
        config.height = 100;
        config.cornerRadius = 6;
      }
      if (type === "circle") {
        config.radius = 50;
      }
      this.stageItems.push(config);
    },
    handleSelectImageClicked() {
      console.log("Select Image Clicked");
    },
    async getGuide() {
      try {
        const result = await axios.get(
          `/api/admin/guides/${this.$route.query.gid}`
        );
        this.guide = result.data.guide;
        console.log(this.guide);
      } catch (err) {
        console.log(err);
      }
    },
    async getSlide() {
      try {
        const result = await axios.get(
          `/api/admin/guides/${this.$route.query.gid}/slides/${this.$route.params.id}`
        );
        this.slide = result.data.slide;
        console.log(this.slide);
      } catch (err) {
        console.log(err);
      }
    },
    load() {
      const data = localStorage.getItem("storage");
      if (data) this.stageItems = JSON.parse(data);
      console.log(this.stageItems);
    },
    async saveSlide() {
      localStorage.setItem("storage", JSON.stringify(this.stageItems));
      // try {
      //   await axios.put(
      //     `/api/admin/guides/${this.$route.query.gid}/slides/${this.$route.params.id}`,
      //     this.slide
      //   );
      //   this.$router.push({
      //     name: "admin-guide-slides",
      //     params: { id: this.$route.query.gid },
      //   });
      // } catch (err) {
      //   console.log(err);
      // }
    },
    // Transformer
    handleTransformEnd(e) {
      console.log("handleTransformEnd");
      // shape is transformed, let us save new attrs back to the node
      // find element in our state
      const si = this.stageItems.find(
        (item) => item.name === this.selectedShapeName
      );

      const newScaleX = e.target.scaleX();
      const newScaleY = e.target.scaleY();
      e.target.scaleX(1);
      e.target.scaleY(1);
      const newWidth = Math.floor(e.target.width() * newScaleX);
      const newHeight = Math.floor(e.target.height() * newScaleY);

      // update the state
      si.x = e.target.x();
      si.y = e.target.y();
      si.rotation = e.target.rotation();
      si.scaleX = 1;
      si.scaleY = 1;
      si.width = newWidth;
      si.height = newHeight;
      si.cornerRadius = 10;
      si.percentages = this.calculatePercentages(si);

      // change fill
      si.fill = Konva.Util.getRandomColor();
    },
    handleStageMouseDown(e) {
      // clicked on stage - clear selection
      if (e.target === e.target.getStage()) {
        this.selectedShapeName = "";
        this.updateTransformer();
        return;
      }

      // clicked on transformer - do nothing
      const clickedOnTransformer =
        e.target.getParent().className === "Transformer";
      if (clickedOnTransformer) {
        return;
      }

      // find clicked rect by its name
      const name = e.target.name();
      const rect = this.stageItems.find((r) => r.name === name);
      if (rect) {
        this.selectedShapeName = name;
      } else {
        this.selectedShapeName = "";
      }
      this.updateTransformer();
    },
    updateTransformer() {
      // here we need to manually attach or detach Transformer node
      const transformerNode = this.$refs.transformer.getNode();
      const stage = transformerNode.getStage();
      const { selectedShapeName } = this;

      const selectedNode = stage.findOne("." + selectedShapeName);
      // do nothing if selected node is already attached
      if (selectedNode === transformerNode.node()) {
        return;
      }

      if (selectedNode) {
        // attach to another node
        transformerNode.nodes([selectedNode]);
      } else {
        // remove transformer
        transformerNode.nodes([]);
      }
    },
    handleDragStart(e, item) {},
    handleDragEnd(e, item) {
      // find item
      const si = this.stageItems.find((si) => si.name === item.name);
      si.x = e.target.x();
      si.y = e.target.y();
    },
    handleChangeStageSize(keyword) {
      this.stageSize = keyword; // Set keyword to trigger change in GUI
      this.$nextTick(() => {
        // Wait for DOM update and get new size
        const imageDom = document.getElementById("slideImage");
        this.configKonva.width = imageDom.offsetWidth;
        this.configKonva.height = imageDom.offsetHeight;
      });
    },
    calculatePercentages(stageItem) {
      if (!stageItem) {
        this.toast.error("Error calculating percentages");
        return;
      }
      return {
        x: (stageItem.x / this.configKonva.width) * 100,
        y: (stageItem.y / this.configKonva.height) * 100,
        width: (stageItem.width / this.configKonva.width) * 100,
        height: (stageItem.height / this.configKonva.height) * 100,
      };
    },
  },
};
</script>

<style lang="less" scoped>
img {
  width: 100%;
}
</style>
