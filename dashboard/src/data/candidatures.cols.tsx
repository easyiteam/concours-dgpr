import { formatDate } from 'usual_fn';
import { Candidature } from '../api/typings';
import { DisplayStatus } from '../components/display/DisplayStatus';
import { Icon } from '../components/display/Icon';
import { UpdateOrDeleteFn } from '../helpers/typings';

export const candidaturesCols = (nextFn: UpdateOrDeleteFn<Candidature>) => [
  {
    label: 'Date',
    render: (row: Candidature) => (
      <div>{formatDate({ data: row.createdAt })}</div>
    ),
  },
  { label: "N° d'inscription", id: 'reference' },
  {
    label: 'Nom et prénom(s)',
    render: (row: Candidature) => (
      <div>
        {row.activeProfile?.value.lastname} {row.activeProfile?.value.firstname}
      </div>
    ),
  },
  // {
  //   label: 'Genre',
  //   render: (row: Candidature) => <div>{row.activeProfile?.value.gender}</div>,
  // },
  {
    label: 'Statut',
    render: (row: Candidature) => <DisplayStatus status={row.status} />,
  },
  {
    label: 'Action',
    render: (row: Candidature) => (
      <div className="flex gap-4">
        <div
          className="border rounded-lg p-1.5"
          onClick={() => nextFn(row)}>
          <Icon
            name="visibility"
            className="text-gray-500"
          />
        </div>
      </div>
    ),
  },
];
