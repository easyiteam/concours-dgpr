import { useParams } from 'react-router-dom';
import { useDatable } from '../../../hooks/useDatatable';
import { writingApi } from '../../../api/writing.api';
import { Datatable } from '../../table/Datatable';
import { writingCols } from '../../../data/writing.cols';

export const WritingCandidates = () => {
  const { id } = useParams();
  const props = useDatable({
    page: 1,
    limit: 10,
    event: 'writings.update',
    callback: () =>
      writingApi.findAllByExam(id ?? '', {
        page: props.page,
        limit: props.limit,
        search: props.search,
      }),
  });

  return (
    <div>
      <Datatable
        noFilter
        cols={writingCols}
        noDownload
        {...props}
      />
    </div>
  );
};
