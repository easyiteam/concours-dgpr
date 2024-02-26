import { computed, ref } from 'vue';
import http from '../http';
import { toastController } from '@ionic/vue';
import { Router } from 'vue-router';

export function usePresencePageForm(router: Router) {
  const candidatInfo = ref({
    id: '',
  });
  const isLoading = ref(false);

  const handleSubmit = async () => {
    isLoading.value = true;
    const response = await http.post(`sports`, {
      reference: candidatInfo.value.id,
    });
    isLoading.value = false;
    candidatInfo.value.id = '';
    if (response.statusCode > 399) {
      await openToast();
      return;
    }
    router.push('/details/presence/' + response.id);
  };

  const openToast = async () => {
    const toast = await toastController.create({
      message:
        "Le dossier du candidat n'a pas été accepté ou son numéro d'inscription est incorrect",
      duration: 10000,
    });
    return toast.present();
  };

  const isValidForm = computed(() => {
    return candidatInfo.value.id.length > 0;
  });

  return {
    handleSubmit,
    candidatInfo,
    isValidForm,
    isLoading,
  };
}
