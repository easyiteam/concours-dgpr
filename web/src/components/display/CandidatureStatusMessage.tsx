import { useNavigate } from 'react-router-dom';
import { Candidature, CandidatureStatus } from '../../api/candidature.api';
import { Button } from './Button';
import { Icon } from './Icon';

type Props = {
  candidature?: Candidature;
};

export const CandidatureStatusMessage = ({ candidature }: Props) => {
  const navigate = useNavigate();

  if (!candidature)
    return (
      <div className="bg-red-50 rounded shadow border border-red-400 text-red-500 flex items-center gap-4 p-4">
        <Icon
          name="report"
          size={32}
        />
        <div>
          Nous n'avons trouvé aucun dossier de candidature pour le numéro que
          vous avez fourni
        </div>
      </div>
    );

  if (candidature.status === CandidatureStatus.ACCEPTED)
    return (
      <div className="bg-green-50 rounded shadow border border-green-400 text-green-500 flex items-center gap-4 p-4">
        <Icon
          name="check_circle"
          size={32}
        />
        <div>Félicitations, votre candidature a été acceptée.</div>
      </div>
    );

  if (candidature.status === CandidatureStatus.INDETERMINATE)
    return (
      <div className="bg-orange-50 rounded shadow border border-orange-400 text-orange-500 flex items-center gap-4 p-4">
        <Icon
          name="pending"
          size={32}
        />
        <div>
          Votre candidature est en cours de validation. Veuillez réesayer
          ultérieurement.
        </div>
      </div>
    );

  return (
    <div className="bg-red-50 rounded shadow border border-red-400 text-red-500 flex flex-col lg:flex-row justify-between items-center gap-6 p-4">
      <div className="flex items-center gap-6">
        <Icon
          name="error"
          size={42}
        />
        <div className="text-sm flex flex-col">
          <div>Désolé, votre candidature a été rejetée.</div>
          <div>
            Motif: <b>{candidature.activeProfile.rejectReason}</b>
          </div>
        </div>
      </div>
      <div>
        <Button
          onClick={() => navigate(`/update-candidature/${candidature.examId}`)}
          className="bg-red-400 text-xs">
          Réclamer
        </Button>
      </div>
    </div>
  );
};
