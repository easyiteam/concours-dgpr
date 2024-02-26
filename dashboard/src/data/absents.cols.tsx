import { Candidature } from '../api/typings';

export const absentsCols = [
  {
    label: "N° d'inscription",
    render: (row: Candidature) => <div>{row.reference}</div>,
  },
  {
    label: 'Centre',
    render: (row: Candidature) => <div>{row.activeProfile?.value.center}</div>,
  },
  {
    label: 'Nom et prénom(s)',
    render: (row: Candidature) => (
      <div>
        {row.activeProfile?.value.lastname} {row.activeProfile?.value.firstname}
      </div>
    ),
  },
  {
    label: 'Genre',
    render: (row: Candidature) => <div>{row.activeProfile?.value.gender}</div>,
  },
];
