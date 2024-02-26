import { PropsWithChildren } from 'react';

export const MainWindow = ({ children }: PropsWithChildren) => {
  return <div className="min-w-0 min-h-0 overflow-auto p-4">{children}</div>;
};
