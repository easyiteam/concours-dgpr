import { ReactNode, useState } from 'react';
import { H1 } from '../../components/display/H1';
import { Tabs } from '../../components/display/Tabs';
import { SigycopResults } from '../../components/views/sigycop/SigycopResults';
import { SigycopThresholds } from '../../components/views/sigycop/SigycopThresholds';

const sigycopTabs = [
  { id: 'results', label: 'Candidats / Résultats' },
  { id: 'thresholds', label: 'Seuils' },
];

const tabComponents: Record<string, ReactNode> = {
  results: <SigycopResults />,
  thresholds: <SigycopThresholds />,
};

export const Sigycop = () => {
  const [currentTab, setCurrentTab] = useState('results');

  const handleTabChanged = ({ id }: { id: string }) => {
    setCurrentTab(id);
  };

  return (
    <div>
      <H1>Visite médicale (SIGYCOP)</H1>
      <div className="mt-8">
        <Tabs
          values={sigycopTabs}
          onTabChanged={handleTabChanged}>
          {tabComponents[currentTab]}
        </Tabs>
      </div>
    </div>
  );
};
