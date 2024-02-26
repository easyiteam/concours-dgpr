<template>
  <ion-page>
    <df-layout-header />
    <df-layout-content>
      <df-container>
        <slot />
      </df-container>
    </df-layout-content>
  </ion-page>
</template>


<script lang="ts">
import { defineComponent } from "vue";
import DfLayoutHeader from "../utils/DfLayoutHeader.vue";
import DfLayoutContent from "../utils/DfLayoutContent.vue";
import DfContainer from "../utils/DfContainer.vue";
import { IonPage } from "@ionic/vue";

export default defineComponent({
  components: {
    IonPage,
    DfLayoutHeader,
    DfLayoutContent,
    DfContainer,
  },
});
</script>
