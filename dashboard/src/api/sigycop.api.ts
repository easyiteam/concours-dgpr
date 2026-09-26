import { api } from '.';
import { CountedList } from '../helpers/typings';
import { Pagination, SigycopProfile } from './typings';

export class SigycopApi {
  private basePath: string = 'sigycop';

  private route(path: string) {
    return `${this.basePath}/${path}`;
  }

  async findAllByExam(id: string, args: Pagination) {
    try {
      const response = await api.get(this.route(`exam/${id}`), {
        params: args,
      });
      return response.data as CountedList<SigycopProfile>;
    } catch (error) {
      return { count: 0, values: [] };
    }
  }

  async setThresholds(
    stepId: string,
    data: { s: number; i: number; g: number; y: number; c: number; o: number; p: number },
  ) {
    try {
      await api.patch(this.route(`thresholds/${stepId}`), data);
    } catch (error) {
      console.log(error);
    }
  }

  async downloadAllByExam(examId: string, center?: string) {
    try {
      const response = await api.get(this.route(`exam/${examId}/download`), {
        params: { center },
        responseType: 'blob',
      });
      const uri = URL.createObjectURL(response.data);
      const a = document.createElement('a');
      a.href = uri;
      a.click();
    } catch (error) {
      console.log(error);
    }
  }
}

export const sigycopApi = new SigycopApi();
