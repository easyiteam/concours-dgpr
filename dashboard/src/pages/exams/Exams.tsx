import { Exam } from '../../api/typings';
import { examApi } from '../../api/exam.api';
import { Button } from '../../components/buttons/Button';
import { Icon } from '../../components/display/Icon';
import { H1 } from '../../components/display/H1';
import { useNavigate } from 'react-router-dom';
import { Paths } from '../../router/routes';
import { Datatable } from '../../components/table/Datatable';
import { useDatable } from '../../hooks/useDatatable';
import { examCols } from '../../data/exams.cols';
import { EmptyState } from '../../components/display/EmptyState';
import { useConfirm } from '../../hooks/useConfirm';

export const Exams = () => {
  const navigate = useNavigate();

  const createExam = () => {
    navigate(Paths.exam.create);
  };

  return (
    <div>
      <div className="flex justify-between items-center">
        <H1>Vos concours</H1>
        <Button
          className="text-sm"
          onClick={createExam}>
          <Icon name="add_circle" />
          Créer un concours
        </Button>
      </div>

      <DisplayExams />
    </div>
  );
};

function DisplayExams() {
  const props = useDatable({
    page: 1,
    limit: 10,
    event: 'exams.update',
    callback: () =>
      examApi.findAll({
        page: props.page,
        limit: props.limit,
        search: props.search,
      }),
  });
  const confirm = useConfirm();
  const navigate = useNavigate();

  const next = (row: Exam) => {
    navigate(`/exam-details/${row.id}/dashboard`);
  };

  const edit = async (row: Exam) => {
    navigate(`${Paths.exam.create}/${row.id}`);
  };

  const archive = async (row: Exam) => {
    confirm({
      message: 'Etes-vous sûr de vouloir effectuer cette action ?',
      onConfirm: async () => {
        await examApi.archiveOne(row.id);
      },
    });
  };
  return (
    <div className="my-10">
      {props.totalCount !== 0 ? (
        <Datatable
          noDownload
          noFilter
          cols={examCols(next, edit, archive)}
          {...props}
        />
      ) : (
        <EmptyState>Vous n'avez encore créé aucun concours</EmptyState>
      )}
    </div>
  );
}
