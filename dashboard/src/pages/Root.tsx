import { DefaultLayout } from '../layouts/DefaultLayout';
import { Outlet } from 'react-router-dom';

export const Root = () => {
  return (
    <DefaultLayout>
      <Outlet />
    </DefaultLayout>
  );
};
