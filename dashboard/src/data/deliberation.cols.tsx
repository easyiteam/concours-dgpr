import { Profile } from '../api/typings';
import { DisplayStatus } from '../components/display/DisplayStatus';

export const deliberationCols = [
  {
    label: 'Rang',
    render: (row: Profile) => <div>{row.rank}</div>,
  },
  {
    label: "N° d'inscription",
    render: (row: Profile) => <div>{row.candidature.reference}</div>,
  },
  {
    label: 'Centre',
    render: (row: Profile) => (
      <div>{row.candidature.activeProfile?.value.center}</div>
    ),
  },
  {
    label: 'Nom et prénom(s)',
    render: (row: Profile) => (
      <div>
        {row.candidature.activeProfile?.value.lastname}{' '}
        {row.candidature.activeProfile?.value.firstname}
      </div>
    ),
  },
  {
    label: 'Genre',
    render: (row: Profile) => (
      <div>{row.candidature.activeProfile?.value.gender}</div>
    ),
  },
  {
    label: 'Total',
    render: (row: Profile) => <div>{row.total}</div>,
  },
  {
    label: 'Moy',
    render: (row: Profile) => <div>{row.mean}</div>,
  },
  {
    label: 'Status',
    render: (row: Profile) => <DisplayStatus status={row.status} />,
  },
];
