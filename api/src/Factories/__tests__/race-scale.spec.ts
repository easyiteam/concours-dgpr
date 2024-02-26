import { RaceScale } from './../scoring-scales/race/RaceScale';

describe('Race scale algorithm', () => {
  it('should return 0.10.0', () => {
    const raceScale = new RaceScale();
    raceScale.parse('10');
    expect(raceScale.toString()).toBe('0.10.0');
  });

  it('should return 0.11.4', () => {
    const raceScale = new RaceScale();
    raceScale.parse('11.4');
    expect(raceScale.toString()).toBe('0.11.4');
  });
});
