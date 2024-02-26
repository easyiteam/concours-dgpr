import { ManClimbingScale } from '../scoring-scales/climbing/ManClimbingScale';

describe('Man climbing algorithm', () => {
  it('should return 20', () => {
    const raceScale = new ManClimbingScale('5');
    console.log(raceScale.score(), raceScale.toString());
    expect(raceScale.score()).toBe(20);
  });

  it('should return 20', () => {
    const raceScale = new ManClimbingScale('7.6');
    console.log(raceScale.score(), raceScale.toString());
    expect(raceScale.score()).toBe(20);
  });

  it('should return 19', () => {
    const raceScale = new ManClimbingScale('8.8');
    console.log(raceScale.score(), raceScale.toString());
    expect(raceScale.score()).toBe(19);
  });

  it('should return 18', () => {
    const raceScale = new ManClimbingScale('9.4');
    console.log(raceScale.score(), raceScale.toString());
    expect(raceScale.score()).toBe(18);
  });

  it('should return 17', () => {
    const raceScale = new ManClimbingScale('11.2');
    console.log(raceScale.score(), raceScale.toString());
    expect(raceScale.score()).toBe(17);
  });

  it('should return 16', () => {
    const raceScale = new ManClimbingScale('12.4');
    console.log(raceScale.score(), raceScale.toString());
    expect(raceScale.score()).toBe(16);
  });

  it('should return 15', () => {
    const raceScale = new ManClimbingScale('13.2');
    console.log(raceScale.score(), raceScale.toString());
    expect(raceScale.score()).toBe(15);
  });

  it('should return 15', () => {
    const raceScale = new ManClimbingScale('13.20');
    console.log(raceScale.score(), raceScale.toString());
    expect(raceScale.score()).toBe(15);
  });

  it('should return 14', () => {
    const raceScale = new ManClimbingScale('13.5 ');
    console.log(raceScale.score(), raceScale.toString());
    expect(raceScale.score()).toBe(14);
  });

  it('should return 13', () => {
    const raceScale = new ManClimbingScale('15.4');
    console.log(raceScale.score(), raceScale.toString());
    expect(raceScale.score()).toBe(13);
  });

  it('should return 12', () => {
    const raceScale = new ManClimbingScale('16');
    console.log(raceScale.score(), raceScale.toString());
    expect(raceScale.score()).toBe(12);
  });

  it('should return 11', () => {
    const raceScale = new ManClimbingScale('17');
    console.log(raceScale.score(), raceScale.toString());
    expect(raceScale.score()).toBe(11);
  });

  it('should return 10', () => {
    const raceScale = new ManClimbingScale('18.5');
    console.log(raceScale.score(), raceScale.toString());
    expect(raceScale.score()).toBe(10);
  });

  it('should return 9', () => {
    const raceScale = new ManClimbingScale('19.5');
    console.log(raceScale.score(), raceScale.toString());
    expect(raceScale.score()).toBe(9);
  });

  it('should return 8', () => {
    const raceScale = new ManClimbingScale('21');
    console.log(raceScale.score(), raceScale.toString());
    expect(raceScale.score()).toBe(8);
  });

  it('should return 7', () => {
    const raceScale = new ManClimbingScale('23');
    console.log(raceScale.score(), raceScale.toString());
    expect(raceScale.score()).toBe(7);
  });

  it('should return 6', () => {
    const raceScale = new ManClimbingScale('24');
    console.log(raceScale.score(), raceScale.toString());
    expect(raceScale.score()).toBe(6);
  });

  it('should return 5', () => {
    const raceScale = new ManClimbingScale('27.2');
    console.log(raceScale.score(), raceScale.toString());
    expect(raceScale.score()).toBe(5);
  });

  it('should return 4', () => {
    const raceScale = new ManClimbingScale('29');
    console.log(raceScale.score(), raceScale.toString());
    expect(raceScale.score()).toBe(4);
  });

  it('should return 3', () => {
    const raceScale = new ManClimbingScale('9.50m');
    console.log(raceScale.score(), raceScale.toString());
    expect(raceScale.score()).toBe(3);
  });

  it('should return 2', () => {
    const raceScale = new ManClimbingScale('9m');
    console.log(raceScale.score(), raceScale.toString());
    expect(raceScale.score()).toBe(2);
  });

  it('should return 1', () => {
    const raceScale = new ManClimbingScale('6m');
    console.log(raceScale.score(), raceScale.toString());
    expect(raceScale.score()).toBe(1);
  });

  it('should return 0', () => {
    const raceScale = new ManClimbingScale('0m');
    console.log(raceScale.score(), raceScale.toString());
    expect(raceScale.score()).toBe(0);
  });

  it('should return 0', () => {
    const raceScale = new ManClimbingScale('40');
    console.log(raceScale.score(), raceScale.toString());
    expect(raceScale.score()).toBe(0);
  });

  it('should return 0', () => {
    const raceScale = new ManClimbingScale('50');
    console.log(raceScale.score(), raceScale.toString());
    expect(raceScale.score()).toBe(0);
  });
});
