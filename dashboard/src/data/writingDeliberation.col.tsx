import { Field, Score, WritingProfile } from '../api/typings';
import { DisplayStatus } from '../components/display/DisplayStatus';

export const writingDeliberationCol = (fields: Field[]) => {
  const byFields: {
    label: string;
    render: (row: WritingProfile) => JSX.Element;
  }[] = [];

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
    byFields.push({
      label: `Coef (${field.code})`,
      render: () => <div>{field.coefficient}</div>,
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
