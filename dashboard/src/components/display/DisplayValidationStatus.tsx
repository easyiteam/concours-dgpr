import { ValidationStatus } from '../../api/typings';

const statusMapping = {
  [ValidationStatus.PENDING]: {
    css: 'border border-orange-500 text-orange-500',
    label: 'En cours',
  },
  [ValidationStatus.SUCCESS]: {
    css: 'border border-green-500 text-green-500',
    label: 'Validé',
  },
};

type Props = {
  status: ValidationStatus;
};

export const DisplayValidationStatus = ({ status }: Props) => {
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
