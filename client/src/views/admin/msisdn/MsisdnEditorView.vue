<template>
  <div class="uk-section uk-section-small" uk-height-viewport="offset-top:true">
    <div class="uk-container nxd-padding-xlarge-bottom">
      <h1 v-if="!id">Add MSISDN</h1>
      <h1 v-else>MSISDN Editor</h1>
      <div class="uk-card uk-card-default">
        <div class="uk-card-body">
          <div class="uk-child-width-1-1 uk-child-width-1-2@m" uk-grid>
            <div
              :class="{
                'uk-disabled nxd-disabled-section': /\d+/.exec(item.parent_id),
              }"
            >
              <label for="abo">Abonnement</label>
              <input
                type="text"
                id="abo"
                class="uk-input"
                v-model="item.abonnement"
              />
            </div>
            <div
              :class="{
                'uk-disabled nxd-disabled-section': /\d+/.exec(item.parent_id),
              }"
            >
              <label for="msisdn">SCN</label>
              <input type="text" id="scn" class="uk-input" v-model="item.scn" />
            </div>
            <div>
              <label for="msisdn">{{ techString }}MSISDN</label>
              <input
                type="text"
                id="msisdn"
                class="uk-input"
                placeholder="4179..."
                v-model="item.msisdn"
              />
            </div>
            <div>
              <label for="parent_id">Multi Device Parent MSISDN</label>
              <select id="parent_id" class="uk-select" v-model="item.parent_id">
                <option value="null">Select to set as Multi Device SIM</option>
                <option
                  v-for="parent of parent_msisdns"
                  :value="parent.id"
                  :key="parent.id"
                >
                  {{ parent.msisdn }} ({{ parent.abonnement || "No Abo" }})
                </option>
              </select>
            </div>
            <div>
              <label for="sim_number">SIM Number</label>
              <input
                type="text"
                id="sim_number"
                class="uk-input"
                placeholder="984101..."
                v-model="item.sim_number"
              />
            </div>
            <div>
              <label for="sim_type">SIM Type</label>
              <select id="sim_type" class="uk-select" v-model="item.sim_type">
                <option value="null">Select</option>
                <option
                  v-for="type in sim_types"
                  :key="type.id"
                  :value="type.id"
                >
                  {{ type.name }}
                </option>
              </select>
            </div>
          </div>
        </div>
      </div>
      <div class="uk-margin uk-card uk-card-default">
        <div class="uk-card-body">
          <div class="uk-margin">
            <label for="notes">Notes</label>
            <textarea
              id="notes"
              class="uk-textarea"
              rows="5"
              placeholder="Notes"
              v-model="item.notes"
            ></textarea>
          </div>
          <div class="uk-margin">
            <label for="notes">Hidden</label>
            <textarea
              id="hidden"
              class="uk-textarea"
              rows="5"
              placeholder="Hidden Notes"
              v-model="item.hidden"
            ></textarea>
          </div>
        </div>
      </div>
    </div>
    <ControlsFooterWidget
      @cancel="handleCancelClicked"
      @save="handleSaveClicked"
    />
  </div>
</template>

<script>
import ControlsFooterWidget from "@/components/ControlsFooterWidget.vue";
import axios from "axios";

export default {
  name: "MsisdnEditorView",
  components: { ControlsFooterWidget },
  props: {
    id: {
      type: String,
    },
  },
  computed: {
    techString() {
      return /\d+/.exec(this.item.parent_id) ? "Tech " : "";
    },
  },
  data() {
    return {
      sim_types: [],
      parent_msisdns: [],
      item: {
        msisdn: "",
        scn: "",
        abonnement: "",
        parent_id: null,
        sim_number: "",
        sim_type: null,
        notes: "",
        hidden: "",
      },
    };
  },
  mounted() {
    this.getSimTypes();
    this.getParentMsisdns();
    if (this.id) {
      this.getMsisdnData();
    }
  },
  methods: {
    getMsisdnData() {
      axios
        .get("/api/admin/numbers/" + this.id)
        .then((response) => {
          console.log(response.data);
          this.item = response.data;
        })
        .catch((error) => {
          console.log(error);
        });
    },
    getParentMsisdns() {
      axios
        .get("/api/admin/numbers", {
          params: {
            parentOnly: true,
          },
        })
        .then((response) => {
          console.log(response.data);
          this.parent_msisdns = response.data.filter((item) => {
            if (parseInt(item.id) !== parseInt(this.id)) return true;
          });
        })
        .catch((error) => {
          console.log(error);
        });
    },
    getSimTypes() {
      axios
        .get("/api/admin/sim_types")
        .then((response) => {
          console.log(response.data);
          this.sim_types = response.data;
        })
        .catch((error) => {
          console.log(error);
        });
    },
    handleCancelClicked() {
      console.log("cancel clicked");
      this.$router.push({ name: "msisdn-manager" });
    },
    handleSaveClicked() {
      if (/\d+/.exec(this.item.parent_id)) {
        this.item.abonnement = "";
        this.item.scn = "";
      } else {
        this.item.parent_id = null;
      }
      if (this.id) {
        this.updateMsisdn();
      } else {
        this.saveNewMsisdn();
      }
    },
    saveNewMsisdn() {
      axios
        .post("/api/admin/numbers", this.item)
        .then(() => {
          this.$router.push({ name: "msisdn-manager" });
        })
        .catch((error) => {
          console.log(error);
        });
    },
    updateMsisdn() {
      axios
        .put("/api/admin/numbers/" + this.id, this.item)
        .then(() => {
          this.$router.push({ name: "msisdn-manager" });
        })
        .catch((error) => {
          console.log(error);
        });
    },
  },
};
</script>

<style scoped></style>
