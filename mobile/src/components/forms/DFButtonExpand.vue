<template>
  <button
    class="radius-8 noborder nooutline py-6 fs-14 semi-bold bg-primary text-white border-primary"
    @click="handleClick"
    :disabled="disabled">
    <slot />
  </button>
</template>

<script lang="ts">
  import { defineComponent } from 'vue';

  export default defineComponent({
    props: {
      disabled: {
        type: Boolean,
        default: false,
      },
    },
    setup(_, { emit }) {
      const handleClick = () => {
        console.log('emitting');
        emit('submit');
      };
      return {
        handleClick,
      };
    },
  });
</script>

<style lang="scss" scoped>
  button {
    width: 100%;

    &:disabled {
      opacity: 0.5;
    }
  }
</style>
