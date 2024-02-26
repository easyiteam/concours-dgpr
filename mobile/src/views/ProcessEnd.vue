<template>
  <df-default-page>
    <div
      class="semi-bold flex justify-center items-center text-center"
      style="height: 100%"
    >
      <div>
        Le processus d'enrolement pour la phase sportive est clôturée.
        <br /><br /><br />
        Merci de votre participation.
        <br /><br /><br />
        <df-button-expand @click="exit">Quitter l'application</df-button-expand>
      </div>
    </div>
  </df-default-page>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import DfDefaultPage from "../components/utils/DfDefaultPage.vue";
import DfButtonExpand from "../components/forms/DFButtonExpand.vue";
import { App } from "@capacitor/app";

export default defineComponent({
  components: {
    DfDefaultPage,
    DfButtonExpand,
  },
  setup() {
    const exit = () => {
      App.exitApp();
    };

    return {
      exit,
    };
  },
});
</script>
