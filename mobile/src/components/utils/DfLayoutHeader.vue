<template>
  <ion-header>
    <df-logos />
  </ion-header>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import DfLogos from "./DfLogos.vue";
import { IonHeader } from '@ionic/vue';

export default defineComponent({
  components: {
    DfLogos,
    IonHeader
  },
});
</script>
