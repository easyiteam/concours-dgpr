import { ReactNode, useState } from 'react';
import { H1 } from '../../components/display/H1';
import { Tabs } from '../../components/display/Tabs';
import { Steps } from './Steps';

const tabComponents: Record<string, ReactNode> = {
  steps: <Steps />,
  // signers: <Signers />,
};

const tabsOptions = [
  { id: 'steps', label: "Phases d'examen" },
  // { id: 'signers', label: 'Signataires' },
];

export const ExamSettings = () => {
  const [currentTab, setCurrentTab] = useState<string>('steps');

  return (
    <div>
      <H1>Paramètres</H1>

      <div className="mt-8">
        <Tabs
          values={tabsOptions}
          onTabChanged={({ id }) => setCurrentTab(id)}>
          {tabComponents[currentTab]}
        </Tabs>
      </div>
    </div>
  );
};
