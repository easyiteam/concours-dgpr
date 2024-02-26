<template>
  <ion-page>
    <df-layout-content color="primary">
      <div>
        <div class="fs-16 text-white text-center pt-16">
          Bienvenu sur l'application de
        </div>
        <div
          class="bold fs-18 text-white text-center pt-4 mx-8 pb-8"
          style="border-bottom: solid 1px #fff">
          Recrutement des Eaux, <br />
          Forêts et Chasse
        </div>

        <div class="mt-16">
          <df-logos type="big" />
        </div>

        <div
          class="top-radius bg-white px-10 py-4 mt-18 pb-10 absolute"
          style="bottom: 0; width: 100%">
          <div class="fs-24 bold text-center py-6">Connectez-vous</div>

          <div class="flex flex-col gap-8 mt-12">
            <df-input label="Identifiant" v-model="userInfo.email">
              <person-icon />
            </df-input>

            <df-password label="Mot de passe" v-model="userInfo.password" />
          </div>
          <div class="mt-16">
            <df-button-expand @click="handleSubmit"
              >Se connecter</df-button-expand
            >
          </div>
        </div>
        <df-loading :isOpen="isLoading" />
      </div>
    </df-layout-content>
  </ion-page>
</template>

<script lang="ts">
  /* eslint-disable */
  import { IonContent, IonPage } from '@ionic/vue';
  import { defineComponent } from 'vue';
  import DfInput from '../components/forms/DfInput.vue';
  import PersonIcon from '../components/svgs/PersonIcon.vue';
  import DfContainer from '../components/utils/DfContainer.vue';
  import DfSelect from '../components/forms/DfSelect.vue';
  import DfLogos from '../components/utils/DfLogos.vue';
  import DfButtonExpand from '../components/forms/DFButtonExpand.vue';
  import DfButton from '../components/forms/DfButton.vue';
  import DfLoading from '../components/utils/DfLoading.vue';
  import DfPassword from '../components/forms/DfPassword.vue';
  import DfLayoutContent from '../components/utils/DfLayoutContent.vue';
  import { useLogin } from '../hooks/useLogin';

  export default defineComponent({
    components: {
      IonContent,
      IonPage,
      DfInput,
      PersonIcon,
      DfContainer,
      DfSelect,
      DfLogos,
      DfButtonExpand,
      DfButton,
      DfLoading,
      DfPassword,
      DfLayoutContent,
    },
    setup() {
      const { isLoading, handleSubmit, userInfo } = useLogin();

      return {
        isLoading,
        handleSubmit,
        userInfo,
      };
    },
  });
</script>

<style scoped></style>
