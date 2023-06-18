<template>
  <div class="uk-section uk-section-small devices-list-view">
    <div id="export-header" class="uk-container">
      <div class="uk-grid uk-grid-small uk-flex uk-flex-middle uk-margin-bottom">
        <div>
          <router-link class="go-back-link" :to="{name: 'devices'}">
            <font-awesome-icon class="uk-h1 uk-margin-remove" :icon="['fas', 'arrow-left']"/>
          </router-link>

        </div>
        <div>
          <h1 class="uk-margin-remove">Export Device List</h1>
        </div>
      </div>
      <div class="uk-width-1-1 uk-border-rounded uk-background-muted uk-padding-small">
        <div class="actions uk-grid-small uk-flex uk-flex-middle uk-flex-between" uk-grid>
          <div class="uk-width-auto">
            <div class="uk-grid uk-grid-small uk-flex uk-flex-middle">
              <div class="uk-width-medium">
                <select name="location-select" id="location-select" class="uk-select" @change="getSlotsForLocation">
                  <option value="">Select Location</option>
                  <template v-for="location of locations" :key="location.id">
                    <option :value="location.id">{{ location.name }}</option>
                  </template>
                </select>
              </div>
              <div class="uk-width-auto">
                <button @click="showEmptySlots = !showEmptySlots" class="uk-button uk-button-default">
                  {{ showEmptySlots ? 'Hide Empty Slots' : 'Show Empty Slots' }}
                </button>
              </div>
            </div>
          </div>
          <div>
            <div class="uk-grid uk-grid-small uk-grid-divider uk-flex uk-flex-middle">
              <div>
                <button class="uk-button uk-button-secondary"
                        :class="{'uk-disabled': !slots.length }"
                        uk-tooltip="Copy Table to Clipboard"
                        @click="copyTableToClipboard"
                >
                  <font-awesome-icon :icon="['fas', 'clipboard']"/>
                </button>
              </div>
              <div>
                <button class="uk-button uk-button-secondary"
                        :class="{'uk-disabled': !slots.length }"
                        uk-tooltip="Print"
                        @click="printTable"
                >
                  <font-awesome-icon :icon="['fas', 'print']"/>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="uk-container uk-margin uk-position-relative nxd-min-height-80vh">
      <div class="nxd-loading-overlay uk-position-cover" v-if="loading">
        <div class="uk-position-center">
          <div uk-spinner="ratio:5"></div>
        </div>
      </div>
      <table class="uk-table uk-table-divider print-table">
        <thead>
        <th>Slot</th>
        <th>Device</th>
        <th>Added</th>
        </thead>
        <tbody>
        <template v-for="slot in slots" :key="slot.id">
          <tr v-if="slot.device_names.length || showEmptySlots ">
            <td>{{ slot.locationIdentificator }}</td>
            <td>
              <div v-for="(device, i) of slot.device_names" :key="i">
                {{ device }}
              </div>
            </td>
            <td>
              <div v-for="(added, i) of slot.device_added" :key="i">
                {{ added }}
              </div>
            </td>
          </tr>
        </template>

        </tbody>
      </table>

      <table ref="copyTable" data-copy-table="">
        <thead>
        <th>Slot</th>
        <th>Device</th>
        <th>Added</th>
        </thead>
        <tbody>
        <template v-for="slot in slots" :key="slot.id">
          <tr v-if="slot.device_names.length || showEmptySlots ">
            <td>{{ slot.locationIdentificator }}</td>
            <td>
              <div v-for="(device, i) of slot.device_names" :key="i">
                {{ device }}
              </div>
            </td>
            <td>
              <div v-for="(added, i) of slot.device_added" :key="i">
                {{ added }}
              </div>
            </td>
          </tr>
        </template>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";
import {useToast} from "vue-toastification";

export default {
  name: "ExportView",
  setup() {
    const toast = useToast();
    return {toast};
  },
  components: {FontAwesomeIcon},
  data() {
    return {
      slots: [],
      locations: [],
      showEmptySlots: true,
      loading: false,
    }
  },
  mounted() {
    this.getLocations();
  },
  methods: {
    async getLocations() {
      try {
        const response = await axios.get('/api/devicepool/items?category=location');
        this.locations = response.data;
      } catch (e) {
        console.log(e)
      }
    },
    async getSlotsForLocation() {
      this.slots = [];
      const locationId = document.getElementById('location-select').value;
      if (!locationId) {
        return;
      }
      this.loading = true;
      try {
        const response = await axios.get(`/api/devicepool/items/${locationId}?deep=true`)
        this.buildTableData(response.data);
      } catch (e) {
        console.log(e)
      }
      this.loading = false;
    },
    buildTableData(data) {
      const slots = [];
      data.children.forEach(cabinet => {
        const cabinetName = cabinet.name;
        cabinet.children.forEach(row => {
          const rowName = row.name;
          row.children.forEach(slot => {
            const leadingZeroName = parseInt(slot.name) > 9 ? slot.name : `0${slot.name}`;
            slot.locationIdentificator = `${cabinetName}.${rowName}${leadingZeroName}`;
            if (slot.device_names) {
              slot.device_names = slot.device_names.split(',')
              const addedArray = slot.device_added.split(',');
              slot.device_added = addedArray.map(added => {
                const date = new Date(added);
                return `${date.toLocaleDateString()}`;
              });
            } else {
              slot.device_names = [];
              slot.device_added = [];
            }
            slots.push(slot);
          })
        })
      })
      this.slots = slots;
    },
    async copyTableToClipboard() {
      const copyTableHtml = this.$refs.copyTable.outerHTML;
      let cleanedHtml = copyTableHtml.replace(/ data[-a-z\d]+="[a-zäöüàéè\d\s_-]*"/ig, ''); // Regex to remove all data attributes
      cleanedHtml = cleanedHtml.replace(/<!--[\s\S]*?-->/g, ''); // Regex to remove all comments
      const status = await navigator.clipboard.writeText(cleanedHtml).then(() => true).catch((e) => {
        console.log(e);
        return false;
      });
      if (status) {
        this.toast.success('Table was copied to the clipboard.');
      } else {
        this.toast.error('Error while copying the table to the clipboard.');
      }
    },
    printTable() {
      window.print();
    }
  }
}
</script>

<style lang="less">
@import "@/assets/less/variables.less";

@media print {
  nav.uk-navbar-container {
    display: none;
  }

  #export-header {
    display: none;
  }

  table.print-table {
    border-collapse: collapse !important;
    width: 100%;
  }

  th, td {
    border: 1px solid @color-grey-light !important;
    padding: 12px !important;
  }

}

[data-copy-table] {
  display: none;
}
</style>