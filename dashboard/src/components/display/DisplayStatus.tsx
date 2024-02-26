import { CandidatureStatus } from '../../api/enums';

const statusMapping = {
  [CandidatureStatus.INDETERMINATE]: {
    css: 'border border-blue-500 text-blue-500',
    label: 'Nouveau',
  },
  [CandidatureStatus.ACCEPTED]: {
    css: 'border border-green-500 text-green-500',
    label: 'Accepté',
  },
  [CandidatureStatus.REJECTED]: {
    css: 'border border-red-500 text-red-500',
    label: 'Rejeté',
  },
};

type Props = {
  status: CandidatureStatus;
};

export const DisplayStatus = ({ status }: Props) => {
  return (
    <div
      className={[
        'w-fit rounded-lg px-2 py-1 text-xs',
        statusMapping[status].css,
      ].join(' ')}>
      {statusMapping[status].label}
    </div>
  );
};
