import { formatDate } from 'usual_fn';
import { ProfileItem } from '../exams/ParticipantProfileDefinition';
import { FileViewer } from '../../components/display/FileViewer';

export function RenderCandidatureProfilItem({
  value,
  profile,
}: {
  value: Record<string, string | number>;
  profile: ProfileItem;
}) {
  if (['text', 'number', 'email', 'choice'].includes(profile.type)) {
    return <div className="font-light">{value[profile.key]}</div>;
  }

  if (profile.type === 'date')
    return (
      <div className="font-light">
        {formatDate({ data: value[profile.key] }).split(' ')[0]}
      </div>
    );

  if (profile.type === 'file')
    return (
      <div>
        <FileViewer src={value[profile.key] as string} />
      </div>
    );

  if (profile.type === 'paiement') {
    const [id, reference, transaction_key, customer_id] = (
      value[profile.key] as string
    ).split('|');

    if (id === 'uploaded') return <FileViewer src={reference} />;

    return (
      <div className="text-xs flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <div className="font-bold text-xs">Id de la transaction</div>
          <div className="font-light text-sm">{id}</div>
        </div>
        <div className="flex flex-col gap-1">
          <div className="font-bold text-xs">Référence</div>
          <div className="font-light text-sm">{reference}</div>
        </div>
        <div className="flex flex-col gap-1">
          <div className="font-bold text-xs">Clé de transaction</div>
          <div className="font-light text-sm">{transaction_key}</div>
        </div>
        <div className="flex flex-col gap-1">
          <div className="font-bold text-xs">Id client</div>
          <div className="font-light text-sm">{customer_id}</div>
        </div>
      </div>
    );
  }
}
