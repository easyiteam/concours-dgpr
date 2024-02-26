<template>
  <df-default-page>
    <df-info-candidat :type="type" :info="data" @confirm="confirm" />
  </df-default-page>
</template>

<script lang="ts">
  import { onIonViewWillEnter, onIonViewWillLeave } from '@ionic/vue';
  import { defineComponent, ref } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import DfDefaultPage from '../components/utils/DfDefaultPage.vue';
  import DfInfoCandidat from '../components/utils/DfInfoCandidat.vue';
  import http from '../http';
  import { formatDate } from '@/environment';

  export default defineComponent({
    components: {
      DfDefaultPage,
      DfInfoCandidat,
    },
    setup() {
      const { type, id } = useRoute().params;
      const router = useRouter();
      const data = ref({
        number: '',
        identityNumber: '',
        fullName: '',
        birth: '',
        performances: [],
      });

      onIonViewWillEnter(async () => {
        console.log(http, 'http');
        const response = await http.get('sports/' + id);
        console.log(response);
        data.value = {
          number: response.candidature.reference,
          identityNumber: '',
          fullName: `${response.candidature.activeProfile.value.lastname} ${response.candidature.activeProfile.value.firstname}`,
          birth: formatDate(response.candidature.activeProfile.value.bithday),
          performances: response.performances ?? [],
        };
        console.log(data, data);
      });

      onIonViewWillLeave(() => {
        data.value = {
          number: '',
          identityNumber: '',
          fullName: '',
          birth: '',
          performances: [],
        };
      });

      const confirm = () => {
        router.push(type === 'presence' ? '/presences' : '/validations');
      };

      return {
        confirm,
        data,
        type: type as string,
      };
    },
  });
</script>
