import { useParams } from 'react-router-dom';
import { Datatable } from '../../table/Datatable';
import { useDatable } from '../../../hooks/useDatatable';
import { sportApi } from '../../../api/sport.api';
import { absentsCols } from '../../../data/absents.cols';

export const SportAbsents = () => {
  const { id } = useParams();
  const props = useDatable({
    page: 1,
    limit: 10,
    event: 'sports.update',
    callback: () =>
      sportApi.findAllAbsentsByExam(id ?? '', {
        page: props.page,
        limit: props.limit,
        search: props.search,
      }),
  });

  return (
    <div>
      <Datatable
        noFilter
        cols={absentsCols}
        noDownload
        {...props}
      />
    </div>
  );
};
