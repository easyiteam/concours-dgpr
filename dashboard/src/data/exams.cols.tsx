import { Exam } from '../api/typings';
import { EditDelete } from '../components/display/EditDelete';
import { Icon } from '../components/display/Icon';
import { UpdateOrDeleteFn } from '../helpers/typings';

export const examCols = (
  nextFn: UpdateOrDeleteFn<Exam>,
  updateFn: UpdateOrDeleteFn<Exam>,
  deleteFn: UpdateOrDeleteFn<Exam>,
) => [
  {
    label: 'Libellé du concours',
    id: 'label',
  },
  {
    label: 'Nom court',
    id: 'shortName',
  },
  {
    label: 'Action',
    render: (row: Exam) => (
      <div className="flex gap-4">
        <div
          className="border rounded-lg p-1.5"
          onClick={() => nextFn(row)}>
          <Icon
            name="visibility"
            className="text-gray-500"
          />
        </div>
        <EditDelete
          row={row}
          updateFn={updateFn}
        />
        <EditDelete
          row={row}
          deleteFn={deleteFn}
        />
      </div>
    ),
  },
];
