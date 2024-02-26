import { useNavigate, useParams } from 'react-router-dom';
import { Center, Field } from '../../../api/typings';
import { Button } from '../../buttons/Button';
import { EditDelete } from '../../display/EditDelete';
import { UpdateOrDeleteFn } from '../../../helpers/typings';
import { writingApi } from '../../../api/writing.api';
import { useToast } from '../../providers/ToastProvider';

type Props = { row: Center; deleteFn: UpdateOrDeleteFn<Field> };

export const WritingFieldsActions = ({ row, deleteFn }: Props) => {
  const navigate = useNavigate();

  const { id } = useParams();

  const openToast = useToast();

  const generateQrCodes = async (rowId: string) => {
    console.log(rowId);
    await writingApi.generateCodes(id ?? '', rowId);
    openToast({ type: 'success', info: 'QrCodes générés avec succès' });
  };

  return (
    <div className="flex gap-3">
      <EditDelete
        row={row}
        deleteFn={deleteFn}
      />
      <Button
        onClick={() => generateQrCodes(row.id)}
        className="text-xs !bg-blue-100 !text-slate-700 border !border-slate-300 shadow-none">
        Générer les Qr Codes
      </Button>
      <Button
        onClick={async () => {
          navigate(`insert-score/${row.id}`);
        }}
        className="text-xs !bg-green-100 !text-slate-700 border !border-slate-300 shadow-none">
        Saisir les notes
      </Button>
    </div>
  );
};
