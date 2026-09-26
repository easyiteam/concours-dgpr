import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { stepApi } from '../../../api/step.api';
import { sigycopApi } from '../../../api/sigycop.api';
import { useFetch } from '../../../hooks/useFetch';
import { Input } from '../../form-fields/Input';
import { Button } from '../../buttons/Button';
import { useToast } from '../../providers/ToastProvider';

const AXIS_LABELS: Record<string, string> = {
  s: 'S — Membres Supérieurs',
  i: 'I — Membres Inférieurs',
  g: 'G — État Général',
  y: 'Y — Yeux / vision',
  c: 'C — sens Chromatique',
  o: 'O — Ouïe',
  p: 'P — Psychisme',
};

const DEFAULT_THRESHOLDS = { s: 3, i: 3, g: 4, y: 4, c: 2, o: 3, p: 4 };

export const SigycopThresholds = () => {
  const { id } = useParams();
  const openToast = useToast();
  const [thresholds, setThresholds] = useState(DEFAULT_THRESHOLDS);

  const { data: steps, loading } = useFetch({
    cb: () => stepApi.findAllByExam(id ?? '', { page: 1, limit: -1 }),
  });

  const sigycopStep = steps?.values.find((step) => step.label === 'SIGYCOP');

  useEffect(() => {
    if (sigycopStep?.evaluationConfig) {
      setThresholds(sigycopStep.evaluationConfig as typeof DEFAULT_THRESHOLDS);
    }
  }, [sigycopStep]);

  const handleSave = async () => {
    if (!sigycopStep) {
      openToast({
        type: 'error',
        info: "Créez d'abord une étape nommée exactement \"SIGYCOP\" pour ce concours avant de configurer ses seuils.",
      });
      return;
    }
    await sigycopApi.setThresholds(sigycopStep.id, thresholds);
    openToast({ type: 'success', info: 'Seuils SIGYCOP enregistrés' });
  };

  if (loading) return null;

  return (
    <div className="bg-white p-6 rounded">
      <p className="text-sm text-gray-600 mb-6">
        Note maximale autorisée par axe pour ce concours. Un candidat dont au moins un axe
        dépasse son seuil est déclaré inapte.
      </p>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl">
        {Object.keys(AXIS_LABELS).map((axis) => (
          <Input
            key={axis}
            label={AXIS_LABELS[axis]}
            type="number"
            min={1}
            max={6}
            value={thresholds[axis as keyof typeof thresholds]}
            onChange={(e) =>
              setThresholds({ ...thresholds, [axis]: Number(e.target.value) })
            }
          />
        ))}
      </div>
      <div className="mt-6">
        <Button onClick={handleSave}>Enregistrer les seuils</Button>
      </div>
    </div>
  );
};
