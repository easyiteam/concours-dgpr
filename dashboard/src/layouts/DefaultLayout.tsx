import { PropsWithChildren } from 'react';
import { Topbar } from './Topbar';
import { useAuth } from '../hooks/useAuth';

export const DefaultLayout = ({ children }: PropsWithChildren) => {
  useAuth();
  return (
    <div className="p-4">
      <Topbar />
      <main className="p-8">{children}</main>
    </div>
  );
};
