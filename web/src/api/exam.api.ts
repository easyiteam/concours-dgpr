import { api } from '.';
import { ProfileItem } from '../components/Section';

export async function getExams() {
  const result = await api.get('exams/all');
  return result.data.values;
}

export async function getExam(id?: string) {
  const result = await api.get(`exams/${id}`);
  return result.data;
}

export type Exam = {
  id: string;
  createdAt: string;
  updatedAt: string;
  enabled: string;

  label: string;
  shortName: string;
  isClosed: boolean;
  participantProfileDefinition: Array<{ label: string; value: ProfileItem[] }>;
};
