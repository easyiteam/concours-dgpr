import { NavLink } from 'react-router-dom';
import { Icon } from '../components/display/Icon';
import logo from '../assets/imgs/logo.png';
import { Role } from '../api/enums';
import { AuthStore } from '../store/auth.store';

const links = [
  {
    icon: 'dashboard',
    label: 'Tableau de board',
    path: 'dashboard',
    roles: [Role.ADMIN, Role.EXAM_MANAGER, Role.USER],
  },
  {
    icon: 'inventory',
    label: 'Dossiers',
    path: 'candidatures',
    roles: [Role.ADMIN, Role.EXAM_MANAGER, Role.USER],
  },
  {
    icon: 'system_update_alt',
    label: 'Réclamations',
    path: 'reclamations',
    roles: [Role.ADMIN, Role.EXAM_MANAGER, Role.USER],
  },
  {
    icon: 'sprint',
    label: 'Phase sportive',
    path: 'sport',
    roles: [Role.ADMIN, Role.EXAM_MANAGER],
  },
  {
    icon: 'edit_note',
    label: 'Phase écrite',
    path: 'writing',
    roles: [Role.ADMIN, Role.EXAM_MANAGER, Role.USER],
  },
  {
    icon: 'settings',
    label: 'Paramètres',
    path: 'settings',
    roles: [Role.ADMIN],
  },
  // { icon: 'location_away', label: 'Signataires', path: 'signers' },
];

export const Sidebar = () => {
  const _links = links.filter((link) => AuthStore.isOneOf(link.roles));

  return (
    <div className="hidden h-full bg-white rounded lg:block p-4 min-w-0 min-h-0 overflow-auto">
      <div className="justify-center mb-10">
        <img
          src={logo}
          alt="LOGO"
          className="h-[120px] mx-auto"
        />
        <div className="text-center py-4 text-xs font-semibold">
          DIRECTION GÉNÉRALE DE LA POLICE REPUBLICAINE
        </div>
      </div>

      <div className="text-gray-400 text-sm font-light">Menu</div>

      <div className="min-w-0 min-h-0 overflow-auto">
        {_links.map((route) => {
          return (
            <NavLink
              to={route.path ?? ''}
              key={route.path}
              className={({ isActive }) =>
                `flex items-center gap-3 py-2 my-1 text-sm ${
                  isActive ? 'font-semibold text-primary' : 'text-[#6C757D]'
                }`
              }>
              <Icon name={route.icon} />
              <span>{route.label}</span>
            </NavLink>
          );
        })}
      </div>
    </div>
  );
};
