import { Section } from '../pages/exams/ParticipantProfileDefinition';

export const defaultParticipantProfile: Section[] = [
  {
    label: 'INFORMATIONS PERSONNELLES',
    value: [
      {
        key: 'lastname',
        label: 'NOM',
        type: 'text',
        validation: { required: true },
      },
      {
        key: 'firstname',
        label: 'PRENOM(S)',
        type: 'text',
        validation: { required: true },
      },
      {
        key: 'gender',
        label: 'GENRE',
        type: 'choice',
        validation: { values: 'HOMME;FEMME', required: true },
      },
      {
        key: 'phone',
        label: 'TELEPHONE',
        type: 'text',
        validation: { required: true },
      },
      {
        key: 'email',
        label: 'EMAIL',
        type: 'email',
        validation: { required: true },
      },
      {
        key: 'bithday',
        label: 'DATE DE NAISSANCE',
        type: 'date',
        validation: { required: true },
      },
      {
        key: 'birthPlace',
        label: 'LIEU DE NAISSANCE',
        type: 'text',
        validation: { required: true },
      },
      {
        key: 'institute',
        label: 'INSTITUT/ECOLE AYANT DELIVRE LE DIPLOME',
        type: 'text',
        validation: { required: true },
      },
      {
        key: 'address',
        label: 'ADRESSE',
        type: 'text',
        validation: { required: true },
      },
      {
        key: 'center',
        label: 'CENTRE DE COMPOSITION',
        type: 'choice',
        validation: {
          required: true,
          values: 'Parakou;Natitingou;Abomey;Lokossa;Porto-Novo',
        },
      },
    ],
  },
  {
    label: 'DOCUMENTS',
    value: [
      {
        key: 'birth_act',
        label: 'ACTE DE NAISSANCE',
        type: 'file',
        validation: { required: true },
      },
      {
        key: 'nationality_act',
        label: 'CERTIFICAT DE NATIONALITÉ',
        type: 'file',
        validation: { required: true },
      },
      {
        key: 'low_act',
        label: 'CASIER JUDICIAIRE',
        type: 'file',
        validation: { required: true },
      },
      {
        key: 'diplom',
        label: 'DIPLOME',
        type: 'file',
        validation: { required: true },
      },
      {
        key: 'health_act',
        label: "CERTIFICAT MÉDICAL D'APTITUDE PHYSIQUE",
        type: 'file',
        validation: { required: true },
      },
      {
        key: 'id_card',
        label: "CARTE D'IDENTITE / PASSEPORT",
        type: 'file',
        validation: { required: true },
      },
      {
        key: 'military_act',
        label: 'CERTIFICAT DE POSITION MILITAIRE',
        type: 'file',
        validation: { required: false },
      },
    ],
  },
  {
    label: "DROIT D'INSCRIPTION",
    value: [
      {
        key: 'paiement',
        label: '',
        type: 'paiement',
        validation: {
          amount: 10000,
          apiKey: 'pk_live_VaSz8KbAudBy7lTaWFLD8tpG',
        },
      },
    ],
  },
];
