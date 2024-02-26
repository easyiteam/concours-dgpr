import { Center, WritingProfile } from '../api/typings';
import { WritingCenterActions } from '../components/views/writing/WritingCenterActions';

export const writingCols = [
  {
    label: "N° d'inscription",
    render: (row: WritingProfile) => <div>{row.candidature.reference}</div>,
  },
  {
    label: 'Centre',
    render: (row: WritingProfile) => <div>{row.center.label}</div>,
  },
  {
    label: 'Nom et prénom(s)',
    render: (row: WritingProfile) => (
      <div>
        {row.candidature.activeProfile?.value.lastname}{' '}
        {row.candidature.activeProfile?.value.firstname}
      </div>
    ),
  },
  {
    label: 'Genre',
    render: (row: WritingProfile) => (
      <div>{row.candidature.activeProfile?.value.gender}</div>
    ),
  },
];

export const centerCols = (id: string) => [
  { label: 'Libellé du centre', id: 'label' },
  {
    label: 'Actions',
    render: (row: Center) => (
      <WritingCenterActions
        row={row}
        id={id}
      />
    ),
  },
];
