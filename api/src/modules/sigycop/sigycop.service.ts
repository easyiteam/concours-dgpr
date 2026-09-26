import { PrismaService } from '@app/prisma';
import { PrismaGenericRepository } from '@asaje/prisma-generic-repository';
import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';
import {
  Candidature,
  CandidatureStatus,
  ParticipantProfile,
  Prisma,
  SigycopProfile,
  StepStatus,
} from '@prisma/client';
import { CandidatureDownloadPagination } from '../candidature/candidature.dto';
import { Pagination } from '@app/shared/types/pagination';
import { RegisterSigycopProfile, SigycopThresholds } from './sigycop.dto';
import { computeSigycopAptitude, SIGYCOP_AXES, SigycopScores } from './aptitude';

// La phase SIGYCOP n'existe pas comme un type d'étape fixe (contrairement à
// ExamStep chez dgefc-recrutement) — Step est un modèle générique à label
// libre. On l'identifie par convention sur son label, comme le fait déjà
// SportService.getCenter() pour retrouver un centre par nom de ville.
const SIGYCOP_STEP_LABEL = 'SIGYCOP';

@Injectable()
export class SigycopService extends PrismaGenericRepository<
  Prisma.SigycopProfileDelegate<any>,
  SigycopProfile,
  Prisma.SigycopProfileUncheckedCreateInput,
  Prisma.SigycopProfileUncheckedUpdateInput,
  Prisma.SigycopProfileWhereInput,
  Prisma.SigycopProfileSelect
> {
  constructor(private readonly prisma: PrismaService) {
    super();
    this.model = this.prisma.sigycopProfile;
  }

  private async getSigycopStep(examId: string) {
    return await this.prisma.step.findFirst({
      where: { examId, label: SIGYCOP_STEP_LABEL },
    });
  }

  private async ensureSigycopInProgress(examId: string) {
    const step = await this.getSigycopStep(examId);
    if (!step || step.status !== StepStatus.IN_PROGRESS) {
      throw new ForbiddenException(
        "La phase de visite médicale (SIGYCOP) n'est pas encore ouverte pour ce concours.",
      );
    }
    return step;
  }

  private async ensureWritingAccepted(candidatureId: string) {
    const writingProfile = await this.prisma.writingProfile.findFirst({
      where: { candidatureId },
    });
    if (!writingProfile || writingProfile.status !== CandidatureStatus.ACCEPTED) {
      throw new ForbiddenException(
        "Ce candidat n'est pas éligible à la visite médicale : il doit être accepté à la phase écrite.",
      );
    }
  }

  async registerProfile(data: RegisterSigycopProfile) {
    const candidature = await this.prisma.candidature.findFirst({
      where: { reference: data.reference },
    });
    if (!candidature) {
      throw new BadRequestException('Candidat introuvable pour cette référence.');
    }

    await this.ensureSigycopInProgress(candidature.examId);
    await this.ensureWritingAccepted(candidature.id);

    const step = await this.getSigycopStep(candidature.examId);
    const thresholds = step.evaluationConfig as unknown as SigycopScores | null;
    if (!thresholds) {
      throw new BadRequestException(
        'Les seuils SIGYCOP ne sont pas encore configurés pour ce concours.',
      );
    }

    const scores: SigycopScores = SIGYCOP_AXES.reduce((acc, axis) => {
      acc[axis] = data[axis];
      return acc;
    }, {} as SigycopScores);

    const { apte, failedAxes } = computeSigycopAptitude(scores, thresholds);
    const status = apte ? CandidatureStatus.ACCEPTED : CandidatureStatus.REJECTED;

    const existing = await this.get({ candidatureId: candidature.id });
    if (existing) {
      return await this.update(existing.id, {
        centerId: data.centerId,
        ...scores,
        apte,
        failedAxes,
        status,
      });
    }

    return await this.create({
      candidatureId: candidature.id,
      centerId: data.centerId,
      ...scores,
      apte,
      failedAxes,
      status,
    });
  }

  async setThresholds(stepId: string, data: SigycopThresholds) {
    return await this.prisma.step.update({
      where: { id: stepId },
      data: { evaluationConfig: data as unknown as Prisma.JsonObject },
    });
  }

  async findOneByReference(reference: string) {
    const candidature = await this.prisma.candidature.findFirst({
      where: { reference },
      include: { profiles: true },
    });
    if (!candidature) {
      return null;
    }
    const activeProfile = candidature.profiles.find((p) => p.active);
    const profile = await this.get({ candidatureId: candidature.id });
    return { ...candidature, activeProfile, profile: profile ?? null };
  }

  async findAllByExam(id: string, args: Pagination) {
    const profiles = await this.findAndCount({
      paginationArgs: args,
      paginationOptions: {
        search: ['candidature.reference'],
        includes: ['candidature.profiles', 'center'],
      },
      query: { candidature: { examId: id } },
    });
    return {
      ...profiles,
      values: profiles.values.map(
        (
          profile: SigycopProfile & {
            candidature: Candidature & { profiles?: ParticipantProfile[] };
          },
        ) => {
          const activeProfile = profile.candidature.profiles.find((p) => p.active);
          return { ...profile, candidature: { ...profile.candidature, activeProfile } };
        },
      ),
    };
  }

  async prepareSigycopDownload(id: string, args: CandidatureDownloadPagination) {
    const profiles = await this.findAndCount({
      paginationArgs: args,
      paginationOptions: {
        search: ['candidature.reference'],
        includes: ['candidature.profiles', 'center'],
      },
      query: { candidature: { examId: id } },
    });

    const rows = profiles.values.map(
      (
        profile: SigycopProfile & {
          candidature: Candidature & { profiles?: ParticipantProfile[] };
          center: { label: string };
        },
      ) => {
        const activeProfile: any = profile.candidature.profiles.find((p) => p.active)?.value;
        return {
          "Numéro d'inscription": profile.candidature.reference,
          Nom: activeProfile?.lastname ?? '',
          Prénom: activeProfile?.firstname ?? '',
          Genre: activeProfile?.gender ?? '',
          Centre: profile.center?.label ?? '',
          S: profile.s,
          I: profile.i,
          G: profile.g,
          Y: profile.y,
          C: profile.c,
          O: profile.o,
          P: profile.p,
          Résultat: profile.apte ? 'Apte' : `Inapte (${profile.failedAxes.join(', ')})`,
        };
      },
    );

    if (args.center) {
      return rows.filter((row) => row.Centre === args.center);
    }

    return rows;
  }
}
