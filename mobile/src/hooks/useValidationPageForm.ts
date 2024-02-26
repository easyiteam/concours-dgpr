import { computed, onMounted, ref } from 'vue';
import http from '../http';
import { Router } from 'vue-router';

export function useValidationPageForm(router: Router) {
  const candidatInfo = ref({
    reference: '',
    type: '',
    value: '',
  });
  const isLoading = ref(false);

  onMounted(() => {
    setTimeout(() => {
      candidatInfo.value.type = 'WomanRace80Meters';
    }, 1000);
    setTimeout(() => {
      candidatInfo.value.type = 'WomanRace800Meters';
    }, 3000);
  });

  const handleSubmit = async () => {
    isLoading.value = true;
    const response = await http.post(`sports/performance/`, candidatInfo.value);
    isLoading.value = false;
    if (response.statusCode > 399) {
      return {
        isOk: false,
        statusCode: response.statusCode,
        data: { id: response.id, data: candidatInfo.value },
      };
    }
    candidatInfo.value = {
      reference: '',
      type: candidatInfo.value.type,
      value: '',
    };

    router.push('/details/validation/' + response.id);
  };

  const updateProfile = async (value: { id: string; data: any }) => {
    isLoading.value = true;
    const response = await http.patch(
      `sports/performance/${value.id}`,
      value.data,
    );
    isLoading.value = false;
    candidatInfo.value = {
      reference: '',
      type: candidatInfo.value.type,
      value: '',
    };
    router.push('/details/validation/' + response.sportProfileId);
  };

  const isValidForm = computed(() => {
    return (
      candidatInfo.value.reference &&
      candidatInfo.value.type &&
      candidatInfo.value.value
    );
  });

  return {
    handleSubmit,
    candidatInfo,
    isValidForm,
    isLoading,
    updateProfile,
  };
}
