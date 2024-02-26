import { authApi } from '../api/auth.api';
import { Auth } from '../api/typings';
import { Button } from '../components/buttons/Button';
import { EmptyState } from '../components/display/EmptyState';
import { H1 } from '../components/display/H1';
import { Datatable } from '../components/table/Datatable';
import { usersCols } from '../data/users.cols';
import { useConfirm } from '../hooks/useConfirm';
import { useDatable } from '../hooks/useDatatable';
import { useNavigate } from 'react-router-dom';

export const Users = () => {
  const props = useDatable({
    page: 1,
    limit: 10,
    event: 'auth.update',
    callback: () =>
      authApi.findAll({
        page: props.page,
        limit: props.limit,
        search: props.search,
      }),
  });
  const confirm = useConfirm();
  const navigate = useNavigate();

  const archive = async (row: Auth) => {
    confirm({
      message: 'Etes-vous sûr de vouloir effectuer cette action ?',
      onConfirm: async () => {
        await authApi.removeOne(row.id);
      },
    });
  };

  const openUserForm = () => {
    navigate('/default/register');
  };

  return (
    <div>
      <div className="flex justify-between items-center">
        <H1>Utilisateurs</H1>

        <Button
          className="text-sm"
          icon="add_circle"
          onClick={openUserForm}>
          Ajouter un utilisateur
        </Button>
      </div>

      <div className="mt-10">
        {props.totalCount !== 0 ? (
          <Datatable
            noDownload
            noFilter
            cols={usersCols(archive)}
            {...props}
          />
        ) : (
          <EmptyState>Vous n'avez encore créé aucun utilisateur</EmptyState>
        )}
      </div>
    </div>
  );
};
