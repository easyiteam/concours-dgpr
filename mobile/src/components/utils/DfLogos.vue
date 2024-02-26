<template>
  <div class="flex justify-center bg-primary py-4">
    <div class="px-12">
      <div v-if="type === 'small'">
        <img src="../../assets/icon.png" alt="MDN SMALL" height="80" />
      </div>
      <div v-else>
        <img src="../../assets/icon.png" alt="MDN BIG" height="250" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import { defineComponent } from 'vue';

  export default defineComponent({
    components: {},
    props: {
      type: {
        type: String,
        default: 'small',
      },
    },
  });
</script>

<style lang="scss" scoped>
  .left {
    border-right: solid 1px #ffffff;
  }
</style>
