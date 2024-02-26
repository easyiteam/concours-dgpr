import { PropsWithChildren } from 'react';

export type CreateExamSectionType = {
  count: string;
  title: string;
};

export const CreateExamSection = ({
  count,
  title,
  children,
}: PropsWithChildren<CreateExamSectionType>) => {
  return (
    <div className="my-10">
      <div className="text-xs font-bold">Etape {count}</div>
      <div className="font-light">{title}</div>

      <div className="bg-white rounded my-2 p-6">{children}</div>
    </div>
  );
};
