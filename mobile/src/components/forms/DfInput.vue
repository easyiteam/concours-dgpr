<template>
  <div>
    <label class="semi-bold">{{ label }}</label>
    <div
      class="flex gap-4 items-center border-border-dark radius-8 py-7 px-8 mt-4">
      <slot />
      <input
        :type="type"
        :placeholder="placeholder"
        v-model="value"
        style="width: 90%"
        class="noborder nooutline fs-14" />
    </div>
  </div>
</template>

<script lang="ts">
  /* eslint-disable */
  import { defineComponent, PropType, computed } from 'vue';

  export default defineComponent({
    props: {
      label: {
        type: String,
        default: '',
      },
      type: {
        type: String,
        default: 'text',
      },
      placeholder: {
        type: String,
        default: '',
      },
      modelValue: {
        type: String as PropType<string | number | any>,
        default: '',
      },
      uppercase: {
        type: Boolean,
        default: false,
      },
    },

    setup(props, { emit }) {
      const value = computed({
        get: () => props.modelValue,
        set: (value) =>
          emit(
            'update:modelValue',
            props.uppercase ? value.toUpperCase() : value,
          ),
      });

      return {
        value,
      };
    },
  });
</script>
