import { useState } from 'react';
import { AddStep } from '../../components/views/steps/AddStep';
import { StepsList } from '../../components/views/steps/StepsList';
import { useFindAll } from '../../hooks/useFindAll';
import { Step } from '../../api/typings';
import { stepApi } from '../../api/step.api';
import { useParams } from 'react-router-dom';

export const Steps = () => {
  const { id } = useParams();

  const [count, setCount] = useState(0);
  const refresh = () => {
    setCount((c) => c + 1);
  };
  const data = useFindAll<Step>(
    () => stepApi.findAllByExam(id ?? '', { limit: -1 }),
    [count],
    'step.update',
  );

  return (
    <div className="grid grid-cols-[2fr_1fr] gap-8">
      <StepsList data={data.rows} />
      <AddStep
        refresh={refresh}
        currentCount={(data.totalCount ?? 0) + 1}
      />
    </div>
  );
};
