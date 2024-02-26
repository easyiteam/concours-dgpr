import { useParams } from 'react-router-dom';
import { useCurrentStepIs } from '../hooks/useCurrentStepIs';
import { useEffect, useId, useState } from 'react';
import { Back } from '../components/display/Back';
import { Form } from '../components/form-fields/Form';
import { Section } from '../components/Section';
import { Button } from '../components/display/Button';
import { CandidatureStore } from '../store/candidature.store';
import { Exam, getExams } from '../api/exam.api';
import { updateCandidature } from '../api/candidature.api';
import { useToast } from '../ToastProvider';
import { useModal } from '../components/actions/modal/constants';

export const UpdateCandidature = () => {
  const { id } = useParams();
  const [exams, setExams] = useState<Exam[]>([]);
  const [examId, setExamId] = useState('');
  const _id = useId();

  useCurrentStepIs(id ?? '', 2);

  const loadExams = async () => {
    const _exams = await getExams();
    setExams(_exams);
  };
  useEffect(() => {
    loadExams();
  }, []);

  const examLabel = (id: string) => exams.find((v) => v.id === id)?.shortName;
  const getExamId = (shortName?: string) =>
    exams.find((v) => v.shortName === shortName)?.id;

  const [formValue, setFormValue] = useState<Record<string, string | number>>(
    CandidatureStore.candidature?.activeProfile.value,
  );
  const [exam] = useState<Exam>(CandidatureStore.candidature?.exam as Exam);

  const openToast = useToast();
  const { openModal, closeModal } = useModal();

  const updateFormValue = (key: string, value: string | number) => {
    setFormValue((form) => ({ ...form, [key]: value }));
  };

  const handleSubmit = async () => {
    const candidature = await updateCandidature(
      CandidatureStore.candidature?.id ?? '',
      { data: formValue, examId },
    );
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
          Votre réclamation a été enregistrée avec success. <br />
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
          <Section
            count={1}
            key={`${_id}_${-1}`}
            label="Modifier le concours"
            value={[
              {
                key: 'examId',
                label: 'Concours',
                type: 'choice',
                validation: {
                  required: true,
                  values: exams.map((exam) => examLabel(exam.id)).join(';'),
                },
              },
            ]}
            form={{ examId: examLabel(id ?? '') ?? '' }}
            updateFormValue={(_, v) => (
              console.log(v, 'value'), setExamId(getExamId(String(v)) ?? '')
            )}
          />

          {exam.participantProfileDefinition.map((profile, index) =>
            index < exam.participantProfileDefinition.length - 1 ? (
              <Section
                count={index + 2}
                key={`${_id}_${index}`}
                label={profile.label}
                value={profile.value}
                form={formValue}
                updateFormValue={updateFormValue}
              />
            ) : (
              <></>
            ),
          )}
        </div>
        <div className="mt-8 flex justify-end">
          <Button onClick={handleSubmit}>Soumettre</Button>
        </div>
      </Form>
    </div>
  );
};
