import { ChangeEvent, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDatable } from '../../../hooks/useDatatable';
import { Input } from '../../form-fields/Input';
import { Button } from '../../buttons/Button';
import { Datatable } from '../../table/Datatable';
import { useFetch } from '../../../hooks/useFetch';
import { fieldApi } from '../../../api/field.api';
import { writingApi } from '../../../api/writing.api';
import { writingDeliberationCol } from '../../../data/writingDeliberation.col';
import { ExamStore } from '../../../store/exam.store';
import { useModal } from '../../actions/modal/constants';
import { WritingValidations } from './WritingValidations';
import { examApi } from '../../../api/exam.api';

export const WritingDeliberation = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState('writings.update');
  const props = useDatable({
    page: 1,
    limit: 10,
    event,
    callback: () =>
      writingApi.findAllResultByExam(id ?? '', {
        page: props.page,
        limit: props.limit,
        search: props.search,
      }),
  });
  const { openModal, closeModal } = useModal();

  const { data: fields, loading: fieldLoading } = useFetch({
    cb: () => fieldApi.findAllByExam(id),
    event,
  });

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

  const handleDownload = async () => {
    await writingApi.downloadRank(ExamStore.get()?.id ?? '');
  };

  const simulate = async () => {
    await writingApi.selectCandidates(
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
    openModal({
      closable: true,
      header: 'Validations en attente',
      children: (
        <WritingValidations
          onFinish={() => {
            navigate(`/exam-details/${id}/results`);
          }}
          closeModal={closeModal}
        />
      ),
    });
  };

  useEffect(() => {
    const verifyExam = async () => {
      const exam = await examApi.findOne(id ?? '');
      console.log(exam, 'exam');
      if (exam?.isClosed) {
        navigate(`/exam-details/${id}/results`);
      }
    };

    verifyExam();
  }, []);

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
            Désanonymer
          </Button>
        </div>
      </div>

      {!fieldLoading && (
        <Datatable
          noFilter
          cols={writingDeliberationCol(fields?.values ?? [])}
          onDownload={handleDownload}
          {...props}
        />
      )}
    </div>
  );
};
