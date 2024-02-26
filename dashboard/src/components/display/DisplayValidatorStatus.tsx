import { ValidatorStatus } from '../../api/typings';

const statusMapping = {
  [ValidatorStatus.ACTIVATING]: {
    css: 'border border-orange-500 text-orange-500',
    label: 'En cours',
  },
  [ValidatorStatus.ACTIVE]: {
    css: 'border border-green-500 text-green-500',
    label: 'Activé',
  },
  [ValidatorStatus.REVOCATING]: {
    css: 'border border-pink-500 text-pink-500',
    label: 'Révocation en cours',
  },
  [ValidatorStatus.REVOCATED]: {
    css: 'border border-red-500 text-red-500',
    label: 'Révoqué',
  },
};

type Props = {
  status: ValidatorStatus;
};

export const DisplayValidatorStatus = ({ status }: Props) => {
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
