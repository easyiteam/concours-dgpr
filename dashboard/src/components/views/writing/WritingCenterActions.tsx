import { useNavigate } from 'react-router-dom';
import { Center } from '../../../api/typings';
import { writingApi } from '../../../api/writing.api';
import { Button } from '../../buttons/Button';
import { examApi } from '../../../api/exam.api';

type Props = { row: Center; id: string };

export const WritingCenterActions = ({ row, id }: Props) => {
  const navigate = useNavigate();

  return (
    <div className="flex gap-3">
      <Button
        onClick={async () => {
          const nbr = prompt('Nombre de candidats par salle ?');
          await writingApi.makeRepartition({
            examId: id,
            centerId: row.id,
            n: +(nbr ?? '20'),
          });
        }}
        className="text-xs !bg-gray-700">
        Répartir par salle
      </Button>
      <Button
        onClick={async () => {
          navigate('repartition/' + row.id);
        }}
        className="text-xs !bg-gray-100 !text-slate-700 border !border-slate-300 shadow-none">
        Voir les répartitions
      </Button>
      <Button
        onClick={async () => {
          if (confirm('Etes-vous sûr de vouloir supprimer ce centre ?')) {
            await examApi.deleteCenter(row.id);
          }
        }}
        className="text-xs !bg-red-100 !text-red-700 border !border-red-300 shadow-none">
        Supprimer le centre
      </Button>
    </div>
  );
};
