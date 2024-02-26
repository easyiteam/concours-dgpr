import { PrismaService } from '@app/prisma';
import { PrismaGenericRepository } from '@asaje/prisma-generic-repository';
import {
  ConflictException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  Candidature,
  CandidatureStatus,
  ParticipantProfile,
  PerformanceType,
  Prisma,
  SportProfile,
  SportProfilePerformance,
} from '@prisma/client';
import {
  GlobalPerformanceType,
  RegisterPerformance,
  UpdatePerformance,
} from './sport.dto';
import { performanceScaleMapping } from 'src/Factories/scoring-scales';
import { CandidatureService } from '../candidature/candidature.service';
import { Pagination } from '@app/shared/types/pagination';
import { CandidatureDownloadPagination } from '../candidature/candidature.dto';

@Injectable()
export class SportService extends PrismaGenericRepository<
  Prisma.SportProfileDelegate<any>,
  SportProfile,
  Prisma.SportProfileUncheckedCreateInput,
  Prisma.SportProfileUncheckedUpdateInput,
  Prisma.SportProfileWhereInput,
  Prisma.SportProfileSelect
> {
  constructor(
    private readonly prisma: PrismaService,
    private readonly candidatureService: CandidatureService,
  ) {
    super();
    this.model = this.prisma.sportProfile;
  }

  async getAbsents(id: string, args: Pagination) {
    const candidatures = await this.candidatureService.findAndCount({
      paginationArgs: args,
      paginationOptions: {
        search: ['reference'],
        includes: ['profiles'],
      },
      query: {
        examId: id,
        sportProfiles: { none: {} },
        status: CandidatureStatus.ACCEPTED,
      },
    });
    return {
      ...candidatures,
      values: candidatures.values.map(
        (c: Candidature & { profiles?: ParticipantProfile[] }) => {
          const activeProfile = c.profiles.find((p) => p.active);
          return { ...c, activeProfile };
        },
      ),
    };
  }

  async getProfile(id: string) {
    const profile = await this.getById(id, {
      include: { candidature: true, performances: true },
    });
    const candidature = await this.candidatureService.getCandidate(
      profile.candidatureId,
    );
    return { ...profile, candidature };
  }

  async registerPresence(id: string) {
    const candidature = await this.prisma.candidature.findFirst({
      where: { reference: id, status: CandidatureStatus.ACCEPTED },
      select: { id: true },
    });
    if (!candidature) throw new NotFoundException();

    const existingRegistration = await this.get({
      candidatureId: candidature.id,
    });

    if (existingRegistration) return existingRegistration;

    return await this.create({ candidatureId: candidature.id });
  }

  private getDataType(type: GlobalPerformanceType, gender: 'HOMME' | 'FEMME') {
    if (type === GlobalPerformanceType.RACE)
      return gender === 'FEMME'
        ? PerformanceType.WomanRace80Meters
        : PerformanceType.ManRace100Meters;

    if (type === GlobalPerformanceType.RACE_1000)
      return gender === 'FEMME'
        ? PerformanceType.WomanRace800Meters
        : PerformanceType.ManRace1000Meters;

    if (type === GlobalPerformanceType.CLIMBING)
      return gender === 'FEMME'
        ? PerformanceType.WomanClimbing
        : PerformanceType.ManClimbing;
  }

  async syncPerformances() {
    const performances = await this.prisma.sportProfilePerformance.findMany();

    for (const perf of performances) {
      const _perf = await this.prisma.sportProfilePerformance.update({
        where: { id: perf.id },
        data: { score: performanceScaleMapping[perf.type](perf.value).score() },
      });
      await this.updateScore(_perf.sportProfileId);
    }
  }

  async prepareSportDownload(id: string, args: CandidatureDownloadPagination) {
    const candidatures = await this.findAndCount({
      paginationArgs: args,
      paginationOptions: {
        search: ['candidature.reference'],
        includes: ['candidature.profiles', 'performances'],
      },
      query: { candidature: { examId: id } },
    });
    const $candidatures = candidatures.values.map(
      (
        c: SportProfile & {
          candidature: Candidature & { profiles?: ParticipantProfile[] };
          performances: SportProfilePerformance[];
        },
      ) => {
        const activeProfile = c.candidature.profiles.find((p) => p.active);
        return { ...c, candidature: { ...c.candidature, activeProfile } };
      },
    );

    const getPerf = (
      values: SportProfilePerformance[],
      type: PerformanceType,
    ) => {
      return values.find((v) => v.type === type);
    };

    const __candidatures = $candidatures.map(
      (
        c: SportProfile & {
          candidature: Candidature & { profiles?: ParticipantProfile[] };
          performances: SportProfilePerformance[];
        },
      ) => {
        const activeProfile: any = c.candidature.profiles.find(
          (p) => p.active,
        ).value;
        const racePerf = getPerf(
          c.performances,
          activeProfile.gender === 'FEMME'
            ? PerformanceType.WomanRace80Meters
            : PerformanceType.ManRace100Meters,
        );
        const longRacePerf = getPerf(
          c.performances,
          activeProfile.gender === 'FEMME'
            ? PerformanceType.WomanRace800Meters
            : PerformanceType.ManRace1000Meters,
        );
        const climbingPerf = getPerf(
          c.performances,
          activeProfile.gender === 'FEMME'
            ? PerformanceType.WomanClimbing
            : PerformanceType.ManClimbing,
        );

        return {
          "Numéro d'inscription": c.candidature.reference,
          Centre: activeProfile.center,
          Nom: activeProfile.lastname,
          Prénom: activeProfile.firstname,
          Genre: activeProfile.gender,
          Téléphone: activeProfile.phone,
          'Vitesse Performance': racePerf?.value ?? '',
          'Vitesse Note': racePerf?.score ?? 0,
          'Endurance Performance': longRacePerf?.value ?? '',
          'Endurance Note': longRacePerf?.score ?? 0,
          'Grimpé Performance': climbingPerf?.value ?? '',
          'Grimpé Note': climbingPerf?.score ?? 0,
          Total: c.total,
          Moyenne: c.mean,
        };
      },
    );

    console.log('ok');

    let _candidatures = __candidatures.sort((a, b) => b.Moyenne - a.Moyenne);

    if (args.center) {
      _candidatures = _candidatures.filter(
        (candidature) => candidature.Centre === args.center,
      );
    }

    return _candidatures;
  }

  async prepareSportDownloadResult(
    id: string,
    args: CandidatureDownloadPagination,
  ) {
    const candidatures = await this.findAndCount({
      paginationArgs: args,
      paginationOptions: {
        search: ['candidature.reference'],
        includes: ['candidature.profiles', 'performances'],
      },
      query: { candidature: { examId: id } },
    });
    const $candidatures = candidatures.values.map(
      (
        c: SportProfile & {
          candidature: Candidature & { profiles?: ParticipantProfile[] };
          performances: SportProfilePerformance[];
        },
      ) => {
        const activeProfile = c.candidature.profiles.find((p) => p.active);
        return { ...c, candidature: { ...c.candidature, activeProfile } };
      },
    );

    const __candidatures = $candidatures.map(
      (
        c: SportProfile & {
          candidature: Candidature & { profiles?: ParticipantProfile[] };
          performances: SportProfilePerformance[];
        },
      ) => {
        const activeProfile: any = c.candidature.profiles.find(
          (p) => p.active,
        ).value;
        return {
          Rang: c.rank,
          "Numéro d'inscription": c.candidature.reference,
          Nom: activeProfile.lastname,
          Prénom: activeProfile.firstname,
          Genre: activeProfile.gender,
          Téléphone: activeProfile.phone,
          Total: c.total,
          Moyenne: c.mean,
          Status:
            c.status === CandidatureStatus.ACCEPTED ? 'Accepté' : 'Rejeté',
          Centre: activeProfile.center,
        };
      },
    );

    console.log('ok');

    let _candidatures = __candidatures.sort((a, b) => b.Moyenne - a.Moyenne);

    if (args.center) {
      _candidatures = _candidatures.filter(
        (candidature) => candidature.Centre === args.center,
      );
    }

    return _candidatures;
  }

  async registerPerformance(data: RegisterPerformance) {
    const sportProfile = await this.get({
      candidature: { reference: data.reference },
    });
    const candidature = await this.candidatureService.getCandidate(
      sportProfile.candidatureId,
    );
    const gender = (
      candidature.activeProfile.value as { gender: 'HOMME' | 'FEMME' }
    ).gender;

    delete data.reference;

    const dataType = this.getDataType(data.type, gender);

    const performance = performanceScaleMapping[dataType](data.value);

    console.log(performance);

    const existingPerformance =
      await this.prisma.sportProfilePerformance.findFirst({
        where: { sportProfileId: sportProfile.id, type: dataType },
      });
    console.log(existingPerformance);
    if (existingPerformance) {
      throw new ConflictException({
        id: existingPerformance.id,
        statusCode: HttpStatus.CONFLICT,
      });
    }

    delete data.type;

    await this.prisma.sportProfilePerformance.create({
      data: {
        ...data,
        type: dataType,
        sportProfileId: sportProfile.id,
        score: performance.score(),
      },
    });
    return await this.updateScore(sportProfile.id);
  }

  private async updateScore(id: string) {
    const profile: SportProfile & { performances?: SportProfilePerformance[] } =
      await this.getById(id, {
        include: { performances: true },
      });
    const total = profile.performances?.reduce(
      (acc, cur) => acc + cur.score,
      0,
    );

    return await this.update(id, {
      total,
      mean: +(total / 3).toFixed(2),
    });
  }

  async deletePerformance(id: string) {
    const perf = await this.prisma.sportProfilePerformance.findUnique({
      where: { id },
    });
    await this.prisma.sportProfilePerformance.delete({ where: { id } });
    await this.updateScore(perf.sportProfileId);
  }

  async updatePerformance(id: string, data: UpdatePerformance) {
    const sportProfile = await this.get({
      candidature: { reference: data.reference },
    });
    const candidature = await this.candidatureService.getCandidate(
      sportProfile.candidatureId,
    );
    const gender = (
      candidature.activeProfile.value as { gender: 'HOMME' | 'FEMME' }
    ).gender;

    delete data.reference;

    const dataType = this.getDataType(data.type, gender);
    console.log(dataType, 'data-type');
    const score = performanceScaleMapping[dataType](data.value).score();
    const performance = await this.prisma.sportProfilePerformance.update({
      where: { id },
      data: {
        type: dataType,
        score,
        value: data.value,
      },
    });

    await this.updateScore(performance.sportProfileId);

    return performance;
  }

  async presenceStats(id: string) {
    const presents = await this.isPresentsStats(id);
    const absents = await this.isAbsentStats(id);
    return { presents, absents };
  }

  private async isAbsentStats(id: string) {
    const absents = await this.prisma.candidature.findMany({
      where: {
        sportProfiles: { none: {} },
        examId: id,
        status: CandidatureStatus.ACCEPTED,
      },
    });

    const centers: Record<
      string,
      { all: number; mens: number; womens: number }
    > = {};

    let mens = 0;
    let womens = 0;
    for (const r of absents) {
      const c: any = await this.candidatureService.getCandidate(r.id);
      const center = c.activeProfile.value.center;
      if (c.activeProfile.value.gender === 'HOMME') {
        mens++;

        if (!(center in centers)) {
          centers[center] = { all: 1, mens: 1, womens: 0 };
          continue;
        }

        centers[center].all++;
        centers[center].mens++;

        continue;
      }
      womens++;

      if (!(center in centers)) {
        centers[center] = { all: 1, mens: 0, womens: 1 };
        continue;
      }

      centers[center].all++;
      centers[center].womens++;
    }

    return { all: absents.length, mens, womens, centers };
  }

  private async isPresentsStats(id: string) {
    const presents = await this.findAndCount({
      query: { candidature: { examId: id } },
    });

    const centers: Record<
      string,
      { all: number; mens: number; womens: number }
    > = {};

    let mens = 0;
    let womens = 0;
    for (const r of presents.values) {
      const c: any = await this.candidatureService.getCandidate(
        r.candidatureId,
      );
      const center = c.activeProfile.value.center;
      if (c.activeProfile.value.gender === 'HOMME') {
        mens++;

        if (!(center in centers)) {
          centers[center] = { all: 1, mens: 1, womens: 0 };
          continue;
        }

        centers[center].all++;
        centers[center].mens++;

        continue;
      }
      womens++;

      if (!(center in centers)) {
        centers[center] = { all: 1, mens: 0, womens: 1 };
        continue;
      }

      centers[center].all++;
      centers[center].womens++;
    }

    return { all: presents.count, mens, womens, centers };
  }

  async selectNCandidates(id: string, n: number) {
    const profiles = await this.prisma.sportProfile.findMany({
      where: { candidature: { examId: id } },
      orderBy: { mean: 'desc' },
    });

    let i = 0;
    for (const profile of profiles) {
      await this.update(profile.id, {
        rank: i + 1,
        status: i < n ? CandidatureStatus.ACCEPTED : CandidatureStatus.REJECTED,
      });
      i++;
    }
  }

  async selectMeanUnderN(id: string, n: number) {
    const profiles = await this.prisma.sportProfile.findMany({
      where: { candidature: { examId: id } },
      orderBy: { mean: 'desc' },
    });

    let i = 0;
    for (const profile of profiles) {
      console.log(profile.mean);
      await this.update(profile.id, {
        rank: i + 1,
        status:
          profile.mean >= n
            ? CandidatureStatus.ACCEPTED
            : CandidatureStatus.REJECTED,
      });
      i++;
    }
  }

  async reset() {
    await this.prisma.sportProfilePerformance.deleteMany();
    await this.prisma.sportProfile.deleteMany();
  }

  async closeStep(id: string) {
    await this.prisma.score.deleteMany({
      where: { profile: { candidature: { examId: id } } },
    });
    await this.prisma.writingProfile.deleteMany({
      where: { candidature: { examId: id } },
    });
    const candidates: (SportProfile & {
      candidature?: Candidature & { profiles?: ParticipantProfile[] };
    })[] = await this.find({
      paginationArgs: { limit: -1 },
      query: {
        status: CandidatureStatus.ACCEPTED,
        candidature: { examId: id },
      },
      paginationOptions: { includes: ['candidature.profiles'] },
    });

    const $candidates = candidates.map((c) => {
      const activeProfile = c.candidature.profiles.find((p) => p.active);
      return { ...c, activeProfile };
    });

    for (const candidate of $candidates) {
      const center = await this.getCenter(
        (candidate.activeProfile.value as { center: string }).center,
      );
      console.log('center: ', center);

      await this.prisma.writingProfile.create({
        data: { candidatureId: candidate.candidatureId, centerId: center.id },
      });
    }

    return;
  }

  async getCenter(center: string) {
    let label = '';

    if (['Parakou', 'Natitingou'].includes(center)) {
      label = 'Lycée Mathieu BOUKE';
    }

    // if (['Abomey-Calavi', 'Lokossa', 'Porto-Novo'].includes(center)) {
    //   label = 'Lycée Technique Coulibaly';
    // }

    if (['Abomey-Calavi', 'Lokossa', 'Porto-Novo'].includes(center)) {
      label = "Lycée Technique d'Amitié Sino Béninoise d'Akassato";
    }

    if (['Abomey'].includes(center)) {
      label = 'CEG 1 DASSA-ZOUME';
    }

    if (!center) {
      label = "Lycée Technique d'Amitié Sino Béninoise d'Akassato";
    }

    // if (!center) {
    //   label = 'Lycée Technique Coulibaly';
    // }

    const _center = await this.prisma.center.findFirst({ where: { label } });
    return _center;
  }
}
