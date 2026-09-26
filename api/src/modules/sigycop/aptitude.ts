export const SIGYCOP_AXES = ['s', 'i', 'g', 'y', 'c', 'o', 'p'] as const;

export type SigycopScores = Record<(typeof SIGYCOP_AXES)[number], number>;

export function computeSigycopAptitude(
  scores: SigycopScores,
  thresholds: SigycopScores,
): { apte: boolean; failedAxes: string[] } {
  const failedAxes = SIGYCOP_AXES.filter((axis) => scores[axis] > thresholds[axis]);
  return { apte: failedAxes.length === 0, failedAxes };
}
