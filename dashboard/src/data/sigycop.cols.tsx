import { SigycopProfile } from '../api/typings';

export const sigycopCols = [
  {
    label: "N° d'inscription",
    render: (row: SigycopProfile) => <div>{row.candidature.reference}</div>,
  },
  {
    label: 'Nom et prénom(s)',
    render: (row: SigycopProfile) => (
      <div>
        {row.candidature.activeProfile?.value.lastname}{' '}
        {row.candidature.activeProfile?.value.firstname}
      </div>
    ),
  },
  {
    label: 'Centre',
    render: (row: SigycopProfile) => <div>{row.center?.label}</div>,
  },
  { label: 'S', render: (row: SigycopProfile) => <div>{row.s}</div> },
  { label: 'I', render: (row: SigycopProfile) => <div>{row.i}</div> },
  { label: 'G', render: (row: SigycopProfile) => <div>{row.g}</div> },
  { label: 'Y', render: (row: SigycopProfile) => <div>{row.y}</div> },
  { label: 'C', render: (row: SigycopProfile) => <div>{row.c}</div> },
  { label: 'O', render: (row: SigycopProfile) => <div>{row.o}</div> },
  { label: 'P', render: (row: SigycopProfile) => <div>{row.p}</div> },
  {
    label: 'Résultat',
    render: (row: SigycopProfile) => (
      <div className={row.apte ? 'text-green-600' : 'text-red-600'}>
        {row.apte ? 'Apte' : `Inapte (${row.failedAxes.join(', ')})`}
      </div>
    ),
  },
];
