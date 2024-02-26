import { Exam } from '../api/exam.api';

export function getFormValue(exam: Exam) {
  const formValue: Record<string, string | number> = {};

  for (const section of exam.participantProfileDefinition) {
    for (const item of section.value) {
      formValue[item.key] = '';
    }
  }
  return formValue;
}
