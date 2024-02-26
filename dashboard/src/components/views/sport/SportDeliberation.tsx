import { useParams } from 'react-router-dom';
import { Datatable } from '../../table/Datatable';
import { useDatable } from '../../../hooks/useDatatable';
import { sportApi } from '../../../api/sport.api';
import { ExamStore } from '../../../store/exam.store';
import { ChangeEvent, useMemo, useState } from 'react';
import { deliberationCols } from '../../../data/deliberation.cols';
import { Input } from '../../form-fields/Input';
import { Button } from '../../buttons/Button';
import { useConfirm } from '../../../hooks/useConfirm';

export const SportDeliberation = () => {
  const { id } = useParams();
  const [event, setEvent] = useState('sports.update');
  const props = useDatable({
    page: 1,
    limit: 10,
    event,
    callback: () =>
      sportApi.getByRank(id ?? '', {
        page: props.page,
        limit: props.limit,
        search: props.search,
      }),
  });
  const openConfirm = useConfirm();

  const [underN, setUnderN] = useState<number | string>('');
  const [meanUnderN, setMeanUnderN] = useState<number | string>('');

  const handleUnderNChange = (e: ChangeEvent<HTMLInputElement>) => {
    setMeanUnderN('');
    setUnderN(+e.target.value);
  };

  const handleMeanUnderNChange = (e: ChangeEvent<HTMLInputElement>) => {
    setUnderN('');
    setMeanUnderN(+e.target.value);
  };

  const centers = useMemo(() => {
    const exam = ExamStore.get();
    const profiles = exam?.participantProfileDefinition[0].value;
    const profile = profiles.find((p: { key: string }) => p.key === 'center');
    return ['Tous les centres', ...profile.validation.values.split(';')];
  }, []);

  const handleDownload = async (center: string) => {
    await sportApi.downloadRank(
      ExamStore.get()?.id ?? '',
      center === 'Tous les centres' ? {} : { center },
    );
  };

  const simulate = async () => {
    await sportApi.selectCandidates(
      ExamStore.get()?.id ?? '',
      underN ? (underN as number) : meanUnderN ? (meanUnderN as number) : 0,
      underN ? 'under-n' : 'mean-under-n',
    );
    setEvent('');
    setTimeout(() => {
      setEvent('sports.update');
    }, 100);
  };

  const closeStep = () => {
    openConfirm({
      message:
        'Etes vous sur de vouloir effectuer cette action ? Elle sera irréversible',
      onConfirm: async () => {
        await sportApi.closeStep(id ?? '');
      },
    });
  };

  return (
    <div>
      <div className=" bg-white p-4 rounded my-8 shadow-lg">
        <div className="mb-4 font-bold">Simulation</div>
        <div className="flex gap-8">
          <Input
            label="Choisir n candidat"
            placeholder="Valeur de n"
            type="number"
            min={0}
            value={underN}
            onChange={handleUnderNChange}
          />
          <Input
            label="Choisir les candidats dont la moyenne est au minimum n"
            placeholder="Valeur de n"
            type="number"
            min={0}
            max={20}
            value={meanUnderN}
            onChange={handleMeanUnderNChange}
          />
        </div>
        <div className="mt-8 flex justify-between">
          <Button
            onClick={simulate}
            className="text-sm">
            Simuler
          </Button>
          <Button
            onClick={closeStep}
            className="text-sm !bg-red-500">
            Clôturer la phase sportive
          </Button>
        </div>
      </div>

      <Datatable
        noFilter
        cols={deliberationCols}
        downloadContent={
          <div className="px-2 py-1 shadow-lg">
            {centers.map((center: string) => (
              <div
                key={center}
                onClick={() => handleDownload(center)}
                className="py-2 text-xs hover:bg-gray-100 px-2 w-full cursor-pointer rounded">
                {center}
              </div>
            ))}
          </div>
        }
        {...props}
      />
    </div>
  );
};
