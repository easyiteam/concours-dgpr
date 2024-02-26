import { WomanRace80MetersScale } from '../scoring-scales/race/WomanRace80MetersScale';

describe('Woman race 80 algorithm', () => {
  it('should return 20', () => {
    const raceScale = new WomanRace80MetersScale('5');
    console.log(raceScale.score(), raceScale.toString());
    expect(raceScale.score()).toBe(20);
  });

  it('should return 20', () => {
    const raceScale = new WomanRace80MetersScale('7.6');
    console.log(raceScale.score(), raceScale.toString());
    expect(raceScale.score()).toBe(20);
  });

  it('should return 19', () => {
    const raceScale = new WomanRace80MetersScale('11.9');
    console.log(raceScale.score(), raceScale.toString());
    expect(raceScale.score()).toBe(19);
  });

  it('should return 18', () => {
    const raceScale = new WomanRace80MetersScale('12.01');
    console.log(raceScale.score(), raceScale.toString());
    expect(raceScale.score()).toBe(18);
  });

  it('should return 9', () => {
    const raceScale = new WomanRace80MetersScale('14.03');
    console.log(raceScale.score(), raceScale.toString());
    expect(raceScale.score()).toBe(9);
  });

  it('should return 9', () => {
    const raceScale = new WomanRace80MetersScale('14.01');
    console.log(raceScale.score(), raceScale.toString());
    expect(raceScale.score()).toBe(9);
  });

  it('should return 18', () => {
    const raceScale = new WomanRace80MetersScale('12.2');
    console.log(raceScale.score(), raceScale.toString());
    expect(raceScale.score()).toBe(18);
  });

  it('should return 17', () => {
    const raceScale = new WomanRace80MetersScale('12.4');
    console.log(raceScale.score(), raceScale.toString());
    expect(raceScale.score()).toBe(17);
  });

  it('should return 16', () => {
    const raceScale = new WomanRace80MetersScale('12.6');
    console.log(raceScale.score(), raceScale.toString());
    expect(raceScale.score()).toBe(16);
  });

  it('should return 15', () => {
    const raceScale = new WomanRace80MetersScale('12.8');
    console.log(raceScale.score(), raceScale.toString());
    expect(raceScale.score()).toBe(15);
  });

  it('should return 14', () => {
    const raceScale = new WomanRace80MetersScale('12.9');
    console.log(raceScale.score(), raceScale.toString());
    expect(raceScale.score()).toBe(14);
  });

  it('should return 13', () => {
    const raceScale = new WomanRace80MetersScale('13.3');
    console.log(raceScale.score(), raceScale.toString());
    expect(raceScale.score()).toBe(13);
  });

  it('should return 12', () => {
    const raceScale = new WomanRace80MetersScale('13.5');
    console.log(raceScale.score(), raceScale.toString());
    expect(raceScale.score()).toBe(12);
  });

  it('should return 11', () => {
    const raceScale = new WomanRace80MetersScale('13.7');
    console.log(raceScale.score(), raceScale.toString());
    expect(raceScale.score()).toBe(11);
  });

  it('should return 10', () => {
    const raceScale = new WomanRace80MetersScale('13.9');
    console.log(raceScale.score(), raceScale.toString());
    expect(raceScale.score()).toBe(10);
  });

  it('should return 9', () => {
    const raceScale = new WomanRace80MetersScale('14.2');
    console.log(raceScale.score(), raceScale.toString());
    expect(raceScale.score()).toBe(9);
  });

  it('should return 8', () => {
    const raceScale = new WomanRace80MetersScale('14.4');
    console.log(raceScale.score(), raceScale.toString());
    expect(raceScale.score()).toBe(8);
  });

  it('should return 7', () => {
    const raceScale = new WomanRace80MetersScale('14.7');
    console.log(raceScale.score(), raceScale.toString());
    expect(raceScale.score()).toBe(7);
  });

  it('should return 6', () => {
    const raceScale = new WomanRace80MetersScale('14.9');
    console.log(raceScale.score(), raceScale.toString());
    expect(raceScale.score()).toBe(6);
  });

  it('should return 5', () => {
    const raceScale = new WomanRace80MetersScale('15.2');
    console.log(raceScale.score(), raceScale.toString());
    expect(raceScale.score()).toBe(5);
  });

  it('should return 4', () => {
    const raceScale = new WomanRace80MetersScale('15.4');
    console.log(raceScale.score(), raceScale.toString());
    expect(raceScale.score()).toBe(4);
  });

  it('should return 3', () => {
    const raceScale = new WomanRace80MetersScale('15.7');
    console.log(raceScale.score(), raceScale.toString());
    expect(raceScale.score()).toBe(3);
  });

  it('should return 2', () => {
    const raceScale = new WomanRace80MetersScale('16');
    console.log(raceScale.score(), raceScale.toString());
    expect(raceScale.score()).toBe(2);
  });

  it('should return 1', () => {
    const raceScale = new WomanRace80MetersScale('16.2');
    console.log(raceScale.score(), raceScale.toString());
    expect(raceScale.score()).toBe(1);
  });

  it('should return 0', () => {
    const raceScale = new WomanRace80MetersScale('17');
    console.log(raceScale.score(), raceScale.toString());
    expect(raceScale.score()).toBe(0);
  });

  it('should return 0', () => {
    const raceScale = new WomanRace80MetersScale('50');
    console.log(raceScale.score(), raceScale.toString());
    expect(raceScale.score()).toBe(0);
  });
});
