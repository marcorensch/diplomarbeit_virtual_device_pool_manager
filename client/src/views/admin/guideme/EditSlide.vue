<template>
  <div
      class="uk-section user-list-view uk-padding-remove uk-position-relative"
      v-if="guide && slide"
  >
    <div class="uk-container nxd-no-select">
      <div class="uk-grid-small uk-flex uk-flex-middle" uk-grid>
        <div>
          <router-link class="go-back-link" :to="{ name: 'admin-guide-slides', params: { id: guide.id } }">
            <font-awesome-icon class="uk-h2 uk-preserve-width uk-margin-remove" :icon="['fas', 'arrow-left']" />
          </router-link>
        </div>
        <div>
          <h2 v-if="guide" class="uk-h3 uk-margin-remove">{{ guide.name }}</h2>
          <h3 class="uk-h2 uk-margin-remove">Edit Slide "{{ slide.name }}"</h3>
        </div>
      </div>

      <NotAvailableMobile :message="'GuideMe Stage Editor is not available<br />on Small Screen Devices'" />
      <div class="uk-margin uk-visible@m">
        <div id="stage-container" ref="stageContainer" class="uk-position-relative uk-padding uk-background-muted uk-border-rounded nxd-min-height-large">
          <div id="controls-container" class="uk-position-top-right">
            <div class="uk-card uk-card-default uk-card-small uk-width-medium uk-box-shadow-large" uk-sticky="end: !#stage-container; offset: 80">
              <div class="uk-padding-small uk-position-relative nxd-cursor-pointer" @click="showControls = !showControls">
                <h4 class="uk-h4 uk-margin-remove-bottom">Controls</h4>
                <div class="uk-position-center-right uk-margin-right">
                  <font-awesome-icon v-if="!showControls" :icon="['fas', 'chevron-down']" />
                  <font-awesome-icon v-else :icon="['fas', 'chevron-up']" />
                </div>
              </div>
              <div id="stage-controls" :class="{ 'uk-hidden': !showControls }">
                <div class="uk-card-body">
                  <div class="uk-margin-small-top">
                    <h5>Stage</h5>
                    <div class="uk-flex uk-flex-center">
                      <div class="uk-button-group">
                        <button class="uk-button uk-button-default uk-button-small"
                                :class="{'uk-button-primary': stageSize === '1-4',}"
                                @click="handleChangeStageSize('1-4')"
                        >
                          25%
                        </button>
                        <button class="uk-button uk-button-default uk-button-small"
                                :class="{'uk-button-primary': stageSize === '1-3'}"
                                @click="handleChangeStageSize('1-3')">
                          33%
                        </button>
                        <button
                            class="uk-button uk-button-default uk-button-small"
                            :class="{
                              'uk-button-primary': stageSize === '1-2',
                            }"
                            @click="handleChangeStageSize('1-2')"
                        >
                          50%
                        </button>
                        <button
                            class="uk-button uk-button-default uk-button-small"
                            :class="{
                              'uk-button-primary': stageSize === '3-4',
                            }"
                            @click="handleChangeStageSize('3-4')"
                        >
                          75%
                        </button>
                        <button
                            class="uk-button uk-button-default uk-button-small"
                            :class="{
                              'uk-button-primary': stageSize === '1-1',
                            }"
                            @click="handleChangeStageSize('1-1')"
                        >
                          100%
                        </button>
                      </div>
                    </div>
                  </div>
                  <div class="uk-margin-small-top">
                    <h5>Label</h5>
                    <input type="text" class="uk-input uk-width-1-1" id="slide-name-input" v-model="slide.name">
                  </div>
                  <div class="uk-margin-small-top">
                    <h5>Image</h5>
                    <button
                        class="uk-button uk-button-secondary uk-button-small uk-width-1-1"
                        uk-toggle="target: #filemanager-modal">
                      {{ slide.uri ? "Change" : "Select" }} Image
                    </button>
                  </div>
                  <div class="uk-margin-top">
                    <h5>Shapes</h5>
                    <button
                        class="uk-button uk-button-small uk-button-secondary uk-width-1-1"
                        :class="{'uk-disabled': !slide.uri}"
                        @click="handleAddVisualElementClicked('circle')">
                      Add Circle
                    </button>
                    <button
                        class="uk-button uk-button-small uk-button-secondary uk-width-1-1 uk-margin-small-top"
                        :class="{'uk-disabled': !slide.uri}"
                        @click="handleAddVisualElementClicked('rectangle')">
                      Add Rectangle
                    </button>
                    <div class="uk-margin-small-top">
                      <table class="uk-table uk-table-divider uk-table-small uk-table-middle">
                        <tr v-for="shape of stageItems" :key="shape.name">
                          <td @click="handleSelectStageItemFromCtrls(shape)" class="nxd-cursor-pointer uk-width-5-6 uk-text-truncate">{{shape.label}}</td>
                          <td @click="handleDeleteStageItemFromCtrls(shape)"><font-awesome-icon class="nxd-cursor-pointer uk-text-danger uk-preserve-width" :icon="['fas','close']" /></td>
                        </tr>
                      </table>
                    </div>
                    <div v-if="selectedShape" class="uk-margin-top">
                      <div id="shape-edit-container" class="uk-border-rounded uk-padding-small">
                        <div id="shape-edit-title">
                          <span><font-awesome-icon class="uk-preserve-width" :icon="['fas','cog']"/> Shape</span>
                        </div>
                        <div><input class="uk-input" v-model="selectedShape.label" placeholder="Shape Label" /></div>
                        <div class="uk-margin-small-top">
                          <textarea class="uk-textarea" v-model="selectedShape.description"
                                    placeholder="Describe Step Procedures here"></textarea>
                        </div>
                        <div class="uk-margin-small-top">
                          <span>Fill: </span>
                          <div class="color-picker-preview-container uk-float-right">
                            <color-picker v-model:pureColor="selectedShape.fill"/>
                          </div>
                        </div>
                        <div class="uk-margin-small-top">
                          <span>Stroke: </span>
                          <div class="color-picker-preview-container uk-float-right">
                            <color-picker v-model:pureColor="selectedShape.stroke"/>
                          </div>
                        </div>
                        <div class="uk-margin-small-top">
                          <div class="uk-width-1-1 uk-flex uk-flex-middle uk-child-width-1-2">
                            <div><span>Stroke Width: </span></div>
                            <div class="uk-flex uk-flex-right">
                              <input type="number" min="0" class="stroke-width-input"
                                     v-model="selectedShape.strokeWidth" @change="handleStrokeWidthChanged"/>
                            </div>
                          </div>
                        </div>

                      </div>
                    </div>
                  </div>
                </div>
                <div class="uk-card-footer">
                  <div class="uk-grid-small uk-flex uk-flex-right" uk-grid>
                    <div>
                      <button
                          class="uk-button uk-button-secondary uk-button-small"
                          style="min-width: 50px"
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
                          style="min-width: 50px"
                          @click="saveSlide(false)"
                      >
                        Save
                      </button>
                    </div>
                    <div>
                      <button
                          class="uk-button uk-button-success uk-button-small"
                          style="min-width: 50px"
                          @click="saveSlide(true)"
                      >
                        Save & Close
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div id="stage-inner" ref="stageInner"
               class="uk-position-relative uk-margin-auto uk-border-rounded uk-overflow-hidden"
               :class="[
                { 'uk-width-1-1': stageSize === '1-1' },
                { 'uk-width-3-4': stageSize === '3-4' },
                { 'uk-width-1-2': stageSize === '1-2' },
                { 'uk-width-1-3': stageSize === '1-3' },
                { 'uk-width-1-4': stageSize === '1-4' },
                { 'uk-box-shadow-large' : slide.uri.length > 0 }
              ]"
          >
            <img :src="'/public' + slide.uri" alt="" ref="image" @load="handleImageLoadedEvent"/>
            <div
                class="uk-position-cover"
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
                  <v-transformer ref="transformer"/>
                </v-layer>
              </v-stage>
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
import UIkit from "uikit";
import axios from "axios";
import {useToast} from "vue-toastification";
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";
import FileManager from "@/components/FileManager.vue";
import Konva from "konva";
import {v4 as uuidv4} from "uuid";
import {ColorPicker} from "vue3-colorpicker";
import NotAvailableMobile from "@/components/NotAvailableMobile.vue";

export default {
  name: "EditSlide",
  components: {NotAvailableMobile, ColorPicker, FileManager, FontAwesomeIcon},
  setup() {
    const toast = useToast();
    return {toast};
  },
  data() {
    return {
      stageSize: "1-1",
      selectedShapeName: "",
      selectedShape: null,
      stageItems: [],
      configKonva: {
        width: 0,
        height: 0,
      },
      guide: null,
      slide: null,
      showControls: true,
      updateTriggerCounter: 0,
      fm_file: null,
    };
  },
  async mounted() {
    this.registerKeyboardEvents();
    this.registerWindowEvents();
    if (!this.$route.params.id) {
      this.toast.error("Invalid Slide ID");
      this.$router.push({name: "guides"});
    }
    if (!this.$route.query.gid) {
      this.toast.error("Invalid Guide ID");
      this.$router.push({name: "guides"});
    }
    await this.getGuide();
    await this.getSlide();
  },
  methods: {
    handleSelectStageItemFromCtrls(item) {
      if(this.selectedShapeName === item.name){
        this.selectedShapeName = "";
        this.selectedShape = null;
        return;
      }
      this.selectedShapeName = item.name;
      this.selectedShape = item;
      this.updateTransformer();
    },
    handleDeleteStageItemFromCtrls(item){
      this.selectedShapeName = item.name;
      this.selectedShape = item;
      this.deleteShape();
      this.updateTransformer();
    },
    handleImageLoadedEvent(){
      this.handleChangeStageSize();
    },
    registerWindowEvents() {
      window.addEventListener("resize", () => this.handleChangeStageSize(this.stageSize));
    },
    async deleteShape(){
      const confirmed = await UIkit.modal.confirm(`Do you really want to <b>delete</b> the shape <b>${this.selectedShape.label}</b>?`, {
        i18n: {
          cancel: 'No',
          ok: 'Yes'
        }
      }).then(function () {
        return true;
      }, function () {
        return false;
      });

      if (!confirmed) {
        return;
      }

      this.stageItems = this.stageItems.filter(
          (item) => item.name !== this.selectedShapeName
      );
      this.selectedShapeName = "";
      this.selectedShape = null;
      const transformerNode = this.$refs.transformer.getNode();
      transformerNode.nodes([]);
    },
    registerKeyboardEvents() {
      document.addEventListener("keydown", async (e) => {
        if (e.key === "Delete" || e.key === "Backspace") {
          const inputFocused = document.activeElement.tagName === "INPUT";
          if (this.selectedShapeName && !inputFocused) {
            await this.deleteShape();
          }
        }
      });
    },
    setStageSize() {
      this.stageSize = window.innerWidth < 768 ? "1-1" : "3-4";
      this.handleChangeStageSize();
    },
    handleImageSelected() {
      this.slide.uri = this.fm_file.fullPath;
      this.handleChangeStageSize();
    },
    handleFileSelected(file) {
      this.fm_file = file;
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
        const result = await axios.get(`/api/admin/guides/${this.$route.query.gid}/slides/${this.$route.params.id}`);
        this.slide = result.data.slide;
        if(!this.slide.content){
          this.slide.content = "[]";
        }
        try {
          this.stageItems = JSON.parse(this.slide.content) || [];
        } catch (err) {
          this.stageItems = [];
        }
        this.setStageSize();
      } catch (err) {
        console.log(err);
      }
    },
    async saveSlide(close) {
      this.slide.content = JSON.stringify(this.stageItems);
      try {
        const result = await axios.put(`/api/admin/guides/${this.$route.query.gid}/slides/${this.$route.params.id}`, this.slide);
        if(result.data.success){
          this.toast.success("Slide updated");
          if(close){
            this.$router.push({
              name: "admin-guide-slides",
              params: { id: this.$route.query.gid },
            });
          }
        }else{
          this.toast.error("Slide not updated");
        }
      } catch (err) {
        console.log(err);
      }
    },

    handleDragStart(e, item) {
    },
    handleDragEnd(e, item) {
      // find item
      const si = this.stageItems.find((si) => si.name === item.name);
      si.x = e.target.x();
      si.y = e.target.y();
      si.percentages = this.calculatePercentages(si);
    },

    // Transformer
    handleTransformEnd(e) {
      console.log("handleTransformEnd");
      // shape is transformed, let us save new attrs back to the node
      // find element in our state
      const si = this.stageItems.find(
          (item) => item.name === this.selectedShapeName
      );

      this.selectedShape = si;

      const newScaleX = e.target.scaleX();
      const newScaleY = e.target.scaleY();
      e.target.scaleX(1);
      e.target.scaleY(1);

      // update the state
      si.x = e.target.x();
      si.y = e.target.y();
      si.rotation = e.target.rotation();
      si.scaleX = 1;
      si.scaleY = 1;

      if (si.type === "rectangle") {
        si.width = Math.floor(e.target.width() * newScaleX);
        si.height = Math.floor(e.target.height() * newScaleY);
        si.cornerRadius = 10;
      }

      if (si.type === "circle") {
        si.radius = Math.floor(e.target.radius() * newScaleX);
      }

      si.percentages = this.calculatePercentages(si);

    },
    handleStageMouseDown(e) {
      // clicked on stage - clear selection
      if (e.target === e.target.getStage()) {
        this.selectedShapeName = "";
        this.updateTransformer();
        return;
      }

      // clicked on transformer - do nothing
      if (e.target.getParent().className === "Transformer") {
        return;
      }

      // find clicked shape by its name
      const name = e.target.name();
      const shape = this.stageItems.find((r) => r.name === name);
      if (shape) {
        this.selectedShapeName = name;
        this.selectedShape = shape;
      } else {
        this.selectedShapeName = "";
        this.selectedShape = null;
      }
      this.updateTransformer();
    },
    updateTransformer() {
      // here we need to manually attach or detach Transformer node
      const transformerNode = this.$refs.transformer.getNode();
      const stage = transformerNode.getStage();
      const {selectedShapeName} = this;

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
        this.selectedShape = null;
      }
    },

    handleChangeStageSize(keyword) {
      if (keyword) this.stageSize = keyword; // Set keyword to trigger change in GUI
      this.$nextTick(() => {
        // Wait for DOM update and get new size
        const innerStage = this.$refs["stageInner"];
        const image = this.$refs["image"];
        this.$nextTick(() => {
          let factor = image.naturalWidth / image.offsetWidth;
          const stageHeight = image.naturalHeight / factor;

          this.configKonva.width = innerStage.offsetWidth;
          this.configKonva.height = stageHeight;

          this.updateItemsByPercentages();
        });
      });
    },
    updateItemsByPercentages() {
      if (!this.stageItems || !this.stageItems.length) return;
      for (const item of this.stageItems) {
        if (item.type === "rectangle") {
          item.width = (this.configKonva.width / 100) * item.percentages.width;
          item.height = (this.configKonva.height / 100) * item.percentages.height;
        }
        if (item.type === "circle") {
          item.radius = (this.configKonva.width / 100) * item.percentages.radius;
        }
        item.x = (this.configKonva.width / 100) * item.percentages.x;
        item.y = (this.configKonva.height / 100) * item.percentages.y;
        item.strokeWidth = Math.ceil((this.configKonva.width / 100) * item.percentages.strokeWidth);
      }
    },
    handleStrokeWidthChanged() {
      this.selectedShape.percentages = this.calculatePercentages(this.selectedShape)
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
        strokeWidth: 0,
        stroke: "#000000",
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
      let element = this.stageItems.at(-1);
      element.percentages = this.calculatePercentages(element);
    },
    calculatePercentages(stageItem) {
      if (!stageItem) {
        this.toast.error("Error calculating percentages");
        return;
      }
      let percentages = {
        x: (stageItem.x / this.configKonva.width) * 100,
        y: (stageItem.y / this.configKonva.height) * 100,
        strokeWidth: (stageItem.strokeWidth / this.configKonva.width) * 100,
      }
      if (stageItem.type === "circle") {
        percentages.radius = (stageItem.radius / this.configKonva.width) * 100;
      }

      if (stageItem.type === "rectangle") {
        percentages.width = (stageItem.width / this.configKonva.width) * 100;
        percentages.height = (stageItem.height / this.configKonva.height) * 100;
      }
      return percentages;
    },

  },
};
</script>

<style lang="less">
@import "@/assets/less/variables.less";


#shape-edit-container {
  border: 1px solid @color-grey-light;

  #shape-edit-title {
    margin-top: -28px;

    span {
      padding: 5px 10px;
      background: #fff;
    }
  }

  .color-picker-preview-container {
    .vc-color-wrap {
      margin: 0;
      border-radius: @nxd-border-radius;
    }

    .current-color {
    }
  }

  .stroke-width-input {
    width: 80px;
    padding: 4px;
    margin: 0;
    border-radius: @nxd-border-radius;
    border: 1px solid @color-grey-light;
  }
}

img {
  width: 100%;
}
</style>
