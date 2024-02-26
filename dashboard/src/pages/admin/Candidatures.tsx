import { useNavigate, useParams } from 'react-router-dom';
import { candidatureApi } from '../../api/candidature.api';
import { Datatable } from '../../components/table/Datatable';
import { candidaturesCols } from '../../data/candidatures.cols';
import { useDatable } from '../../hooks/useDatatable';
import { Candidature } from '../../api/typings';
import { H1 } from '../../components/display/H1';
import { Tabs } from '../../components/display/Tabs';
import { CandidatureStatus } from '../../api/enums';
import { ExamStore } from '../../store/exam.store';
import { useMemo } from 'react';
import { Button } from '../../components/buttons/Button';

export const Candidatures = () => {
  const { id } = useParams();
  const props = useDatable({
    page: 1,
    limit: 10,
    event: 'candidatures.update',
    callback: () =>
      candidatureApi.findAllByExam(id ?? '', {
        page: props.page,
        limit: props.limit,
        search: props.search,
        status: props.status as CandidatureStatus,
      }),
  });
  const navigate = useNavigate();

  const centers = useMemo(() => {
    const exam = ExamStore.get();
    const profiles = exam?.participantProfileDefinition[0].value;
    const profile = profiles.find((p: { key: string }) => p.key === 'center');
    console.log(profile);
    return profile?.validation.values.split(';') ?? '';
  }, []);
  console.log(centers);

  const next = (row: Candidature) => {
    navigate(`/exam-details/${id}/candidature/${row.id}`);
  };

  // const handleDownload = async (center: string) => {
  //   await candidatureApi.download(ExamStore.get()?.id ?? '', {
  //     status:
  //       (props.status as CandidatureStatus) ?? CandidatureStatus.INDETERMINATE,
  //     center,
  //   });
  // };

  const gotoWritingStep = async () => {
    const isOk = await candidatureApi.gotoWritingStep(id ?? '');
    if (!isOk)
      alert(
        'Vous devez créer un centre de composition avant de passer à la phase écrite',
      );
  };

  return (
    <div className="pt-4">
      <div className="flex justify-between items-center">
        <H1>Liste des candidatures</H1>
        <Button
          onClick={gotoWritingStep}
          className="text-sm">
          Passer à la phase écrite
        </Button>
      </div>

      <div className="mt-8">
        <Tabs
          values={[
            { id: 'ALL', label: 'Tous les candidats' },
            { id: CandidatureStatus.INDETERMINATE as string, label: 'Nouveau' },
            { id: CandidatureStatus.ACCEPTED as string, label: 'Acceptés' },
            { id: CandidatureStatus.REJECTED as string, label: 'Rejetés' },
          ]}
          onTabChanged={({ id }) => {
            props.onStatusChanged(id === 'ALL' ? undefined : id);
          }}>
          <Datatable
            noFilter
            cols={candidaturesCols(next)}
            // downloadContent={
            //   <div className="px-2 py-1 shadow-lg">
            //     {centers.map((center: string) => (
            //       <div
            //         key={center}
            //         onClick={() => handleDownload(center)}
            //         className="py-2 text-xs hover:bg-gray-100 px-2 w-full cursor-pointer rounded">
            //         {center}
            //       </div>
            //     ))}
            //   </div>
            // }
            {...props}
          />
        </Tabs>
      </div>
    </div>
  );
};
