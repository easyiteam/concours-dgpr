<template>
  <ion-app>
    <div class="big-container">
      <div class="content-container">
        <ion-router-outlet />
      </div>
      <df-footer />
    </div>
  </ion-app>
</template>

<script lang="ts">
import { IonApp, IonRouterOutlet } from "@ionic/vue";
import { defineComponent } from "vue";
import DfFooter from "./components/utils/DfFooter.vue";

export default defineComponent({
  name: "App",
  components: {
    IonApp,
    IonRouterOutlet,
    DfFooter,
  },
});
</script>

<style lang="scss" scoped>
.big-container {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
}

.content-container {
  height: 100%;
  overflow: auto;
  position: relative;
}
</style>