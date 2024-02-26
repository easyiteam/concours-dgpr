<template>
  <div class="my-16">
    <div class="text-dark fs-16 semi-bold mb-4">
      {{ title }}
    </div>
    <div class="fs-14">
      {{ label }}
    </div>
  </div>
</template>

<script lang="ts">
  import { defineComponent } from 'vue';

  export default defineComponent({
    props: {
      title: String,
      label: String,
    },
  });
</script>
