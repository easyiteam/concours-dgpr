import { useParams } from 'react-router-dom';
import { presenceCols } from '../../../data/presence.cols';
import { Datatable } from '../../table/Datatable';
import { useDatable } from '../../../hooks/useDatatable';
import { sportApi } from '../../../api/sport.api';

export const SportPresents = () => {
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

  return (
    <div>
      <Datatable
        noFilter
        cols={presenceCols}
        noDownload
        {...props}
      />
    </div>
  );
};
