import { useParams } from 'react-router-dom';
import { useDatable } from '../../../hooks/useDatatable';
import { sigycopApi } from '../../../api/sigycop.api';
import { Datatable } from '../../table/Datatable';
import { sigycopCols } from '../../../data/sigycop.cols';

export const SigycopResults = () => {
  const { id } = useParams();
  const props = useDatable({
    page: 1,
    limit: 10,
    event: 'sigycop.update',
    callback: () =>
      sigycopApi.findAllByExam(id ?? '', {
        page: props.page,
        limit: props.limit,
        search: props.search,
      }),
  });

  const handleDownload = async () => {
    await sigycopApi.downloadAllByExam(id ?? '');
  };

  return (
    <div>
      <Datatable
        cols={sigycopCols}
        onDownload={handleDownload}
        {...props}
      />
    </div>
  );
};
