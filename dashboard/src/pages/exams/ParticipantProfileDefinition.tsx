import { useState } from 'react';
import { Button } from '../../components/buttons/Button';
import { Input } from '../../components/form-fields/Input';
import { CreateProfileField } from './CreateProfileField';
import { defaultParticipantProfile } from '../../data/participant-profile.default';

export type Section = {
  label: string;
  value: ProfileItem[];
};

type PPDProps = {
  value?: Section[];
  onChange: (v: Section[]) => void;
};

export type ProfileItem = {
  key: string;
  label: string;
  type: 'text' | 'number' | 'email' | 'date' | 'file' | 'choice' | 'paiement';
  validation: {
    min?: number | string;
    max?: number | string;
    minLength?: string;
    maxLength?: string;
    amount?: number;
    values?: string;
    apiKey?: string;
    required?: boolean;
  };
};

export const ParticipantProfileDefinition = ({
  value = defaultParticipantProfile,
  onChange,
}: PPDProps) => {
  const [profiles, setProfiles] = useState<Section[]>(value);
  const [sectionLabel, setSectionLabel] = useState('');
  const [currentIndex, setCurrentIndex] = useState<number | null>(null);

  const addSection = () => {
    const newProfiles = [...profiles, { label: sectionLabel, value: [] }];
    setProfiles(newProfiles);
    onChange(newProfiles);
    setSectionLabel('');
  };

  const updateSection = () => {
    if (currentIndex !== null) {
      profiles[currentIndex].label = sectionLabel;
      setProfiles([...profiles]);
      onChange([...profiles]);
      setSectionLabel('');
      setCurrentIndex(null);
    }
  };

  const saveSection = () => {
    if (currentIndex !== null) return updateSection();
    addSection();
  };

  const setProfileValue = (label: string, value: ProfileItem[]) => {
    const profile = profiles.find((p) => p.label === label);
    if (profile) {
      profile.value = value;
      setProfiles((profiles) => [...profiles]);
    }
    onChange([...profiles]);
  };

  const removeProfile = (label: string) => {
    const newProfiles = profiles.filter((p) => p.label !== label);
    setProfiles(newProfiles);
    onChange(newProfiles);
  };

  const startEditing = (index: number, label: string) => {
    setCurrentIndex(index);
    setSectionLabel(label);
  };

  console.log(profiles);

  return (
    <div>
      <div className="flex flex-col gap-4">
        {profiles.map((profile, index) => (
          <CreateProfileField
            key={`p_${index}`}
            label={profile.label}
            onChange={(v) => setProfileValue(profile.label, v)}
            onRemove={removeProfile}
            value={profile.value}
            startEditing={(label: string) => startEditing(index, label)}
          />
        ))}
      </div>

      <div className="grid grid-cols-[1fr_auto] gap-2 mt-4">
        <Input
          placeholder="Libellé de la section"
          value={sectionLabel}
          onChange={(e) => setSectionLabel(e.target.value.toUpperCase())}
        />
        <Button
          className="!bg-gray-700 text-white text-xs rounded px-4 py-0 mt-1"
          onClick={saveSection}>
          {currentIndex !== null ? 'Modifier' : 'Ajouter'} la section
        </Button>
      </div>
    </div>
  );
};
