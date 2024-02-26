<template>
  <df-default-page>
    <div class="page">
      <div>
        <div class="pt-12 bold fs-18 text-dark-gray text-center">
          Enregister la performance d'un candidat
        </div>
        <div class="mt-30 flex flex-col gap-12">
          <df-input
            label="N° d'inscription du candidat"
            uppercase
            v-model="candidatInfo.reference" />

          <df-select
            @change="(v) => (candidatInfo.type = v.id)"
            label="Type de performance"
            :value="candidatInfo.type"
            :data="performanceTypes" />

          <df-input
            label="Performance du candidat"
            type="phone"
            v-model="candidatInfo.value" />

          <df-button-expand :disabled="isLoading" @submit="onSubmit">
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
            La phase d'acceptation des candidats sera clôturer pour cette
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
      <df-modal :isOpen="isUpdateModalOpen">
        <div class="fs-14">
          <div class="my-8 text-center">
            La performance de ce candidat a déjà été enregistrée. <br />
            <br />
            Voulez-vous prendre en compte la nouvelle note ?
          </div>
          <div class="flex justify-between items-center my-4">
            <df-button type="outline" @click="cancelCloseUpdate">
              Annuler
            </df-button>

            <df-button @click="confirmUpdate"> Confirmer </df-button>
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
  import { useValidationPageForm } from '../hooks/useValidationPageForm';
  import DfLoading from '../components/utils/DfLoading.vue';
  import DfModal from '../components/utils/DfModal.vue';
  import DfSelect from '@/components/forms/DfSelect.vue';
  import { DF_STEPS, setCurrentStep } from '../libs/middleware';
  import { toastController } from '@ionic/vue';

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
      DfSelect,
    },
    setup() {
      const router = useRouter();

      const {
        handleSubmit,
        candidatInfo,
        isValidForm,
        isLoading,
        updateProfile,
      } = useValidationPageForm(router);

      const openToast = async () => {
        const toast = await toastController.create({
          message: "Numéro d'inscription incorrect",
          duration: 5000,
        });
        return toast.present();
      };

      const isModalOpen = ref(false);
      const isUpdateModalOpen = ref(false);
      const tempData = ref();

      const closeRegistrations = () => {
        isModalOpen.value = true;
      };

      const cancelCloseRegistrations = () => (isModalOpen.value = false);
      const cancelCloseUpdate = () => (isUpdateModalOpen.value = false);

      const confirmCloseRegistrations = () => {
        isModalOpen.value = false;
        setCurrentStep(DF_STEPS.CLOSED);
        router.push('/process-end');
      };

      const onSubmit = async () => {
        const result = await handleSubmit();

        if (result && !result.isOk) {
          if (result.statusCode === 409) {
            isUpdateModalOpen.value = true;
            tempData.value = result.data;
            return;
          }
          openToast();
        }
      };

      const confirmUpdate = async () => {
        delete tempData.value.data.reference;
        isUpdateModalOpen.value = false;
        updateProfile(tempData.value);
      };

      const logout = () => {
        if (confirm('Etes-vous sur de vouloir vous deconnecter ?')) {
          router.push('/');
        }
      };

      return {
        logout,
        closeRegistrations,
        onSubmit,
        candidatInfo,
        isValidForm,
        isLoading,
        cancelCloseRegistrations,
        confirmCloseRegistrations,
        cancelCloseUpdate,
        confirmUpdate,
        isUpdateModalOpen,
        isModalOpen,
        performanceTypes: [
          { label: 'Vitesse', id: 'RACE' },
          { label: 'Endurance', id: 'RACE_1000' },
          { label: 'Grimpé', id: 'CLIMBING' },
        ],
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
