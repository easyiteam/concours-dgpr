import { Outlet } from 'react-router';
import { BaseLayout } from '../../layouts/BaseLayout';

export const AdminRoot = () => {
  return (
    <BaseLayout>
      <Outlet />
    </BaseLayout>
  );
};
