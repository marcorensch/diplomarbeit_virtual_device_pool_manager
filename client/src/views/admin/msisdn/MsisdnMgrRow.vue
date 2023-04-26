<template>
  <tr v-if="number.visible">
    <td class="uk-text-nowrap">{{ number.msisdn }}</td>
    <td class="uk-text-nowrap">{{ number.sim_number }}</td>
    <td class="uk-text-nowrap">{{ number.abonnement }}</td>
    <td>
      <div
        class="uk-text-center uk-text-left@m"
        v-if="number.multi_device.length"
        @click="hidden = !hidden"
      >
        <span v-if="hidden"
          ><font-awesome-icon :icon="['fas', 'chevron-down']"
        /></span>
        <span v-else><font-awesome-icon :icon="['fas', 'chevron-up']" /></span>
      </div>
    </td>
  </tr>
  <template v-if="number.multi_device.length">
    <template v-if="number.visible">
      <tr
        class="multi-device-item uk-text-small"
        :class="{ 'uk-hidden': hidden }"
        v-for="md of number.multi_device"
        :key="md.id"
      >
        <td class="uk-text-nowrap">{{ md.msisdn }}</td>
        <td class="uk-text-nowrap">{{ md.sim_number }}</td>
        <td class="uk-text-nowrap">
          <span class="uk-text-meta">Multi Device</span>
        </td>
        <td class="uk-text-nowrap">{{ number.msisdn }}</td>
      </tr>
    </template>
  </template>
</template>

<script>
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

export default {
  name: "MsisdnMgrRow",
  components: { FontAwesomeIcon },
  props: {
    number: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      hidden: true,
    };
  },
};
</script>

<style scoped></style>
