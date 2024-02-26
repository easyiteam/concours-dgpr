<template>
  <df-default-page>
    <div class="page">
      <div>
        <div class="pt-12 bold fs-18 text-dark-gray">
          Entrez le N° d'inscription du candidat pour valider sa présence
        </div>
        <div class="mt-30 flex flex-col gap-12">
          <df-input
            v-model="candidatInfo.id"
            label="N° d'inscription"
            uppercase />
          <df-button-expand :disabled="isLoading" @click="handleSubmit">
            Suivant
          </df-button-expand>
        </div>
      </div>

      <div class="flex justify-between items-center mb-12">
        <df-button type="outline" @click="logout">
          <template v-slot:icon>
            <logout-icon />
          </template>
          Se déconnecter
        </df-button>

        <df-button @click="closeRegistrations">
          <template v-slot:icon>
            <lock-outline />
          </template>
          Clôturer
        </df-button>
      </div>
      <df-loading :isOpen="isLoading" />
      <df-modal :isOpen="isModalOpen">
        <div class="fs-14">
          <div class="my-8 text-center">
            La phase d'enregistrement des présences sera clôturer pour cette
            édition. <br />
            <br />
            Etes-vous sûr de vouloir poursuivre votre opération ?
          </div>
          <div class="flex justify-between items-center my-4">
            <df-button type="outline" @click="cancelCloseRegistrations">
              Annuler
            </df-button>

            <df-button @click="confirmCloseRegistrations">
              Confirmer
            </df-button>
          </div>
        </div>
      </df-modal>
    </div>
  </df-default-page>
</template>

<script lang="ts">
  import { defineComponent, ref } from 'vue';
  import DfInput from '../components/forms/DfInput.vue';
  import DfButtonExpand from '../components/forms/DFButtonExpand.vue';
  import DfButton from '../components/forms/DfButton.vue';
  import LogoutIcon from '../components/svgs/LogoutIcon.vue';
  import LockOutline from '../components/svgs/LockOutline.vue';
  import DfDefaultPage from '../components/utils/DfDefaultPage.vue';
  import { useRouter } from 'vue-router';
  import DfLoading from '../components/utils/DfLoading.vue';
  import DfModal from '../components/utils/DfModal.vue';
  import { usePresencePageForm } from '../hooks/usePresencePageForm';
  import { DF_STEPS, setCurrentStep } from '../libs/middleware';

  export default defineComponent({
    components: {
      DfInput,
      DfButtonExpand,
      DfButton,
      LogoutIcon,
      LockOutline,
      DfDefaultPage,
      DfLoading,
      DfModal,
    },
    setup() {
      const router = useRouter();
      const { handleSubmit, candidatInfo, isValidForm, isLoading } =
        usePresencePageForm(router);

      const isModalOpen = ref(false);

      const closeRegistrations = () => (isModalOpen.value = true);

      const cancelCloseRegistrations = () => (isModalOpen.value = false);

      const confirmCloseRegistrations = () => {
        isModalOpen.value = false;
        setCurrentStep(DF_STEPS.VALIDATION);
        router.push('/validations');
      };

      const logout = () => {
        if (confirm('Etes-vous sur de vouloir vous deconnecter ?')) {
          router.push('/');
        }
      };

      return {
        handleSubmit,
        logout,
        closeRegistrations,
        candidatInfo,
        isValidForm,
        isLoading,
        isModalOpen,
        cancelCloseRegistrations,
        confirmCloseRegistrations,
      };
    },
  });
</script>

<style lang="scss" scoped>
  .page {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 100%;
  }
</style>
