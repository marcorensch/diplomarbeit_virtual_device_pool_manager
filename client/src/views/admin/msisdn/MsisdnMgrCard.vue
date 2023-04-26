<template>
  <div
    class="uk-margin uk-card uk-card-default uk-card-small"
    v-if="number.visible"
  >
    <div class="uk-position-relative" uk-grid>
      <div class="uk-width-expand">
        <div class="uk-card-header">
          <h3>{{ number.abonnement }}</h3>
          <span>SCN: {{ number.scn }}</span>
        </div>
        <div class="uk-card-body uk-position-relative">
          <div
            class="uk-child-width-1-1 uk-child-width-1-3@m uk-grid-small"
            uk-grid
          >
            <div>
              <b>MSISDN:</b><br />
              {{ number.msisdn }}
            </div>
            <div>
              <div>
                <b>SIM Card:</b>
              </div>
              <div>{{ number.sim_number }} ({{ number.simTypeName }})</div>
            </div>
            <div
              class="uk-width-1-1 uk-margin"
              v-if="number.multi_device.length"
            >
              <div class="uk-text-bold">Multi Device:</div>
              <ul
                :class="'md_list_' + number.id"
                class="uk-list uk-list-divider uk-text-small uk-margin-remove-top"
              >
                <li
                  v-for="md of number.multi_device"
                  class="multidevice-item"
                  :key="md.id"
                >
                  <div
                    class="uk-flex uk-flex-middle uk-grid-small uk-position-relative"
                  >
                    <div class="uk-width-expand">
                      {{ md.sim_number }} ({{ md.simTypeName }})
                    </div>
                    <div>
                      <font-awesome-icon
                        class=""
                        :icon="['fas', 'chevron-right']"
                      />
                    </div>
                    <router-link
                      class="uk-position-cover uk-position-z-index"
                      :to="{ name: 'msisdn-edit', params: { id: md.id } }"
                    />
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div class="uk-width-auto uk-flex uk-flex-middle">
        <div class="uk-padding-small">
          <font-awesome-icon
            class="uk-margin-small-right"
            :icon="['fas', 'chevron-right']"
            size="2x"
          />
        </div>
      </div>
      <router-link
        class="uk-position-cover"
        :to="{ name: 'msisdn-edit', params: { id: number.id } }"
      />
    </div>
  </div>
</template>

<script>
export default {
  name: "MsisdnMgrCard",
  props: {
    number: {
      type: Object,
      required: true,
    },
  },
};
</script>
