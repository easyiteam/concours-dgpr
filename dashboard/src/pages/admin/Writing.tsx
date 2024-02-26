import { ReactNode, useState } from 'react';
import { H1 } from '../../components/display/H1';
import { Tabs } from '../../components/display/Tabs';
import { WritingCandidates } from '../../components/views/writing/WritingCandidates';
import { WritingCenter } from '../../components/views/writing/WritingCenter';
import { WritingDeliberation } from '../../components/views/writing/WritingDeliberation';
import { WritingFields } from '../../components/views/writing/WritingFields';

const sportTabs = [
  { id: 'candidates', label: 'Candidats' },
  { id: 'fields', label: 'Matières' },
  { id: 'centers', label: 'Centre de composition' },
  { id: 'deliberation', label: 'Délibérations' },
];

const tabComponents: Record<string, ReactNode> = {
  candidates: <WritingCandidates />,
  fields: <WritingFields />,
  centers: <WritingCenter />,
  deliberation: <WritingDeliberation />,
};

export const Writing = () => {
  const [currentTab, setCurrentTab] = useState('candidates');

  const handleTabChanged = ({ id }: { id: string }) => {
    setCurrentTab(id);
  };
  return (
    <div>
      <H1>Phase écrite</H1>
      <div className="mt-8">
        <Tabs
          values={sportTabs}
          onTabChanged={handleTabChanged}>
          {tabComponents[currentTab]}
        </Tabs>
      </div>
    </div>
  );
};
