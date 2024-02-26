<template>
  <df-success :title="title" :message="message" @confirm="handleConfirm" />
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import DfSuccess from "../components/utils/DfSuccess.vue";

export default defineComponent({
  components: {
    DfSuccess,
  },
  setup() {
    const type = useRoute().params.type;
    const router = useRouter();
    const title = ref(
      type === "presence"
        ? "Présence validée avec succès !"
        : "Admission validée avec succès !"
    );
    const message = ref(
      type !== "presence"
        ? "Cliquez sur le bouton terminer pour effectuer une autre admission"
        : "Cliquez sur le bouton terminer pour effectuer une autre validation"
    );

    const handleConfirm = () => {
      if (type === "presence") {
        router.push("/presences");
        return;
      }
      router.push("/validations");
    };

    return {
      title,
      message,
      handleConfirm,
    };
  },
});
</script>
