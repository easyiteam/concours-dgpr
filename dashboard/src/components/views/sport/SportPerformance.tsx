import { useParams } from 'react-router-dom';
import { Datatable } from '../../table/Datatable';
import { useDatable } from '../../../hooks/useDatatable';
import { sportApi } from '../../../api/sport.api';
import { performancesCols } from '../../../data/performances.cols';
import { ExamStore } from '../../../store/exam.store';
import { useMemo } from 'react';

export const SportPerformance = () => {
  const { id } = useParams();
  const props = useDatable({
    page: 1,
    limit: 10,
    event: 'sports.update',
    callback: () =>
      sportApi.findAllByExam(id ?? '', {
        page: props.page,
        limit: props.limit,
        search: props.search,
      }),
  });

  const centers = useMemo(() => {
    const exam = ExamStore.get();
    const profiles = exam?.participantProfileDefinition[0].value;
    const profile = profiles.find((p: { key: string }) => p.key === 'center');
    console.log(profile);
    return ['Tous les centres', ...profile.validation.values.split(';')];
  }, []);

  const handleDownload = async (center: string) => {
    await sportApi.download(
      ExamStore.get()?.id ?? '',
      center === 'Tous les centres' ? {} : { center },
    );
  };

  return (
    <div>
      <Datatable
        noFilter
        cols={performancesCols}
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
