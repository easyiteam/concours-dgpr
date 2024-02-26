<template>
    <div v-if="opened">
    <div class="fixed container flex justify-center items-center">
      <div
        class="
          flex
          items-center
          justify-center
          gap-6
          py-10
          px-20
          radius-8
          bg-white
          content
        "
      >
        <slot/>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from "vue";

export default defineComponent({
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

<style lang="scss" scoped>
.container {
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba($color: #000000, $alpha: 0.5);
}
.content {
    max-width: 80%;
}
</style>
