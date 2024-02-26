import { useState } from 'react';
import { Back } from '../../components/buttons/Back';
import { H1 } from '../../components/display/H1';
import { Form } from '../../components/form-fields/Form';
import { Input } from '../../components/form-fields/Input';
import { Validator } from '@asaje/form-validator';
import { Button } from '../../components/buttons/Button';
import { writingApi } from '../../api/writing.api';

const defaultScore = {
  code: '',
  value: 0,
};

export const WritingScores = () => {
  const [score, setScore] = useState(defaultScore);
  const [codeErrorMsgs, setCodeErrorMsgs] = useState<string[]>([]);
  const [scoreErrorMsgs, setScoreErrorMsgs] = useState<string[]>([]);

  const handleSubmit = async () => {
    await writingApi.insertScore(score.code, score.value);
    setScore(defaultScore);
  };

  return (
    <div>
      <div className="flex items-center gap-8">
        <Back />
        <H1>Saisir les notes</H1>
      </div>

      <div className="bg-white rounded shadow-xl mt-10 p-8 w-[40%] mx-auto">
        <Form
          onSubmit={handleSubmit}
          className="flex flex-col gap-6">
          <div>
            <Input
              label="QR Code *"
              name="code"
              value={score.code}
              onChange={(e) => setScore({ ...score, code: e.target.value })}
              validations={[Validator.required('Ce champ est obligatoire')]}
              onValidationStateChanged={(result) => {
                setCodeErrorMsgs(result.messages);
              }}
            />
            <div className="text-xs text-red-500">
              {codeErrorMsgs.map((error) => (
                <div key={error}>{error}</div>
              ))}
            </div>
          </div>

          <div>
            <Input
              label="Saisir la note *"
              type="number"
              step={0.25}
              validations={[
                Validator.max(20, 'La note maximale possible est 20'),
                Validator.min(0, 'La note minimale possible est 0'),
                Validator.required('Ce champ est obligatoire'),
              ]}
              name="value"
              min={0}
              max={20}
              onValidationStateChanged={(result) =>
                setScoreErrorMsgs(result.messages)
              }
              value={score.value}
              onChange={(e) => setScore({ ...score, value: +e.target.value })}
            />
            <div className="text-xs text-red-500">
              {scoreErrorMsgs.map((error) => (
                <div key={error}>{error}</div>
              ))}
            </div>
          </div>

          <Button
            type="submit"
            disabled={codeErrorMsgs.length > 0 || scoreErrorMsgs.length > 0}>
            Valider
          </Button>
        </Form>
      </div>
    </div>
  );
};
