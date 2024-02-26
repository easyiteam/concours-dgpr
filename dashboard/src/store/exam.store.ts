import { Exam } from '../api/typings';
import { WithId } from '../helpers/typings';

export class ExamStore {
  static current: WithId<Exam> | null = null;

  static set(exam: Exam) {
    ExamStore.current = exam;
  }

  static get() {
    return ExamStore.current;
  }
}
