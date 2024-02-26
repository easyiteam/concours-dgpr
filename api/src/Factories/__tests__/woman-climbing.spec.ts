import { WomanClimbingScale } from '../scoring-scales/climbing/WomanClimbingScale';

describe('Woman climbing algorithm', () => {
  it('should return 20', () => {
    const raceScale = new WomanClimbingScale('5');
    expect(raceScale.score()).toBe(20);
  });

  it('should return 20', () => {
    const raceScale = new WomanClimbingScale('7.6');
    expect(raceScale.score()).toBe(20);
  });

  it('should return 19', () => {
    const raceScale = new WomanClimbingScale('8.5');
    expect(raceScale.score()).toBe(19);
  });

  it('should return 18', () => {
    const raceScale = new WomanClimbingScale('9');
    expect(raceScale.score()).toBe(18);
  });

  it('should return 17', () => {
    const raceScale = new WomanClimbingScale('10.3');
    expect(raceScale.score()).toBe(17);
  });

  it('should return 16', () => {
    const raceScale = new WomanClimbingScale('11');
    expect(raceScale.score()).toBe(16);
  });

  it('should return 15', () => {
    const raceScale = new WomanClimbingScale('12');
    expect(raceScale.score()).toBe(15);
  });

  it('should return 14', () => {
    const raceScale = new WomanClimbingScale('12.5 ');
    expect(raceScale.score()).toBe(14);
  });

  it('should return 13', () => {
    const raceScale = new WomanClimbingScale('13');
    expect(raceScale.score()).toBe(13);
  });

  it('should return 12', () => {
    const raceScale = new WomanClimbingScale('14');
    expect(raceScale.score()).toBe(12);
  });

  it('should return 11', () => {
    const raceScale = new WomanClimbingScale('15');
    expect(raceScale.score()).toBe(11);
  });

  it('should return 10', () => {
    const raceScale = new WomanClimbingScale('16.3');
    expect(raceScale.score()).toBe(10);
  });

  it('should return 9', () => {
    const raceScale = new WomanClimbingScale('18  ');
    expect(raceScale.score()).toBe(9);
  });

  it('should return 8', () => {
    const raceScale = new WomanClimbingScale('20');
    expect(raceScale.score()).toBe(8);
  });

  it('should return 7', () => {
    const raceScale = new WomanClimbingScale('4.5m');
    expect(raceScale.score()).toBe(7);
  });

  it('should return 6', () => {
    const raceScale = new WomanClimbingScale('4.25m');
    expect(raceScale.score()).toBe(6);
  });

  it('should return 5', () => {
    const raceScale = new WomanClimbingScale('4m');
    expect(raceScale.score()).toBe(5);
  });

  it('should return 4', () => {
    const raceScale = new WomanClimbingScale('3.75m');
    expect(raceScale.score()).toBe(4);
  });

  it('should return 3', () => {
    const raceScale = new WomanClimbingScale('3.50m');
    expect(raceScale.score()).toBe(3);
  });

  it('should return 2', () => {
    const raceScale = new WomanClimbingScale('3.25m');
    expect(raceScale.score()).toBe(2);
  });

  it('should return 1', () => {
    const raceScale = new WomanClimbingScale('3.15m');
    expect(raceScale.score()).toBe(1);
  });

  it('should return 0', () => {
    const raceScale = new WomanClimbingScale('0m');
    console.log(raceScale.score(), raceScale.toString());
    expect(raceScale.score()).toBe(0);
  });

  it('should return 0', () => {
    const raceScale = new WomanClimbingScale('40');
    expect(raceScale.score()).toBe(0);
  });

  it('should return 0', () => {
    const raceScale = new WomanClimbingScale('50');
    expect(raceScale.score()).toBe(0);
  });
});
