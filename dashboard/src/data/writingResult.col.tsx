import { Field, Score, WritingProfile } from '../api/typings';
import { DisplayStatus } from '../components/display/DisplayStatus';

export const writingResultCol = (fields: Field[]) => {
  const byFields: {
    label: string;
    render: (row: WritingProfile) => JSX.Element;
  }[] = [
    {
      label: "N° d'inscription",
      render: (row: WritingProfile) => <div>{row.candidature.reference}</div>,
    },
    {
      label: 'Nom et prénom(s)',
      render: (row: WritingProfile) => (
        <div>
          {row.candidature.activeProfile.value.lastname}{' '}
          {row.candidature.activeProfile.value.firstname}
        </div>
      ),
    },
  ];

  fields.forEach((field) => {
    byFields.push({
      label: `Code (${field.code})`,
      render: (row: WritingProfile) => (
        <div>{getScore(row.scores ?? [], field.id)?.code ?? ''}</div>
      ),
    });
    byFields.push({
      label: `Note (${field.code})`,
      render: (row: WritingProfile) => (
        <div>{getScore(row.scores ?? [], field.id)?.value ?? ''}</div>
      ),
    });
  });

  return [
    ...byFields,
    {
      label: 'Total',
      render: (row: WritingProfile) => <div>{row.total}</div>,
    },
    {
      label: 'Moy',
      render: (row: WritingProfile) => <div>{row.mean}</div>,
    },
    {
      label: 'Status',
      render: (row: WritingProfile) => <DisplayStatus status={row.status} />,
    },
  ];
};

function getScore(scores: Score[], fieldId: string) {
  return scores.find((score) => score.fieldId === fieldId);
}
