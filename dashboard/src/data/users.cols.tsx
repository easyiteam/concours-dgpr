import { Auth } from '../api/typings';
import { EditDelete } from '../components/display/EditDelete';
import { UpdateOrDeleteFn } from '../helpers/typings';

export const usersCols = (deleteFn: UpdateOrDeleteFn<Auth>) => [
  { label: 'Email', id: 'email' },
  {
    label: 'Nom et prénom(s)',
    id: 'fullname',
  },
  { label: 'Rôle', id: 'role' },
  {
    label: 'Activation',
    render: (row: Auth) => (
      <div
        className={[
          'border rounded-lg py-1 px-2 w-fit',
          row.isVerified
            ? 'border-green-500 text-green-500'
            : 'border-orange-400 text-orange-600',
        ].join(' ')}>
        {row.isVerified ? 'Activé' : 'En attente'}
      </div>
    ),
  },
  {
    label: 'Action',
    render: (row: Auth) => (
      <EditDelete
        row={row}
        deleteFn={deleteFn}
      />
    ),
  },
];
