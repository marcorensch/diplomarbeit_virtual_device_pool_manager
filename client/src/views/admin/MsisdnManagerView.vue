<template>
  <div class="uk-section uk-section-small">
    <div class="uk-container">
      <h1>MSISDN Manager</h1>
      <div class="uk-card uk-card-default uk-card-small">
        <div class="uk-card-body">
          <table class="uk-table uk-table-striped">
            <thead>
              <th>MSISDN</th>
              <th>Abonnement</th>
              <th>SIM Type</th>
              <th>SIM Number</th>
              <th>Device</th>
            </thead>
            <tbody>
              <tr v-for="number of numbers" :key="number.id">
                <td>{{ number.msisdn }}</td>
                <td>{{ number.abonnement }}</td>
                <td>{{ number.simTypeName }}</td>
                <td>{{ number.simNumber }}</td>
                <td>{{ number.device }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
export default {
  name: "MsisdnManagerView",
  data() {
    return {
      numbers: [],
    };
  },
  mounted() {
    axios
      .get("/api/admin/numbers")
      .then((response) => {
        console.log(response.data);
        this.numbers = response.data;
      })
      .catch((error) => {
        console.log(error);
      });
  },
};
</script>

<style scoped></style>
