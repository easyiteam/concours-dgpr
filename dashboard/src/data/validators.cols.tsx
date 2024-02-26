import { Validator } from '../api/typings';
import { DisplayValidatorStatus } from '../components/display/DisplayValidatorStatus';
import { EditDelete } from '../components/display/EditDelete';
import { UpdateOrDeleteFn } from '../helpers/typings';

export const validatorsCols = (deleteFn: UpdateOrDeleteFn<Validator>) => [
  { label: 'Email', id: 'email' },
  {
    label: 'Nom et prénom(s)',
    id: 'fullname',
  },
  {
    label: 'Fonction',
    id: 'fonction',
  },
  {
    label: 'Statut',
    render: (row: Validator) => <DisplayValidatorStatus status={row.status} />,
  },
  {
    label: 'Action',
    render: (row: Validator) => (
      <EditDelete
        row={row}
        deleteFn={deleteFn}
      />
    ),
  },
];
