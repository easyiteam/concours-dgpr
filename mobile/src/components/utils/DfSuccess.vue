<template>
  <df-default-page>
    <div class="flex justify-center mt-20 mb-12">
      <check-icon />
    </div>
    <h1 class="my-12 bold fs-20 text-center">
      {{ title }}
    </h1>

    <div class="my-12 fs-16 text-center">
      {{ message }}
    </div>

    <div class="mt-20">
      <df-button-expand @click="confirm">Terminer</df-button-expand>
    </div>
  </df-default-page>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import DfDefaultPage from "../utils/DfDefaultPage.vue";
import CheckIcon from "../svgs/CheckIcon.vue";
import DfButtonExpand from "../forms/DFButtonExpand.vue";

export default defineComponent({
  components: {
    DfDefaultPage,
    CheckIcon,
    DfButtonExpand,
  },
  props: {
    title: String,
    message: String,
  },
  setup(_, { emit }) {
    return {
      confirm: () => emit("confirm"),
    };
  },
});
</script>
