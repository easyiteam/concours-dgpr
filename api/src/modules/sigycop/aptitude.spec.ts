import { computeSigycopAptitude, SigycopScores } from './aptitude';

const thresholds: SigycopScores = { s: 3, i: 3, g: 4, y: 4, c: 2, o: 3, p: 4 };

describe('computeSigycopAptitude', () => {
  it('declares apte when every axis is within its threshold', () => {
    const scores: SigycopScores = { s: 2, i: 3, g: 4, y: 3, c: 2, o: 1, p: 2 };
    expect(computeSigycopAptitude(scores, thresholds)).toEqual({ apte: true, failedAxes: [] });
  });

  it('declares inapte and lists the single axis over threshold', () => {
    const scores: SigycopScores = { s: 2, i: 3, g: 4, y: 5, c: 2, o: 1, p: 2 };
    expect(computeSigycopAptitude(scores, thresholds)).toEqual({ apte: false, failedAxes: ['y'] });
  });

  it('lists every axis that exceeds its threshold, not just the first', () => {
    const scores: SigycopScores = { s: 4, i: 3, g: 4, y: 5, c: 2, o: 1, p: 2 };
    expect(computeSigycopAptitude(scores, thresholds)).toEqual({ apte: false, failedAxes: ['s', 'y'] });
  });

  it('treats a score exactly equal to the threshold as passing', () => {
    const scores: SigycopScores = { s: 3, i: 3, g: 4, y: 4, c: 2, o: 3, p: 4 };
    expect(computeSigycopAptitude(scores, thresholds)).toEqual({ apte: true, failedAxes: [] });
  });
});
