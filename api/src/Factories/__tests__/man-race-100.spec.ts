import { ManRace100MetersScale } from '../scoring-scales/race/ManRace100MetersScale';

describe('Man race 100 algorithm', () => {
  it('should return 20', () => {
    const raceScale = new ManRace100MetersScale('5');
    console.log(raceScale.score(), raceScale.toString());
    expect(raceScale.score()).toBe(20);
  });

  it('should return 20', () => {
    const raceScale = new ManRace100MetersScale('7.6');
    console.log(raceScale.score(), raceScale.toString());
    expect(raceScale.score()).toBe(20);
  });

  it('should return 19', () => {
    const raceScale = new ManRace100MetersScale('12.5');
    console.log(raceScale.score(), raceScale.toString());
    expect(raceScale.score()).toBe(19);
  });

  it('should return 18', () => {
    const raceScale = new ManRace100MetersScale('12.7');
    console.log(raceScale.score(), raceScale.toString());
    expect(raceScale.score()).toBe(18);
  });

  it('should return 17', () => {
    const raceScale = new ManRace100MetersScale('12.9');
    console.log(raceScale.score(), raceScale.toString());
    expect(raceScale.score()).toBe(17);
  });

  it('should return 16', () => {
    const raceScale = new ManRace100MetersScale('13');
    console.log(raceScale.score(), raceScale.toString());
    expect(raceScale.score()).toBe(16);
  });

  it('should return 15', () => {
    const raceScale = new ManRace100MetersScale('13.3');
    console.log(raceScale.score(), raceScale.toString());
    expect(raceScale.score()).toBe(15);
  });

  it('should return 14', () => {
    const raceScale = new ManRace100MetersScale('13.5');
    console.log(raceScale.score(), raceScale.toString());
    expect(raceScale.score()).toBe(14);
  });

  it('should return 13', () => {
    const raceScale = new ManRace100MetersScale('13.7');
    console.log(raceScale.score(), raceScale.toString());
    expect(raceScale.score()).toBe(13);
  });

  it('should return 13', () => {
    const raceScale = new ManRace100MetersScale('13.87');
    console.log(raceScale.score(), raceScale.toString());
    expect(raceScale.score()).toBe(13);
  });

  it('should return 12', () => {
    const raceScale = new ManRace100MetersScale('14');
    console.log(raceScale.score(), raceScale.toString());
    expect(raceScale.score()).toBe(12);
  });

  it('should return 11', () => {
    const raceScale = new ManRace100MetersScale('14.3');
    console.log(raceScale.score(), raceScale.toString());
    expect(raceScale.score()).toBe(11);
  });

  it('should return 10', () => {
    const raceScale = new ManRace100MetersScale('14.5');
    console.log(raceScale.score(), raceScale.toString());
    expect(raceScale.score()).toBe(10);
  });

  it('should return 9', () => {
    const raceScale = new ManRace100MetersScale('14.7');
    console.log(raceScale.score(), raceScale.toString());
    expect(raceScale.score()).toBe(9);
  });

  it('should return 8', () => {
    const raceScale = new ManRace100MetersScale('14.9');
    console.log(raceScale.score(), raceScale.toString());
    expect(raceScale.score()).toBe(8);
  });

  it('should return 8', () => {
    const raceScale = new ManRace100MetersScale('15');
    console.log(raceScale.score(), raceScale.toString());
    expect(raceScale.score()).toBe(8);
  });

  it('should return 7', () => {
    const raceScale = new ManRace100MetersScale('15.3');
    console.log(raceScale.score(), raceScale.toString());
    expect(raceScale.score()).toBe(7);
  });

  it('should return 6', () => {
    const raceScale = new ManRace100MetersScale('15.5');
    console.log(raceScale.score(), raceScale.toString());
    expect(raceScale.score()).toBe(6);
  });

  it('should return 5', () => {
    const raceScale = new ManRace100MetersScale('15.8');
    console.log(raceScale.score(), raceScale.toString());
    expect(raceScale.score()).toBe(5);
  });

  it('should return 5', () => {
    const raceScale = new ManRace100MetersScale('15.98');
    console.log(raceScale.score(), raceScale.toString());
    expect(raceScale.score()).toBe(4);
  });

  it('should return 4', () => {
    const raceScale = new ManRace100MetersScale('16.1');
    console.log(raceScale.score(), raceScale.toString());
    expect(raceScale.score()).toBe(4);
  });

  it('should return 3', () => {
    const raceScale = new ManRace100MetersScale('16.4');
    console.log(raceScale.score(), raceScale.toString());
    expect(raceScale.score()).toBe(3);
  });

  it('should return 2', () => {
    const raceScale = new ManRace100MetersScale('16.7');
    console.log(raceScale.score(), raceScale.toString());
    expect(raceScale.score()).toBe(2);
  });

  it('should return 1', () => {
    const raceScale = new ManRace100MetersScale('16.9');
    console.log(raceScale.score(), raceScale.toString());
    expect(raceScale.score()).toBe(1);
  });

  it('should return 0', () => {
    const raceScale = new ManRace100MetersScale('17');
    console.log(raceScale.score(), raceScale.toString());
    expect(raceScale.score()).toBe(0);
  });

  it('should return 0', () => {
    const raceScale = new ManRace100MetersScale('50');
    console.log(raceScale.score(), raceScale.toString());
    expect(raceScale.score()).toBe(0);
  });
});
