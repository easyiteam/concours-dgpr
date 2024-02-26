import { Field } from '../api/typings';
import { WritingFieldsActions } from '../components/views/writing/WritingFieldsActions';
import { UpdateOrDeleteFn } from '../helpers/typings';

export const fieldsCols = (deleteFn: UpdateOrDeleteFn<Field>) => [
  { label: 'Code de la matière', id: 'code' },
  { label: 'Libellé de la matière', id: 'label' },
  { label: 'Coefficient', id: 'coefficient' },
  {
    label: 'Action',
    render: (row: Field) => (
      <WritingFieldsActions
        row={row}
        deleteFn={deleteFn}
      />
    ),
  },
];
