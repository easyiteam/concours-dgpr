import { api } from '.';

export enum CandidatureStatus {
  INDETERMINATE = 'INDETERMINATE',
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED',
}

export interface CreateExam {
  label: string;
  shortName: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  participantProfileDefinition: Record<string, any>;
}
export type Exam = WithBase<CreateExam>;

export interface BaseEntity {
  id: string;
  createdAt: string;
  updatedAt: string;
  enabled: string;
}
export type WithBase<T> = BaseEntity & T;
export interface CreateCandidature {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  activeProfile: any;
  reference: string;
  status: CandidatureStatus;
}

export type Candidature = WithBase<CreateCandidature> & {
  examId: string;
  exam: Exam;
};

export async function registerCandidature(
  data: Record<string, string | number>,
  examId: string,
) {
  try {
    const response = await api.post('candidatures', { data, examId });
    return response.data;
  } catch (error) {
    return null;
  }
}

export async function getCandidature(id?: string) {
  try {
    if (id) {
      const response = await api.get(`candidatures/${id}/info`);
      return response.data;
    }
  } catch (error) {
    return null;
  }
}

export async function getSportProfile(id?: string) {
  try {
    if (id) {
      const response = await api.get(`writings/${id}/info`);
      return response.data;
    }
  } catch (error) {
    return null;
  }
}

export async function updateCandidature(id: string, data: unknown) {
  try {
    const response = await api.patch(`candidatures/${id}`, data);
    return response.data;
  } catch (error) {
    console.log(error);
  }
}
