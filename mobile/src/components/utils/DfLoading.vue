<template>
  <df-modal :isOpen="isOpen" >
    <loader-icon />
    <div class="bold">Chargement ...</div>
  </df-modal>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from "vue";
import LoaderIcon from "../svgs/LoaderIcon.vue";
import DfModal from "../utils/DfModal.vue";

export default defineComponent({
  components: {
    LoaderIcon,
    DfModal,
  },
  props: {
    isOpen: {
      type: Boolean,
      default: false,
    },
  },
  setup(props) {
    const opened = ref(props.isOpen);

    watch(
      props,
      (newPropsValue) => {
        opened.value = newPropsValue.isOpen;
      },
      { deep: true }
    );

    return {
      opened,
    };
  },
});
</script>

