import { useEffect, useState } from 'react';
import { CreateStep } from '../../../api/typings';
import { useParams } from 'react-router-dom';
import { Form } from '../../form-fields/Form';
import { Input } from '../../form-fields/Input';
import { Button } from '../../buttons/Button';
import { useToast } from '../../providers/ToastProvider';
import { stepApi } from '../../../api/step.api';
import { Validator } from '@asaje/form-validator';

const defaultStep = (id?: string, count?: number) => ({
  examId: id ?? '',
  label: '',
  order: count ?? 1,
});

type AddStepProps = {
  refresh: () => void;
  currentCount?: number;
};

export const AddStep = ({ refresh, currentCount }: AddStepProps) => {
  const { id } = useParams();
  const openToast = useToast();
  const [step, setStep] = useState<CreateStep>(defaultStep(id, currentCount));

  useEffect(() => {
    handleChange('order', currentCount ?? 1);
  }, [currentCount]);

  const handleChange = (name: string, value: string | number) => {
    setStep((step) => ({ ...step, [name]: value }));
  };

  const handleSubmit = async () => {
    const _step = await stepApi.create({ ...step, order: +step.order });
    if (!_step) {
      openToast({ type: 'error', info: "Impossible d'ajouter l'étape" });
      return;
    }
    openToast({ type: 'success', info: 'Etape ajoutée avec succes' });
    setStep(() => defaultStep(id, currentCount));
    refresh();
  };

  return (
    <div className="bg-white rounded shadow p-4 h-fit">
      <div className="font-semibold">Ajouter une étape</div>
      <Form
        className="flex flex-col gap-6 mt-8"
        onSubmit={handleSubmit}>
        <Input
          label="Intitulé de l'étape"
          value={step.label}
          onChange={(e) => handleChange('label', e.target.value)}
        />
        <Input
          label="Ordre de l'étape"
          type="number"
          value={step.order}
          validations={[Validator.min(0, 'Valeur minimale requise: 0')]}
          min={0}
          onChange={(e) => handleChange('order', e.target.value)}
        />
        <Button
          className="!bg-gray-600 text-sm"
          type="submit">
          Ajouter l'étape
        </Button>
      </Form>
    </div>
  );
};
