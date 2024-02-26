import { CandidatureStatus, Role } from './enums';

export interface Pagination {
  page?: number;
  limit?: number;
  search?: string;
  from?: string;
  to?: string;
  take?: number;
  skip?: number;
}

export interface BaseEntity {
  id: string;
  createdAt: string;
  updatedAt: string;
  enabled: string;
}

//===================== Auth
export interface AuthId {
  email?: string;
  username?: string;
  fullname?: string;
}

export interface AuthRegister extends AuthId {
  role?: Role;
}

export interface AuthLogin extends AuthId {
  password: string;
}

export interface AuthSetPassword {
  id: string;
  password: string;
}

export interface Auth extends BaseEntity {
  email: string;
  username?: string;
  fullname?: string;
  role: Role;
  isVerified?: boolean;
}

export interface AuthLoginResponse {
  token: string;
  credentials: {
    email: string;
    username?: string;
    id: string;
    role: Role;
  };
}
//===================== End Auth

export type WithBase<T> = BaseEntity & T;

export interface CreateExam {
  label: string;
  shortName: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  participantProfileDefinition: Record<string, any>;
}
export type Exam = WithBase<CreateExam> & {
  isClosed: boolean;
};

export interface CreateStep {
  label: string;
  order: number;
  examId: string;
}
export type Step = WithBase<CreateStep> & { active: boolean };

export interface CreateDocument {
  title: string;
  description: string;
  url: string;
  size: number;
  at?: string;
}
export type Document = WithBase<
  CreateDocument & { views: number; downloads: number }
>;

export interface CreateCandidature {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  activeProfile: any;
  reference: string;
  status: CandidatureStatus;
}
export type Candidature = WithBase<CreateCandidature> & {
  examId: string;
  exam: Exam;
  reasons?: string[];
};

export const ROLES = [
  { id: Role.ADMIN, label: 'ADMIN' },
  { id: Role.USER, label: 'UTILISATEUR' },
  { id: Role.EXAM_MANAGER, label: 'GESTIONNAIRE DE CONCOURS' },
];

export enum PerformanceType {
  WomanRace80Meters = 'WomanRace80Meters',
  WomanRace800Meters = 'WomanRace800Meters',
  ManRace100Meters = 'ManRace100Meters',
  ManRace1000Meters = 'ManRace1000Meters',
  WomanClimbing = 'WomanClimbing',
  ManClimbing = 'ManClimbing',
}

export const perfomanceMapping = {
  [PerformanceType.WomanRace80Meters]: 'Course',
  [PerformanceType.WomanRace800Meters]: 'Endurance',
  [PerformanceType.ManRace100Meters]: 'Course',
  [PerformanceType.ManRace1000Meters]: 'Endurance',
  [PerformanceType.WomanClimbing]: 'Grimpé',
  [PerformanceType.ManClimbing]: 'Grimpé',
};

export type Profile = {
  total: number;
  mean: number;
  rank?: number;
  performances: Performance[];
  candidature: Candidature;
  createdAt: string;
  id: string;
  status: CandidatureStatus;
};

export type Performance = {
  id: string;
  type: PerformanceType;
  value: string;
  score: number;
};

export enum ValidatorStatus {
  ACTIVATING = 'ACTIVATING',
  ACTIVE = 'ACTIVE',
  REVOCATING = 'REVOCATING',
  REVOCATED = 'REVOCATED',
}

export enum ValidationStatus {
  PENDING = 'PENDING',
  SUCCESS = 'SUCCESS',
}

export type Validator = CreateValidator & {
  status: ValidatorStatus;
  id: string;
};

export type Validation = {
  id: string;
  status: ValidationStatus;
};

export type ValidatorValidation = {
  validator: Validator;
  validatorId: string;

  validation: Validation;
  validationId: string;

  status: ValidationStatus;
};

export type CreateValidator = {
  fullname: string;
  email: string;
  fonction: string;
};

export type Field = {
  id: string;
  code: string;
  label: string;
  coefficient: number;

  exam: Exam;
  examId: string;
};

export type Score = {
  id: string;
  value: number;
  qrcode: string;
  code: string;

  field: Field;
  fieldId: string;

  profile: WritingProfile;
  writingProfileId: string;
};

export type Center = {
  id: string;
  label: string;
};

export type WritingProfile = {
  id: string;
  candidatureId: string;
  candidature: Candidature;

  center: Center;
  centerId: string;

  status: CandidatureStatus;
  room?: number;
  total?: number;
  mean?: number;
  rank?: number;
  scores?: Score[];
};
