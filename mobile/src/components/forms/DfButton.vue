<template>
  <button
    :class="
      'flex justify-center items-center gap-4 py-5 semi-bold radius-6 text-white ' +
      bg +
      ' ' +
      border
    "
    :disabled="disabled"
  >
    <slot name="icon" />
    <slot />
  </button>
</template> 

<script lang="ts">
import { defineComponent, ref } from "vue";

export default defineComponent({
  props: {
    type: {
      type: String,
      default: "primary",
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  setup(props) {
    const bg = ref(
      props.type === "primary"
        ? "bg-primary text-white"
        : "bg-transparent text-dark-gray"
    );
    const border = ref(
      props.type === "primary"
        ? "border-primary px-12"
        : "border-border-dark px-6"
    );

    return {
      bg,
      border
    };
  },
});
</script>

<style lang="scss" scoped>
button {
  &:disabled {
    opacity: 0.5;
  }
}
</style>
