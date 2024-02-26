import { useParams } from 'react-router-dom';
import { useDatable } from '../../hooks/useDatatable';
import { writingApi } from '../../api/writing.api';
import { useFetch } from '../../hooks/useFetch';
import { fieldApi } from '../../api/field.api';
import { ExamStore } from '../../store/exam.store';
import { Datatable } from '../../components/table/Datatable';
import { writingResultCol } from '../../data/writingResult.col';
import { H1 } from '../../components/display/H1';
import { useEffect } from 'react';
import { examApi } from '../../api/exam.api';

export const WritingResults = () => {
  const { id } = useParams();
  const props = useDatable({
    page: 1,
    limit: 10,
    event: 'writings.update',
    callback: () =>
      writingApi.findAllResultByExam(id ?? '', {
        page: props.page,
        limit: props.limit,
        search: props.search,
      }),
  });

  const { data: fields, loading: fieldLoading } = useFetch({
    cb: () => fieldApi.findAllByExam(id),
    event: 'writings.update',
  });

  const handleDownload = async () => {
    await writingApi.downloadRankFinal(ExamStore.get()?.id ?? '');
  };

  useEffect(() => {
    const closeExam = async () => {
      await examApi.close(id ?? '');
    };

    closeExam();
  }, []);

  return (
    <div>
      <div className="mb-8">
        <H1> Résultats</H1>
      </div>

      {!fieldLoading && (
        <Datatable
          noFilter
          cols={writingResultCol(fields?.values ?? [])}
          onDownload={handleDownload}
          {...props}
        />
      )}
    </div>
  );
};
