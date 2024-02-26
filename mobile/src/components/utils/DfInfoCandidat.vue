<template>
  <div>
    <h1 class="text-dark fs-18 bold">Informations du candidat</h1>

    <div class="photo my-12"></div>

    <div class="border-light text-center py-8" v-if="type === 'presence'">
      Numéro d'inscription : <b>{{ info?.number }}</b>
    </div>

    <df-title-and-label title="Nom & Prénom (s)" :label="info?.fullName" />
    <df-title-and-label
      title="Date et lieu de naissance"
      :label="info?.birth" />

    <div class="mb-16" v-if="type !== 'presence'">
      <div class="text-dark fs-16 semi-bold mb-4">Performances</div>
      <table>
        <thead>
          <tr>
            <th>Épreuve</th>
            <th>Performance</th>
            <th>Note</th>
          </tr>
        </thead>
        <tbody>
          <tr
            class="fs-14 mb-4"
            v-for="perf in info?.performances"
            :key="perf.id">
            <td>{{ perfomanceMapping[perf.type] }}</td>
            <td>{{ perf.value }}</td>
            <td>{{ perf.score }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <df-button-expand v-if="type === 'presence'" @click="confirm">
      Valider la présence
    </df-button-expand>
    <df-button-expand v-else @click="confirm"> Continuer </df-button-expand>
  </div>
</template>

<script lang="ts">
  export enum PerformanceType {
    WomanRace80Meters = 'WomanRace80Meters',
    WomanRace800Meters = 'WomanRace800Meters',
    ManRace100Meters = 'ManRace100Meters',
    ManRace1000Meters = 'ManRace1000Meters',
    WomanClimbing = 'WomanClimbing',
    ManClimbing = 'ManClimbing',
  }

  export interface ICandidatInfo {
    number: string;
    identityNumber: string;
    fullName: string;
    birth: string;
    performances: {
      id: string;
      type: PerformanceType;
      score: number;
      value: string;
    }[];
  }

  import { defineComponent, PropType } from 'vue';
  import DfTitleAndLabel from '../utils/DfTitleAndLabel.vue';
  import DfButtonExpand from '../forms/DFButtonExpand.vue';

  export default defineComponent({
    components: {
      DfTitleAndLabel,
      DfButtonExpand,
    },
    props: {
      info: Object as PropType<ICandidatInfo>,
      type: {
        type: String,
        default: 'presence',
      },
    },
    setup(_, { emit }) {
      return {
        confirm: () => emit('confirm'),
        perfomanceMapping: {
          [PerformanceType.WomanRace80Meters]: 'Course (80 mètres)',
          [PerformanceType.WomanRace800Meters]: 'Endurance (800 mètres)',
          [PerformanceType.ManRace100Meters]: 'Course (100 mètres)',
          [PerformanceType.ManRace1000Meters]: 'Endurance (1000 mètres)',
          [PerformanceType.WomanClimbing]: 'Grimpé (dames)',
          [PerformanceType.ManClimbing]: 'Grimpé (hommes)',
        },
      };
    },
  });
</script>
