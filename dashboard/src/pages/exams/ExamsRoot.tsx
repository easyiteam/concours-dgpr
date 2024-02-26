import { Outlet } from 'react-router-dom';
import { DefaultLayout } from '../../layouts/DefaultLayout';

export const ExamsRoot = () => {
  return (
    <DefaultLayout>
      <Outlet />
    </DefaultLayout>
  );
};
