import { useEffect } from 'react';
import { getCurrentStep } from '../api/step.api';
import { useNavigate } from 'react-router-dom';

export function useCurrentStepIs(examId: string, order: number) {
  const navigate = useNavigate();

  useEffect(() => {
    const verify = async () => {
      const step = await getCurrentStep(examId);
      if (!step || step.order !== order) {
        navigate('/');
        return;
      }
    };
    verify();
  }, []);
}
