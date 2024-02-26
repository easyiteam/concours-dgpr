import { Performance, PerformanceType, Profile } from '../api/typings';

export const performancesCols = [
  {
    label: "N° d'inscription",
    render: (row: Profile) => <div>{row.candidature.reference}</div>,
  },
  {
    label: 'Centre',
    render: (row: Profile) => (
      <div>{row.candidature.activeProfile?.value.center}</div>
    ),
  },
  {
    label: 'Nom et prénom(s)',
    render: (row: Profile) => (
      <div>
        {row.candidature.activeProfile?.value.lastname}{' '}
        {row.candidature.activeProfile?.value.firstname}
      </div>
    ),
  },
  {
    label: 'Genre',
    render: (row: Profile) => (
      <div>{row.candidature.activeProfile?.value.gender}</div>
    ),
  },
  {
    label: 'Course',
    render: (row: Profile) => {
      const perf = getPerformance(
        [PerformanceType.ManRace100Meters, PerformanceType.WomanRace80Meters],
        row.performances,
      );
      return (
        <div>
          "{perf?.value ?? '-'}" | <b>{perf?.score ?? 0}</b>
        </div>
      );
    },
  },
  {
    label: 'Endurance',
    render: (row: Profile) => {
      const perf = getPerformance(
        [PerformanceType.ManRace1000Meters, PerformanceType.WomanRace800Meters],
        row.performances,
      );
      return (
        <div>
          "{perf?.value ?? '-'}" | <b>{perf?.score ?? 0}</b>
        </div>
      );
    },
  },
  {
    label: 'Grimpé',
    render: (row: Profile) => {
      const perf = getPerformance(
        [PerformanceType.ManClimbing, PerformanceType.WomanClimbing],
        row.performances,
      );
      return (
        <div>
          "{perf?.value ?? '-'}" | <b>{perf?.score ?? 0}</b>
        </div>
      );
    },
  },
  {
    label: 'Total',
    render: (row: Profile) => <div>{row.total}</div>,
  },
  {
    label: 'Moy',
    render: (row: Profile) => <div>{row.mean}</div>,
  },
];

function getPerformance(types: PerformanceType[], values: Performance[]) {
  return values.find((v) => types.includes(v.type));
}
