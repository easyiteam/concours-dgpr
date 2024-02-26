import { useEffect, useState } from 'react';
import { Back } from '../../components/buttons/Back';
import { H1 } from '../../components/display/H1';
import { Input } from '../../components/form-fields/Input';
import { CreateExamSection } from './CreateExamSection';
import {
  ParticipantProfileDefinition,
  Section,
} from './ParticipantProfileDefinition';
import { CreateExam } from '../../api/typings';
import { Button } from '../../components/buttons/Button';
import { examApi } from '../../api/exam.api';
import { useNavigate, useParams } from 'react-router-dom';

const defaultExam = {
  label: '',
  shortName: '',
  participantProfileDefinition: {},
};

export const CreateExamView = () => {
  const [exam, setExam] = useState<CreateExam>(defaultExam);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const load = async () => {
      const _exam = await examApi.findOne(id);
      setExam({
        label: _exam?.label ?? '',
        shortName: _exam?.shortName ?? '',
        participantProfileDefinition: _exam?.participantProfileDefinition ?? {},
      });
    };
    load();
  }, [id]);

  const handleChange = (key: string, value: string | Section[]) => {
    setExam((exam) => ({ ...exam, [key]: value }));
  };

  const createExam = async () => {
    const result = await save();
    if (!result) return;
    navigate(-1);
  };

  const save = async () => {
    if (id) return await examApi.update(id, exam);
    return await examApi.create(exam);
  };

  return (
    <div>
      <div className="flex items-center gap-4">
        <Back />
        <H1>Nouveau concours</H1>
      </div>

      <CreateExamSection
        count="1"
        title="Donnez un libellé à votre concours">
        <div className="flex flex-col gap-4">
          <Input
            value={exam.label}
            onChange={(e) =>
              handleChange('label', e.target.value.toUpperCase())
            }
            label="Libellé du concours"
            area
          />
          <Input
            value={exam.shortName}
            onChange={(e) =>
              handleChange('shortName', e.target.value.toUpperCase())
            }
            label="Nom court"
          />
        </div>
      </CreateExamSection>

      <CreateExamSection
        count="2"
        title="Définissez les informations du formulaire de candidature">
        <ParticipantProfileDefinition
          onChange={(v) => handleChange('participantProfileDefinition', v)}
        />
      </CreateExamSection>

      <div className="flex justify-end mt-8">
        <Button onClick={createExam}>
          {id ? 'Modifier' : 'Créer'} le concours
        </Button>
      </div>
    </div>
  );
};
