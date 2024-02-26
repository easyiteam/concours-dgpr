<template>
  <div>
    <label class="semi-bold">{{ label }}</label>
    <div
      class="dropdown-container relative mt-4"
      ref="containerRef"
      @click="toggle">
      <div
        class="dropdown flex items-center justify-between py-7 px-8 border-border-dark radius-8">
        <div v-if="currentValue.label.length > 0">{{ currentValue.label }}</div>
        <div v-else></div>
        <arrow-down />
      </div>

      <div
        class="dropdown-items absolute radius-8 bg-white mt-2 p-4"
        v-if="isOpen">
        <div
          v-for="(item, index) in data"
          :key="index"
          class="py-6 px-12 semi-bold"
          @click="select(item)">
          {{ item.label }}
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  interface SelectInterface {
    label: string;
    [x: string]: string;
  }

  import { defineComponent, onMounted, PropType, ref, watch } from 'vue';
  import ArrowDown from '../svgs/ArrowDown.vue';

  export default defineComponent({
    components: {
      ArrowDown,
    },
    props: {
      data: Object as PropType<SelectInterface[]>,
      label: String,
      value: String,
    },
    setup(props, { emit }) {
      const currentValue = ref({ label: props.value ?? '' });
      const isOpen = ref(false);
      const containerRef = ref();

      // watch(
      //   () => props.value,
      //   (newValue) => {
      //     currentValue.value.label = newValue ?? '';
      //   },
      //   { deep: true },
      // );

      const toggle = () => {
        isOpen.value = !isOpen.value;
      };

      const select = (item: SelectInterface) => {
        emit('change', item);
        currentValue.value = item;
      };

      onMounted(() => {
        console.log(props.data);
        document.addEventListener('click', ($event) => {
          if (
            containerRef.value &&
            !containerRef.value.contains($event.target)
          ) {
            isOpen.value = false;
          }
        });
      });

      return {
        currentValue,
        isOpen,
        toggle,
        select,
        containerRef,
      };
    },
  });
</script>

<style lang="scss" scoped>
  .dropdown-items {
    box-shadow: 0px 5px 15px rgba(0, 0, 0, 0.15);
    width: 100%;
    z-index: 10;
  }
</style>
