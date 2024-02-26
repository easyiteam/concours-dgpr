import { formatDate } from 'usual_fn';
import { Candidature } from '../api/typings';

export const presenceCols = [
  {
    label: "N° d'inscription",
    render: (row: { candidature: Candidature }) => (
      <div>{row.candidature.reference}</div>
    ),
  },
  {
    label: 'Centre',
    render: (row: { candidature: Candidature }) => (
      <div>{row.candidature.activeProfile?.value.center}</div>
    ),
  },
  {
    label: 'Nom et prénom(s)',
    render: (row: { candidature: Candidature }) => (
      <div>
        {row.candidature.activeProfile?.value.lastname}{' '}
        {row.candidature.activeProfile?.value.firstname}
      </div>
    ),
  },
  {
    label: 'Genre',
    render: (row: { candidature: Candidature }) => (
      <div>{row.candidature.activeProfile?.value.gender}</div>
    ),
  },
  {
    label: 'Enregistré à',
    render: (row: { candidature: Candidature; createdAt: string }) => (
      <div>{formatDate({ data: row.createdAt })}</div>
    ),
  },
];
