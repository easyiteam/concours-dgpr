import { useEffect, useState } from 'react';
import { Back } from '../../components/buttons/Back';
import { Button } from '../../components/buttons/Button';
import { DisplayStatus } from '../../components/display/DisplayStatus';
import { Candidature } from '../../api/typings';
import { candidatureApi } from '../../api/candidature.api';
import { useParams } from 'react-router-dom';
import { CandidatureStatus } from '../../api/enums';
import { ProfileItem, Section } from '../exams/ParticipantProfileDefinition';
import { formatDate } from 'usual_fn';
import { RenderCandidatureProfilItem } from './RenderCandidatureProfilItem';
import { addPushEventListener } from '@asaje/sse-push-event-client';
import { useModal } from '../../components/actions/modal/constants';
import { ReasonForm } from './ReasonForm';

export const CandidatureDetails = () => {
  const [candidature, setCandidature] = useState<Candidature>();
  const { openModal, closeModal } = useModal();

  const { candidatureId } = useParams();

  useEffect(() => {
    const load = async () => {
      const result = await candidatureApi.findOne(candidatureId);
      setCandidature(result);
      console.log(result, 'result');
    };
    load();
    addPushEventListener('candidatures.update', () => load());
  }, []);

  const accept = async (id: string) => {
    await candidatureApi.acceptCandidature(id);
  };

  const reject = async (id: string) => {
    openModal({
      header: 'Rejet de candidature',
      closable: true,
      children: (
        <ReasonForm
          onSubmit={async (reason: string) => {
            await candidatureApi.rejectCandidature(id, reason);
            closeModal();
          }}
        />
      ),
    });
  };

  return (
    <div>
      <div className="bg-white p-6 rounded-lg flex justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Back />{' '}
            <div className="font-bold text-xl">
              Candidature N° {candidature?.reference}
            </div>
          </div>
          <div className="mt-2 flex items-center gap-8">
            <DisplayStatus
              status={candidature?.status ?? CandidatureStatus.INDETERMINATE}
            />
            <div className="text-sm">
              Date de dépôt :{' '}
              <span className="font-bold">
                {formatDate({ data: candidature?.createdAt ?? '' })}
              </span>
            </div>
          </div>
        </div>
        <div className="flex justify-center items-center gap-4">
          {[
            CandidatureStatus.INDETERMINATE,
            CandidatureStatus.REJECTED,
          ].includes(
            candidature?.status ?? CandidatureStatus.INDETERMINATE,
          ) && (
            <Button
              onClick={() => accept(candidature?.id ?? '')}
              className="text-sm">
              Accepter la candidature
            </Button>
          )}
          {[
            CandidatureStatus.INDETERMINATE,
            CandidatureStatus.ACCEPTED,
          ].includes(
            candidature?.status ?? CandidatureStatus.INDETERMINATE,
          ) && (
            <Button
              onClick={() => reject(candidature?.id ?? '')}
              className="text-sm !bg-red-500">
              Rejeter la candidature
            </Button>
          )}
        </div>
      </div>

      {candidature?.activeProfile.rejectReason ? (
        <div className="my-6 bg-red-50 p-6 rounded flex flex-col gap-2 text-red-700 shadow">
          <span className="text-xs font-bold uppercase">Motif de rejet</span>
          <span className="font-light">
            {candidature?.activeProfile.rejectReason}
          </span>
        </div>
      ) : candidature?.reasons?.length ? (
        <div className="my-6 bg-red-50 p-6 rounded flex flex-col gap-2 text-red-700 shadow">
          <span className="text-xs font-bold uppercase">Motif de rejet</span>

          {candidature?.reasons.map((reason) => (
            <span className="font-light">{reason} </span>
          ))}
        </div>
      ) : (
        <></>
      )}

      <div className="bg-white p-6 rounded lg flex flex-col gap-10 mt-6">
        {candidature?.exam.participantProfileDefinition.map(
          (section: Section, index: number) => (
            <div key={`section_${index}`}>
              <div>
                <span className="font-bold text-3xl">{index + 1}.</span>
                <span className="font-semibold text-lg ml-2">
                  {section.label}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-8 mt-8">
                {section.value.map((profile: ProfileItem, j: number) => (
                  <div
                    key={`profile_${index}_${j}`}
                    className="flex flex-col gap-2">
                    <div className="text-xs font-bold">{profile.label}</div>
                    <RenderCandidatureProfilItem
                      value={candidature.activeProfile.value}
                      profile={profile}
                    />
                  </div>
                ))}
              </div>
            </div>
          ),
        )}
      </div>
    </div>
  );
};
