<template></template>

<script>
import axios from "axios";
import { useToast } from "vue-toastification";

export default {
  name: "EditSlide",
  setup() {
    const toast = useToast();
    return { toast };
  },
  data() {
    return {
      slideData: null,
    };
  },
  mounted() {
    if (!this.$route.params.id) {
      this.toast.error("Invalid Slide ID");
      this.$router.push({ name: "guides" });
    }
    this.getSlideData();
  },
  methods: {
    async getSlideData() {
      try {
        const result = await axios.get(
          `/api/guideme/slide/${this.$route.params.id}`
        );
        this.slideData = result.data;
      } catch (err) {
        console.log(err);
      }
    },
    async updateSlide() {
      try {
        await axios.put(
          `/api/guideme/slide/${this.$route.params.id}`,
          this.slideData
        );
        this.$router.push({ name: "SlideList" });
      } catch (err) {
        console.log(err);
      }
    },
  },
};
</script>

<style scoped></style>
