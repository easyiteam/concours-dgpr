import { ReactNode, useState } from 'react';
import { H1 } from '../../components/display/H1';
import { Tabs } from '../../components/display/Tabs';
import { SportStatistics } from '../../components/views/sport/SportStatistics';
import { SportPresents } from '../../components/views/sport/SportPresents';
import { SportAbsents } from '../../components/views/sport/SportAbsents';
import { SportPerformance } from '../../components/views/sport/SportPerformance';
import { SportDeliberation } from '../../components/views/sport/SportDeliberation';

const sportTabs = [
  { id: 'stats', label: 'Statistiques' },
  { id: 'presents', label: 'Présents' },
  { id: 'absents', label: 'Absents' },
  { id: 'performances', label: 'Performances' },
  { id: 'deliberation', label: 'Délibérations' },
];

const tabComponents: Record<string, ReactNode> = {
  stats: <SportStatistics />,
  presents: <SportPresents />,
  absents: <SportAbsents />,
  performances: <SportPerformance />,
  deliberation: <SportDeliberation />,
};

export const Sport = () => {
  const [currentTab, setCurrentTab] = useState('stats');

  const handleTabChanged = ({ id }: { id: string }) => {
    setCurrentTab(id);
  };

  return (
    <div>
      <H1>Phase sportive</H1>
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
