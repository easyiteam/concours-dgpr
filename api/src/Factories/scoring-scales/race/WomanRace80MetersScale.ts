import { RaceScale } from './RaceScale';
import { ScoringScale } from '../ScoringScale';

export class WomanRace80MetersScale extends RaceScale implements ScoringScale {
  constructor(performance: string) {
    super();
    this.parse(performance);
  }

  score() {
    if (this.seconds < 11 || (this.seconds === 11 && this.tierce <= 8))
      return 20;
    if (this.seconds < 12 || (this.seconds === 12 && this.tierce === 0))
      return 19;
    if (this.seconds === 12 && this.tierce < 3) return 18;
    if (this.seconds === 12 && this.tierce < 5) return 17;
    if (this.seconds === 12 && this.tierce < 7) return 16;
    if (this.seconds === 12 && this.tierce < 9) return 15;
    if (this.seconds < 13 || (this.seconds === 13 && this.tierce === 0))
      return 14;
    if (this.seconds === 13 && this.tierce < 4) return 13;
    if (this.seconds === 13 && this.tierce < 6) return 12;
    if (this.seconds === 13 && this.tierce < 9) return 11;
    if (this.seconds < 14) return 10;
    if (this.seconds === 14 && this.tierce < 3) return 9;
    if (this.seconds === 14 && this.tierce < 5) return 8;
    if (this.seconds === 14 && this.tierce < 8) return 7;
    if (this.seconds < 15) return 6;
    if (this.seconds === 15 && this.tierce < 3) return 5;
    if (this.seconds === 15 && this.tierce < 5) return 4;
    if (this.seconds === 15 && this.tierce < 8) return 3;
    if (this.seconds < 16 || (this.seconds === 16 && this.tierce === 0))
      return 2;
    if (this.seconds === 16 && this.tierce < 4) return 1;
    return 0;
  }
}
