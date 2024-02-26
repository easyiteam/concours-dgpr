export class RaceScale {
  protected tierce = 0;
  protected seconds = 0;
  protected minutes = 0;

  parse(_performance: string) {
    let performance = _performance;
    if (!_performance.includes('.')) performance = [performance, '0'].join('.');

    const [_t, _sec, _min] = performance.split('.').reverse();

    const __t = _t.startsWith('0') ? +_t / 10 : +_t;

    this.tierce = __t >= 10 ? Math.round(__t / 10) : __t;
    this.seconds = +_sec;
    this.minutes = isNaN(+_min) ? 0 : +_min;
  }

  toString() {
    return `${this.minutes}.${this.seconds}.${this.tierce}`;
  }
}
