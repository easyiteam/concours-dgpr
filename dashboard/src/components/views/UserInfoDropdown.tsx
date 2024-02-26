import { useNavigate } from 'react-router-dom';
import { useConfirm } from '../../hooks/useConfirm';
import { Icon } from '../display/Icon';
import { AuthStore } from '../../store/auth.store';
import { useId } from 'react';
import { Role } from '../../api/enums';

export const UserInfoDropdown = () => {
  const openConfirmDialog = useConfirm();
  const navigate = useNavigate();

  const handleLogout = () => {
    openConfirmDialog({
      message: 'Etes-vous sûr de vouloir vous déconnecter ?',
      onConfirm: () => {
        navigate('/');
        AuthStore.logout();
      },
    });
  };

  return (
    <div>
      <div className="text-xs font-bold pl-2">Bienvenue</div>
      <div className="flex flex-col mt-1">
        <DisplayLinks />

        <hr className="mt-1" />

        <div
          className="flex items-center gap-2 text-gray-500 cursor-pointer hover:bg-gray-100 rounded my-1 py-2 pl-2"
          onClick={handleLogout}>
          <Icon name="logout" />
          <span className="text-xs">Se déconnecter</span>
        </div>
      </div>
    </div>
  );
};

const links = [
  {
    icon: 'school',
    label: 'Examens',
    path: '/exams',
    roles: [Role.ADMIN, Role.EXAM_MANAGER, Role.USER],
  },
  {
    icon: 'receipt_long',
    label: 'Communiqués',
    path: '/default/documents',
    roles: [Role.ADMIN],
  },
  {
    icon: 'groups',
    label: 'Utilisateurs',
    path: '/default/users',
    roles: [Role.ADMIN],
  },

  {
    icon: 'fact_check',
    label: 'Validateurs',
    path: '/default/validators',
    roles: [Role.ADMIN],
  },
  // { icon: 'person', label: 'Profile', path: '/default/profile' },
];

const DisplayLinks = () => {
  const _id = useId();

  const ref = (value: string | number) => {
    return `${_id}_${value}`;
  };

  const navigate = useNavigate();

  const gotoUrl = (url: string) => {
    navigate(url);
  };

  const _links = links.filter((link) => AuthStore.isOneOf(link.roles));

  return (
    <>
      {_links.map((link, index) => (
        <div
          key={ref(index)}
          onClick={() => gotoUrl(link.path)}
          className="flex items-center gap-2 text-gray-500 cursor-pointer hover:bg-gray-100 rounded py-2 pl-2">
          <Icon name={link.icon} />
          <span className="text-xs">{link.label}</span>
        </div>
      ))}
    </>
  );
};
