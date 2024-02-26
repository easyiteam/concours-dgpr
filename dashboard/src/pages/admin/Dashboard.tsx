/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react';
import { H1 } from '../../components/display/H1';
import { Tboard, candidatureApi } from '../../api/candidature.api';
import { useNavigate, useParams } from 'react-router-dom';
import { addPushEventListener } from '@asaje/sse-push-event-client';
import { Icon } from '../../components/display/Icon';
import { Table } from '../../components/table/Table';
import { candidaturesCols } from '../../data/candidatures.cols';
import { Candidature } from '../../api/typings';

export const Dashboard = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [tboard, setTboard] = useState<Tboard>({
    candidatures: [],
    allCount: 0,
    newCount: 0,
    acceptedCount: 0,
    rejectedCount: 0,
  });

  const load = async () => {
    const result = await candidatureApi.tboadByExam(id ?? '');
    setTboard(result);
  };

  useEffect(() => {
    load();
    addPushEventListener('candidatures.update', () => load());
  }, []);

  const next = (row: Candidature) => {
    navigate(`/exam-details/${id}/candidature/${row.id}`);
  };

  return (
    <div className="pt-4">
      <H1>Tableau de board</H1>

      <div className="bg-white rounded-lg p-6 grid grid-cols-2 gap-x-8 gap-y-6 mt-4">
        <DisplayValue
          color="text-orange-500"
          bg="bg-orange-50"
          value={tboard.allCount}
          icon="apps"
          label="Total des candidatures reçues"
        />
        <DisplayValue
          color="text-blue-500"
          bg="bg-blue-50"
          value={tboard.newCount}
          icon="pending"
          label="Total des nouvelles candidatures"
        />
        <DisplayValue
          color="text-green-500"
          bg="bg-green-50"
          value={tboard.acceptedCount}
          icon="check_circle"
          label="Total des candidatures acceptées"
        />
        <DisplayValue
          color="text-red-500"
          bg="bg-red-50"
          value={tboard.rejectedCount}
          icon="cancel"
          label="Total des candidatures rejetées"
        />
      </div>

      <div className="mt-8">
        <H1>Liste des candidats</H1>
        <div className="bg-white mt-4">
          <Table
            cols={candidaturesCols(next)}
            rows={tboard.candidatures as any}
          />
        </div>
      </div>
    </div>
  );
};

type DisplayValueProps = {
  icon: string;
  color: string;
  bg: string;
  value: number;
  label: string;
};

export function DisplayValue({
  color,
  icon,
  value,
  label,
  bg,
}: DisplayValueProps) {
  return (
    <div className="border rounded-lg p-6 flex items-center gap-4">
      <div className={['rounded rounded-full p-2', bg].join(' ')}>
        <Icon
          name={icon}
          className={color}
          size={40}
        />
      </div>
      <div>
        <div className="font-bold text-3xl">{value}</div>
        <div className="font-light text-sm">{label}</div>
      </div>
    </div>
  );
}
