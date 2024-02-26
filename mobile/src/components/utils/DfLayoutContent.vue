<template>
  <ion-content :fullscreen="true">
    <div :class="css" style="height: 100%">
      <slot />
    </div>
  </ion-content>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { IonContent } from '@ionic/vue';

export default defineComponent({
  components: {
    IonContent
  },
  props: {
    color: String,
  },
  setup(props) {
    return {
      css: props.color === "primary" ? "bg-primary" : "bg-white",
    };
  },
});
</script>
