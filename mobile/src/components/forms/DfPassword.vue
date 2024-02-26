<template>
  <div>
    <label class="semi-bold">{{ label }}</label>
    <div
      class="flex gap-4 items-center border-border-dark radius-8 py-7 px-8 mt-4"
    >
      <lock-solid />
      <input
        :type="currentType"
        :placeholder="placeholder"
        v-model="value"
        style="width: 80%"
        class="noborder nooutline fs-14"
      />
      <div @click="toggleType" class="flex justify-center items-center">
        <eye-icon />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
/* eslint-disable */
import { defineComponent, ref, PropType, computed } from 'vue';
import EyeIcon from "../svgs/EyeIcon.vue";
import LockSolid from "../svgs/LockSolid.vue";

export default defineComponent({
  components: {
    EyeIcon,
    LockSolid,
  },
  props: {
    label: {
      type: String,
      default: "",
    },
    placeholder: {
      type: String,
      default: "",
    },
    modelValue: {
      type: String as PropType<string | number | any>,
      default: "",
    },
  },

  setup(props, { emit }) {
    const value = computed({
      get: () => props.modelValue,
      set: (value: string) => emit('update:modelValue', value)
    });

    const currentType = ref("password");

    const toggleType = () => {
      currentType.value =
        currentType.value === "password" ? "text" : "password";
    };

    return {
      currentType,
      toggleType,
      value
    };
  },
});
</script>
