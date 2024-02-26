import { PerformanceType } from '@prisma/client';
import { ManClimbingScale } from './climbing/ManClimbingScale';
import { WomanClimbingScale } from './climbing/WomanClimbingScale';
import { WomanRace80MetersScale } from './race/WomanRace80MetersScale';
import { WomanRace800MetersScale } from './race/WomanRace800MetersScale';
import { ManRace1000MetersScale } from './race/ManRace1000MetersScale';
import { ManRace100MetersScale } from './race/ManRace100MetersScale';

export const performanceScaleMapping = {
  [PerformanceType.ManClimbing]: (performance: string) =>
    new ManClimbingScale(performance),
  [PerformanceType.WomanClimbing]: (performance: string) =>
    new WomanClimbingScale(performance),
  [PerformanceType.WomanRace80Meters]: (performance: string) =>
    new WomanRace80MetersScale(performance),
  [PerformanceType.WomanRace800Meters]: (performance: string) =>
    new WomanRace800MetersScale(performance),
  [PerformanceType.ManRace100Meters]: (performance: string) =>
    new ManRace100MetersScale(performance),
  [PerformanceType.ManRace1000Meters]: (performance: string) =>
    new ManRace1000MetersScale(performance),
};
