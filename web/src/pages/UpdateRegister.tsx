import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Exam, getExam } from '../api/exam.api';
import { Back } from '../components/display/Back';
import { Section } from '../components/Section';
import { getFormValue } from '../services/form.service';
import { Form } from '../components/form-fields/Form';
import { Button } from '../components/display/Button';
import { useToast } from '../ToastProvider';
import { registerCandidature } from '../api/candidature.api';
import { useModal } from '../components/actions/modal/constants';
import { useCurrentStepIs } from '../hooks/useCurrentStepIs';

export const UpdateRegister = () => {
  const { id } = useParams();

  useCurrentStepIs(id ?? '', 2);

  const [exam, setExam] = useState<Exam>();
  const [formValue, setFormValue] = useState<Record<string, string | number>>(
    {},
  );
  const isFormValid = useMemo(() => {
    if (exam) {
      const items = [];
      for (const it of exam.participantProfileDefinition) {
        items.push(...it.value);
      }

      for (const it of items) {
        if (it.validation.required && !formValue[it.key]) return false;
      }
      return true;
    }

    return false;
  }, [formValue, exam]);
  const openToast = useToast();
  const { openModal, closeModal } = useModal();

  const load = async () => {
    const _exam = await getExam(id);
    setExam(_exam);
    setFormValue(getFormValue(_exam));
  };

  const updateFormValue = (key: string, value: string | number) => {
    setFormValue((form) => ({ ...form, [key]: value }));
  };

  useEffect(() => {
    load();
  }, []);

  const handleSubmit = async () => {
    if (!isFormValid) {
      openToast({
        type: 'error',
        info: 'Veuillez renseigner toutes les informations demandées',
      });
      return;
    }

    const candidature = await registerCandidature(formValue, id ?? '');
    if (!candidature) {
      openToast({
        type: 'error',
        info: "Impossible de soumettre la candidature, le paiement n'a pas été effectué",
      });
      return;
    }

    openModal({
      header: <div className="font-bold text-center w-full">Félicitations</div>,
      children: (
        <div className="p-8">
          Votre candidature a été enregistrée avec success. <br />
          Votre numéro d'inscription est :{' '}
          <span className="font-bold">{candidature.reference}</span>
          <div className="flex justify-end mt-8">
            <Button
              className="text-sm"
              onClick={() => {
                closeModal();
                location.replace('/');
              }}>
              Fermer
            </Button>
          </div>
        </div>
      ),
      closable: false,
    });
  };

  return (
    <div className="px-[6vw] py-10">
      <div className="flex items-center gap-4">
        <Back />
        <h1 className="text-xl font-bold">Veuillez remplir le formulaire</h1>
      </div>

      <Form>
        <div className="flex flex-col gap-8 mt-8">
          {exam?.participantProfileDefinition.map((profile, index) => (
            <Section
              count={index + 1}
              key={`${id}_${index}`}
              label={profile.label}
              value={profile.value}
              form={formValue}
              updateFormValue={updateFormValue}
              slip
            />
          ))}
        </div>
        <div className="mt-8 flex justify-end">
          <Button
            disabled={!isFormValid}
            onClick={handleSubmit}>
            Soumettre mon dossier
          </Button>
        </div>
      </Form>
    </div>
  );
};
