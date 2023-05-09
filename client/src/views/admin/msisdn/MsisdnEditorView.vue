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
                :class="{ 'form-invalid': v$.item.abonnement.$errors.length }"
              />
              <div
                v-if="v$.item.abonnement.$errors.length"
                class="uk-text-danger uk-text-small"
              >
                <div
                  v-for="error in v$.item.abonnement.$errors"
                  :key="error.id"
                >
                  {{ error.$message }}
                </div>
              </div>
            </div>
            <div
              :class="{
                'uk-disabled nxd-disabled-section': /\d+/.exec(item.parent_id),
              }"
            >
              <label for="msisdn">SCN</label>
              <input
                type="text"
                id="scn"
                class="uk-input"
                v-model="item.scn"
                :class="{ 'form-invalid': v$.item.scn.$errors.length }"
              />
              <div
                v-if="v$.item.scn.$errors.length"
                class="uk-text-danger uk-text-small"
              >
                <div v-for="error in v$.item.scn.$errors" :key="error.id">
                  {{ error.$message }}
                </div>
              </div>
            </div>
            <div>
              <label for="msisdn">{{ techString }}MSISDN</label>
              <input
                type="text"
                id="msisdn"
                class="uk-input"
                placeholder="4179..."
                v-model="item.msisdn"
                :class="{ 'form-invalid': v$.item.msisdn.$errors.length }"
              />
              <div
                v-if="v$.item.msisdn.$errors.length"
                class="uk-text-danger uk-text-small"
              >
                <div v-for="error in v$.item.msisdn.$errors" :key="error.id">
                  {{ error.$message }}
                </div>
              </div>
            </div>
            <div>
              <label for="parent_id">Multi Device</label>
              <select id="parent_id" class="uk-select" v-model="item.parent_id">
                <option value="null">Main MSISDN</option>
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
                placeholder="894101..."
                v-model="item.sim_number"
                :class="{ 'form-invalid': v$.item.sim_number.$errors.length }"
              />
              <div
                v-if="v$.item.sim_number.$errors.length"
                class="uk-text-danger uk-text-small"
              >
                <div
                  v-for="error in v$.item.sim_number.$errors"
                  :key="error.id"
                >
                  {{ error.$message }}
                </div>
              </div>
            </div>
            <div>
              <label for="sim_type">SIM Type</label>
              <select
                id="sim_type"
                class="uk-select"
                v-model="item.sim_type_id"
              >
                <option value="null">Select</option>
                <option
                  v-for="type in sim_types"
                  :key="type.id"
                  :value="type.id"
                >
                  {{ type.name }}
                </option>
              </select>
              <div
                v-if="v$.item.sim_type_id.$errors.length"
                class="uk-text-danger uk-text-small"
              >
                <div
                  v-for="error in v$.item.sim_type_id.$errors"
                  :key="error.id"
                >
                  {{ error.$message }}
                </div>
              </div>
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
import { useToast } from "vue-toastification";
import ControlsFooterWidget from "@/components/ControlsFooterWidget.vue";
import axios from "axios";
import { useVuelidate } from "@vuelidate/core";
import { helpers, requiredIf, numeric } from "@vuelidate/validators";

const exactLength = (length, fieldname = "") =>
  helpers.withMessage(
    `${fieldname} must be ${length} digits`,
    (value) => value.length === length
  );

const startsWith = (prefix, fieldname = "") =>
  helpers.withMessage(`${fieldname} must start with ${prefix}`, (value) =>
    value.startsWith(prefix)
  );

const validSelection = (fieldname = "") => {
  return helpers.withMessage(`Please select a ${fieldname}`, (value) => {
    return (
      value !== "null" &&
      value !== null &&
      value !== undefined &&
      value !== "" &&
      value !== 0
    );
  });
};

export default {
  name: "MsisdnEditorView",
  setup() {
    const toast = useToast();
    const v$ = useVuelidate();
    return { toast, v$ };
  },
  components: { ControlsFooterWidget },
  validations() {
    return {
      item: {
        msisdn: {
          exactLength: exactLength(11, "MSISDN"),
          startsWith: startsWith("41", "MSISDN"),
          numeric,
        },
        sim_number: {
          exactLength: exactLength(20),
          startsWith: startsWith("894101", "ICCID"),
          numeric,
        },
        abonnement: {
          requiredIfMain: helpers.withMessage(
            "Abonnement Description is required for Main MSISDN",
            requiredIf(function () {
              return !/\d+/.exec(this.item.parent_id);
            })
          ),
        },
        sim_type_id: {
          validSelection: validSelection("SIM Type"),
        },
        scn: {
          numeric,
        },
      },
    };
  },
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
        sim_type_id: null,
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
        .get("/api/admin/msisdns/" + this.id)
        .then((response) => {
          console.log(response.data);
          this.item = response.data;
        })
        .catch((error) => {
          console.log(error.response);
          this.$router.push("/");
        });
    },
    getParentMsisdns() {
      axios
        .get("/api/admin/msisdns", {
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
      this.$router.push({ name: "msisdn-manager" });
    },
    async handleSaveClicked() {
      const formIsValid = await this.v$.$validate();
      console.log(this.v$.$errors);
      if (!formIsValid) return;

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
        .post("/api/admin/msisdns", this.item)
        .then((res) => {
          this.handleResponse(res);
        })
        .catch((error) => {
          this.handleResponse(error.response);
        });
    },
    updateMsisdn() {
      axios
        .put("/api/admin/msisdns/" + this.id, this.item)
        .then(() => {
          this.$router.push({ name: "msisdn-manager" });
        })
        .catch((error) => {
          this.handleResponse(error.response);
        });
    },
    handleResponse(response) {
      if (response.status === 200 || response.status === 201) {
        this.$router.push({ name: "msisdn-manager" });
        this.toast.success("MSISDN saved successfully");
      } else {
        this.toast.error("Error saving MSISDN");
        console.error(
          `${response.status} - ${response.statusText}: ${response.data}`
        );
      }
    },
  },
};
</script>

<style scoped></style>
