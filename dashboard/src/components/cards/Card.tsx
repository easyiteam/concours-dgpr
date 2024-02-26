import { PropsWithChildren } from 'react';

export const Card = ({ children }: PropsWithChildren) => {
  return <div className="bg-white rounded-lg p-8">{children}</div>;
};
