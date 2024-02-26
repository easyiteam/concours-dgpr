import { useParams } from 'react-router-dom';
import { Back } from '../components/display/Back';
import { useCurrentStepIs } from '../hooks/useCurrentStepIs';
import { Input } from '../components/form-fields/Input';
import { Button } from '../components/display/Button';
import { useState } from 'react';
import { Candidature, getCandidature } from '../api/candidature.api';
import { CandidatureStatusMessage } from '../components/display/CandidatureStatusMessage';
import { CandidatureStore } from '../store/candidature.store';

export const VerifyCandidature = () => {
  const { id } = useParams();
  const [candidature, setCandidature] = useState<Candidature | undefined>();
  const [profileId, setProfileId] = useState<string>('');
  const [verificationPending, setVerificationPending] = useState(false);
  // const navigate = useNavigate();

  useCurrentStepIs(id ?? '', 2);

  const verifyProfile = async () => {
    setVerificationPending(true);
    const _candidature = await getCandidature(profileId);
    setCandidature(_candidature);
    CandidatureStore.set(_candidature);
    setProfileId('');
    setTimeout(() => setVerificationPending(false), 30000);
  };

  return (
    <div className="px-[6vw] py-10">
      <div className="flex items-center gap-4">
        <Back />
        <h1 className="text-xl font-bold">Vérifier votre candidature</h1>
      </div>
      <div className="mt-8 bg-white p-6 shadow flex flex-col gap-6">
        {verificationPending && (
          <CandidatureStatusMessage candidature={candidature} />
        )}

        <Input
          value={profileId}
          onChange={(e) => setProfileId(e.target.value.toUpperCase())}
          label="Saisir votre numéro d'inscription pour vérifier votre candidature"
        />

        <div className="flex flex-col gap-4 lg:flex-row">
          <Button
            onClick={verifyProfile}
            className="text-sm">
            Vérifier ma candidature
          </Button>
          {/* <Button
            onClick={() => navigate(`/update-register/${id}`)}
            className="text-sm !bg-slate-500">
            J'ai ma quittance, mais je n'ai pas pu m'inscrire
          </Button> */}
        </div>
      </div>
    </div>
  );
};
