export interface ScoringScale {
  parse: (performance: string) => void;
  score: () => number;
}
