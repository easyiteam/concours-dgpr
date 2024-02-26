import { useParams } from 'react-router-dom';
import { Back } from '../components/display/Back';
import { useCurrentStepIs } from '../hooks/useCurrentStepIs';
import { Input } from '../components/form-fields/Input';
import { Button } from '../components/display/Button';
import { useState } from 'react';
import { CandidatureStatus, getSportProfile } from '../api/candidature.api';
import { CandidatureStore } from '../store/candidature.store';
import { Icon } from '../components/display/Icon';

export const VerifyWritingProfile = () => {
  const { id } = useParams();
  const [candidature, setCandidature] = useState<
    | { status: CandidatureStatus; center: { label: string }; room: number }
    | undefined
  >();
  const [profileId, setProfileId] = useState<string>('');
  const [verificationPending, setVerificationPending] = useState(false);

  useCurrentStepIs(id ?? '', 4);

  const verifyProfile = async () => {
    setVerificationPending(true);
    const _candidature = await getSportProfile(profileId);
    console.log(_candidature);
    setCandidature(_candidature);
    CandidatureStore.set(_candidature);
    setProfileId('');
    setTimeout(() => setVerificationPending(false), 30000);
  };

  return (
    <div className="px-[6vw] py-10">
      <div className="flex items-center gap-4">
        <Back />
        <h1 className="text-xl font-bold">Vérifier votre résultat</h1>
      </div>
      <div className="mt-8 bg-white p-6 shadow flex flex-col gap-6">
        {verificationPending &&
        candidature &&
        candidature.status === CandidatureStatus.ACCEPTED ? (
          <div className="bg-green-50 rounded shadow border border-green-400 text-green-500 flex items-center gap-4 p-4">
            <Icon
              name="check_circle"
              size={42}
            />
            <div>
              <div>Félicitations, vous est reçu(e).</div>
            </div>
          </div>
        ) : verificationPending ? (
          <div className="bg-red-50 rounded shadow border border-red-400 text-red-500 flex items-center gap-4 p-4">
            <Icon
              name="error"
              size={42}
            />
            <div>Désolé, vous n'êtes pas reçu(e).</div>
          </div>
        ) : (
          <div></div>
        )}

        <Input
          value={profileId}
          onChange={(e) => setProfileId(e.target.value.toUpperCase())}
          label="Saisir votre numéro d'inscription pour vérifier votre résultat"
        />

        <div className="flex flex-col gap-4 lg:flex-row">
          <Button
            onClick={verifyProfile}
            className="text-sm">
            Vérifier ma candidature
          </Button>
        </div>
      </div>
    </div>
  );
};
