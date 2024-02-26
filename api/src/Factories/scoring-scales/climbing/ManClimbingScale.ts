import { ScoringScale } from '../ScoringScale';
import { RaceScale } from '../race/RaceScale';

export class ManClimbingScale extends RaceScale implements ScoringScale {
  private meter: number | null = null;

  constructor(performance: string) {
    super();
    this.parseClimb(performance);
  }

  parseClimb(performance: string) {
    if (performance.includes('m')) {
      this.meter = +performance.split('m')[0].trim();
      return;
    }
    this.parse(performance);
  }

  scoreMeter() {
    if (this.meter > 9.29) return 3;
    if (this.meter > 8.74) return 2;
    if (this.meter > 4.99) return 1;
    return 0;
  }

  score() {
    if (this.meter !== null) return this.scoreMeter();

    if (this.seconds < 8 || (this.seconds === 8 && this.tierce < 8)) return 20;
    if (this.seconds < 9 || (this.seconds === 9 && this.tierce < 4)) return 19;
    if (this.seconds < 10 || (this.seconds === 10 && this.tierce < 8))
      return 18;
    if (this.seconds < 11 || (this.seconds === 11 && this.tierce < 6))
      return 17;
    if (this.seconds < 12 || (this.seconds === 12 && this.tierce < 5))
      return 16;
    if (this.seconds < 13 || (this.seconds === 13 && this.tierce < 4))
      return 15;
    if (this.seconds < 14 || (this.seconds === 14 && this.tierce < 4))
      return 14;
    if (this.seconds < 15 || (this.seconds === 15 && this.tierce < 5))
      return 13;
    if (this.seconds < 16 || (this.seconds === 16 && this.tierce < 6))
      return 12;
    if (this.seconds < 17 || (this.seconds === 17 && this.tierce < 8))
      return 11;
    if (this.seconds < 19 || (this.seconds === 19 && this.tierce === 0))
      return 10;
    if (this.seconds < 20 || (this.seconds === 20 && this.tierce < 5)) return 9;
    if (this.seconds < 22) return 8;
    if (this.seconds < 23 || (this.seconds === 23 && this.tierce < 7)) return 7;
    if (this.seconds < 25 || (this.seconds === 25 && this.tierce < 4)) return 6;
    if (this.seconds < 27 || (this.seconds === 27 && this.tierce < 3)) return 5;
    if (this.seconds < 29 || (this.seconds === 29 && this.tierce < 3)) return 4;
    return 0;
  }
}
