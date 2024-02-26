import { useNavigate, useParams } from 'react-router-dom';
import { H1 } from '../../components/display/H1';
import { useDatable } from '../../hooks/useDatatable';
import { Candidature } from '../../api/typings';
import { candidatureApi } from '../../api/candidature.api';
import { Datatable } from '../../components/table/Datatable';
import { candidaturesCols } from '../../data/candidatures.cols';

export const Reclamations = () => {
  const { id } = useParams();
  const props = useDatable({
    page: 1,
    limit: 10,
    event: 'candidatures.update',
    callback: () =>
      candidatureApi.findAllReclamationsByExam(id ?? '', {
        page: props.page,
        limit: props.limit,
        search: props.search,
      }),
  });
  const navigate = useNavigate();
  const next = (row: Candidature) => {
    navigate(`/exam-details/${id}/candidature/${row.id}`);
  };
  return (
    <div className="pt-4">
      <H1>Réclamations</H1>

      <div className="mt-8">
        <Datatable
          noFilter
          cols={candidaturesCols(next)}
          noDownload
          {...props}
        />
      </div>
    </div>
  );
};
