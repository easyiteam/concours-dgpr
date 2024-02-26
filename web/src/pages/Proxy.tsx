import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getCurrentStep } from '../api/step.api';

const orderMappingRoutes = [
  'register',
  'verify-candidature',
  'verify-sport-profile',
  'verify-writing-profile',
];

export const Proxy = () => {
  const { id } = useParams();

  const navigate = useNavigate();

  useEffect(() => {
    const redirect = async () => {
      if (id) {
        const currentStep = (await getCurrentStep(id)) as { order: number };
        if (currentStep.order === 0) {
          navigate('/');
          return;
        }
        navigate(`/${orderMappingRoutes[currentStep.order - 1]}/${id}`);
      }
    };
    redirect();
  }, [id]);

  return <></>;
};
