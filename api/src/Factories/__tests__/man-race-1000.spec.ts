import { ManRace1000MetersScale } from '../scoring-scales/race/ManRace1000MetersScale';

describe('Man race 1000 algorithm', () => {
  it('should return 20', () => {
    const raceScale = new ManRace1000MetersScale('5');
    console.log(raceScale.score(), raceScale.toString());
    expect(raceScale.score()).toBe(20);
  });

  it('should return 20', () => {
    const raceScale = new ManRace1000MetersScale('2.2.0');
    console.log(raceScale.score(), raceScale.toString());
    expect(raceScale.score()).toBe(20);
  });

  it('should return 19', () => {
    const raceScale = new ManRace1000MetersScale('2.57.0');
    console.log(raceScale.score(), raceScale.toString());
    expect(raceScale.score()).toBe(19);
  });

  it('should return 18', () => {
    const raceScale = new ManRace1000MetersScale('3.03.0');
    console.log(raceScale.score(), raceScale.toString());
    expect(raceScale.score()).toBe(18);
  });

  it('should return 17', () => {
    const raceScale = new ManRace1000MetersScale('3.07.9');
    console.log(raceScale.score(), raceScale.toString());
    expect(raceScale.score()).toBe(17);
  });

  it('should return 16', () => {
    const raceScale = new ManRace1000MetersScale('3.11.9');
    console.log(raceScale.score(), raceScale.toString());
    expect(raceScale.score()).toBe(16);
  });

  it('should return 15', () => {
    const raceScale = new ManRace1000MetersScale('3.16.9');
    console.log(raceScale.score(), raceScale.toString());
    expect(raceScale.score()).toBe(15);
  });

  it('should return 14', () => {
    const raceScale = new ManRace1000MetersScale('3.20.1');
    console.log(raceScale.score(), raceScale.toString());
    expect(raceScale.score()).toBe(14);
  });

  it('should return 13', () => {
    const raceScale = new ManRace1000MetersScale('3.23.4');
    console.log(raceScale.score(), raceScale.toString());
    expect(raceScale.score()).toBe(13);
  });

  it('should return 12', () => {
    const raceScale = new ManRace1000MetersScale('3.27.8');
    console.log(raceScale.score(), raceScale.toString());
    expect(raceScale.score()).toBe(12);
  });

  it('should return 11', () => {
    const raceScale = new ManRace1000MetersScale('3.32.2');
    console.log(raceScale.score(), raceScale.toString());
    expect(raceScale.score()).toBe(11);
  });

  it('should return 10', () => {
    const raceScale = new ManRace1000MetersScale('3.37.8');
    console.log(raceScale.score(), raceScale.toString());
    expect(raceScale.score()).toBe(10);
  });

  it('should return 9', () => {
    const raceScale = new ManRace1000MetersScale('3.41.6');
    console.log(raceScale.score(), raceScale.toString());
    expect(raceScale.score()).toBe(9);
  });

  it('should return 8', () => {
    const raceScale = new ManRace1000MetersScale('3.46.3');
    console.log(raceScale.score(), raceScale.toString());
    expect(raceScale.score()).toBe(8);
  });

  it('should return 7', () => {
    const raceScale = new ManRace1000MetersScale('3.51.1');
    console.log(raceScale.score(), raceScale.toString());
    expect(raceScale.score()).toBe(7);
  });

  it('should return 6', () => {
    const raceScale = new ManRace1000MetersScale('3.56.1');
    console.log(raceScale.score(), raceScale.toString());
    expect(raceScale.score()).toBe(6);
  });

  it('should return 5', () => {
    const raceScale = new ManRace1000MetersScale('4.02.3');
    console.log(raceScale.score(), raceScale.toString());
    expect(raceScale.score()).toBe(5);
  });

  it('should return 4', () => {
    const raceScale = new ManRace1000MetersScale('4.07.5');
    console.log(raceScale.score(), raceScale.toString());
    expect(raceScale.score()).toBe(4);
  });

  it('should return 3', () => {
    const raceScale = new ManRace1000MetersScale('4.12.9');
    console.log(raceScale.score(), raceScale.toString());
    expect(raceScale.score()).toBe(3);
  });

  it('should return 2', () => {
    const raceScale = new ManRace1000MetersScale('4.17.4');
    console.log(raceScale.score(), raceScale.toString());
    expect(raceScale.score()).toBe(2);
  });

  it('should return 1', () => {
    const raceScale = new ManRace1000MetersScale('4.22.8');
    console.log(raceScale.score(), raceScale.toString());
    expect(raceScale.score()).toBe(1);
  });

  it('should return 0', () => {
    const raceScale = new ManRace1000MetersScale('17.0.0');
    console.log(raceScale.score(), raceScale.toString());
    expect(raceScale.score()).toBe(0);
  });

  it('should return 0', () => {
    const raceScale = new ManRace1000MetersScale('50');
    console.log(raceScale.score(), raceScale.toString());
    expect(raceScale.score()).toBe(20);
  });
});
