import { useFetch } from '../../../hooks/useFetch';
import { sportApi } from '../../../api/sport.api';
import { useParams } from 'react-router-dom';
import { SportStatsCard } from '../../cards/SportStatsCard';

export type SportPresenceStats = {
  presents: {
    all: number;
    mens: number;
    womens: number;
    centers: Record<string, { all: number; mens: number; womens: number }>;
  };
  absents: {
    all: number;
    mens: number;
    womens: number;
    centers: Record<string, { all: number; mens: number; womens: number }>;
  };
};

const defaultValue = {
  presents: { all: 0, mens: 0, womens: 0, centers: {} },
  absents: { all: 0, mens: 0, womens: 0, centers: {} },
};

export const SportStatistics = () => {
  const { id } = useParams();

  const { loading, data } = useFetch<SportPresenceStats>({
    cb: async () => await sportApi.examStats(id ?? ''),
    defaultValue,
    event: 'sports.update',
  });

  if (loading) return <></>;

  return (
    <div className="mt-8">
      <div className="grid grid-cols-2 gap-8">
        <div>
          <div className="font-bold text-xl text-slate-500">Présents</div>
          <div className="flex flex-col gap-6 mt-6">
            <SportStatsCard
              label="Tous les candidats"
              all={data?.presents.all ?? 0}
              mens={data?.presents.mens ?? 0}
              womens={data?.presents.womens ?? 0}
            />

            {Object.entries(data?.presents.centers ?? []).map(
              ([label, info]) => (
                <SportStatsCard
                  key={label}
                  label={label}
                  all={info.all}
                  womens={info.womens}
                  mens={info.mens}
                />
              ),
            )}
          </div>
        </div>

        <div>
          <div className="font-bold text-xl text-slate-500">Absents</div>
          <div className="flex flex-col gap-6 mt-6">
            <SportStatsCard
              label="Tous les candidats"
              all={data?.absents.all ?? 0}
              mens={data?.absents.mens ?? 0}
              womens={data?.absents.womens ?? 0}
            />

            {Object.entries(data?.absents.centers ?? []).map(
              ([label, info]) => (
                <SportStatsCard
                  key={label}
                  label={label}
                  all={info.all}
                  womens={info.womens}
                  mens={info.mens}
                />
              ),
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
