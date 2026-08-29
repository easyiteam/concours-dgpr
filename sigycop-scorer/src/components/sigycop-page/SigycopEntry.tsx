import { useState } from 'react';
import { api } from '../../api';

const AXES: { key: 's' | 'i' | 'g' | 'y' | 'c' | 'o' | 'p'; label: string }[] = [
  { key: 's', label: 'S — Membres Supérieurs' },
  { key: 'i', label: 'I — Membres Inférieurs' },
  { key: 'g', label: 'G — État Général' },
  { key: 'y', label: 'Y — Yeux / vision' },
  { key: 'c', label: 'C — sens Chromatique' },
  { key: 'o', label: 'O — Ouïe' },
  { key: 'p', label: 'P — Psychisme' },
];

type Candidate = {
  id: string;
  reference: string;
  examId: string;
  activeProfile?: { value: { lastname?: string; firstname?: string } };
};

type Center = { id: string; label: string };

type SubmitResult = { apte: boolean; failedAxes: string[] };

const defaultScores = { s: 1, i: 1, g: 1, y: 1, c: 1, o: 1, p: 1 };

export default function SigycopEntry() {
  const [reference, setReference] = useState('');
  const [candidate, setCandidate] = useState<Candidate | null>(null);
  const [centers, setCenters] = useState<Center[]>([]);
  const [centerId, setCenterId] = useState('');
  const [scores, setScores] = useState(defaultScores);
  const [result, setResult] = useState<SubmitResult | null>(null);
  const [error, setError] = useState('');

  const search = async () => {
    setError('');
    setResult(null);
    try {
      const response = await api.get(`sigycop/${reference.trim()}/info`);
      const found: Candidate = response.data;
      setCandidate(found);

      const centersResponse = await api.get(`exams/centers/${found.examId}`);
      setCenters(centersResponse.data);
      setCenterId('');
      setScores(defaultScores);
    } catch (e) {
      setCandidate(null);
      setError('Candidat introuvable pour cette référence.');
    }
  };

  const submit = async () => {
    setError('');
    try {
      const response = await api.post('sigycop', {
        reference: candidate?.reference,
        centerId,
        ...scores,
      });
      setResult({ apte: response.data.apte, failedAxes: response.data.failedAxes });
    } catch (e: any) {
      setError(e?.response?.data?.message || "Erreur lors de l'enregistrement du profil.");
    }
  };

  return (
    <div className="w-full h-full overflow-auto p-4">
      <div className="flex gap-2">
        <input
          className="flex-1 outline-0 border rounded px-3 py-3"
          value={reference}
          onChange={(e) => setReference(e.target.value)}
          placeholder="Référence du candidat"
        />
        <button
          onClick={search}
          disabled={!reference}
          className="border border-[#183661] bg-[#007000] text-white font-bold px-6 rounded disabled:opacity-50">
          Rechercher
        </button>
      </div>

      {error && (
        <div className="my-4 text-red-500 font-bold text-center border border-red-500 rounded py-3">
          {error}
        </div>
      )}

      {candidate && (
        <div className="mt-6">
          <div className="text-xl font-bold text-center mb-4">
            {candidate.activeProfile?.value.lastname} {candidate.activeProfile?.value.firstname}
          </div>

          <select
            className="w-full outline-0 border rounded px-3 py-3 mb-4"
            value={centerId}
            onChange={(e) => setCenterId(e.target.value)}>
            <option value="">Sélectionner un centre</option>
            {centers.map((center) => (
              <option
                key={center.id}
                value={center.id}>
                {center.label}
              </option>
            ))}
          </select>

          {AXES.map((axis) => (
            <div
              key={axis.key}
              className="mb-3">
              <label className="font-semibold text-sm">{axis.label}</label>
              <input
                type="number"
                min={1}
                max={6}
                className="w-full outline-0 border rounded px-3 py-3 mt-1"
                value={scores[axis.key]}
                onChange={(e) =>
                  setScores({ ...scores, [axis.key]: Number(e.target.value) })
                }
              />
            </div>
          ))}

          <button
            onClick={submit}
            disabled={!centerId}
            className="border border-[#183661] bg-[#007000] text-white font-bold w-full py-3 rounded mt-2 disabled:opacity-50">
            Enregistrer le profil
          </button>

          {result && (
            <div
              className={`mt-4 text-center font-bold rounded py-3 border ${
                result.apte
                  ? 'text-green-600 border-green-600'
                  : 'text-red-600 border-red-600'
              }`}>
              {result.apte
                ? 'Candidat déclaré APTE'
                : `Candidat déclaré INAPTE (${result.failedAxes.join(', ')})`}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
