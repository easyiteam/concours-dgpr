import { RaceScale } from './RaceScale';
import { ScoringScale } from '../ScoringScale';

export class ManRace1000MetersScale extends RaceScale implements ScoringScale {
  constructor(performance: string) {
    super();
    this.parse(performance);
  }

  score() {
    if (this.minutes < 2) return 20;

    if (this.minutes === 2) {
      if (this.seconds < 56 || (this.seconds === 56 && this.tierce < 7))
        return 20;
      return 19;
    }

    if (this.minutes === 3) {
      if (this.seconds === 0 && this.tierce < 3) return 19;
      if (this.seconds <= 4) return 18;
      if (this.seconds < 8) return 17;
      if (this.seconds < 12) return 16;
      if (this.seconds <= 16) return 15;
      if (this.seconds < 20 || (this.seconds === 20 && this.tierce < 2))
        return 14;
      if (this.seconds < 24 || (this.seconds === 24 && this.tierce < 5))
        return 13;
      if (this.seconds < 28 || (this.seconds === 28 && this.tierce < 9))
        return 12;
      if (this.seconds < 33 || (this.seconds === 33 && this.tierce < 3))
        return 11;
      if (this.seconds < 37 || (this.seconds === 37 && this.tierce < 9))
        return 10;
      if (this.seconds < 42 || (this.seconds === 42 && this.tierce < 7))
        return 9;
      if (this.seconds < 47 || (this.seconds === 47 && this.tierce < 4))
        return 8;
      if (this.seconds < 52 || (this.seconds === 52 && this.tierce < 2))
        return 7;
      if (this.seconds < 57 || (this.seconds === 57 && this.tierce < 2))
        return 6;
      return 6;
    }

    if (this.minutes === 4) {
      if (this.seconds < 2 || (this.seconds === 2 && this.tierce < 4)) return 5;
      if (this.seconds < 7 || (this.seconds === 7 && this.tierce < 6)) return 4;
      if (this.seconds < 13) return 3;
      if (this.seconds < 18 || (this.seconds === 18 && this.tierce < 5))
        return 2;
      if (this.seconds < 22 || (this.seconds === 22 && this.tierce < 9))
        return 1;
      return 0;
    }

    return 0;
  }
}
