<template>
  <tr v-if="number.visible">
    <td class="uk-text-nowrap">{{ number.msisdn }}</td>
    <td class="uk-text-nowrap">{{ number.device_name }}</td>
    <td class="uk-text-nowrap">{{ number.sim_number }}</td>
    <td class="uk-text-nowrap">{{ number.abonnement }}</td>
    <td>
      <div
        class="uk-text-center uk-text-left@m nxd-no-select nxd-cursor-pointer"
        v-if="number.multi_device.length"
        @click="hidden = !hidden"
      >
        <span v-if="hidden"
          ><font-awesome-icon :icon="['fas', 'chevron-down']" />&nbsp;
          <span class="uk-text-muted uk-text-small">Show</span></span
        >
        <span v-else
          ><font-awesome-icon :icon="['fas', 'chevron-up']" />&nbsp;<span
            class="uk-text-muted uk-text-small"
            >Hide</span
          ></span
        >
      </div>
    </td>
    <td class="uk-position-relative uk-text-right">
      <router-link
        class="uk-position-cover"
        :to="{ name: 'msisdn-edit', params: { id: number.id } }"
      />
      <font-awesome-icon
        :icon="['fas', 'chevron-right']"
        class="uk-preserve-width"
      />
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
        <td class="uk-text-nowrap">{{ md.device_name }}</td>
        <td class="uk-text-nowrap">{{ md.sim_number }}</td>
        <td class="uk-text-nowrap">
          <span class="uk-text-meta">Multi Device</span>
        </td>
        <td class="uk-text-nowrap">{{ number.msisdn }}</td>
        <td class="uk-position-relative uk-text-right">
          <router-link
            class="uk-position-cover"
            :to="{ name: 'msisdn-edit', params: { id: md.id } }"
          />
          <font-awesome-icon
            :icon="['fas', 'chevron-right']"
            class="uk-preserve-width"
          />
        </td>
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
