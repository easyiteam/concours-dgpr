import { api } from '.';
import { CountedList } from '../helpers/typings';
import { Candidature, Pagination } from './typings';

export class SportApi {
  private basePath: string = 'sports';

  private route(path: string) {
    return `${this.basePath}/${path}`;
  }

  async examStats(id: string) {
    const response = await api.get(this.route(`exam/${id}/stats`));
    return response.data;
  }

  async findAllByExam(id: string, args: Pagination) {
    try {
      const response = await api.get(this.route(`exam/${id}`), {
        params: args,
      });
      return response.data as CountedList<{
        candidature: Candidature;
        createdAt: string;
      }>;
    } catch (error) {
      return { count: 0, values: [] };
    }
  }

  async findAllAbsentsByExam(id: string, args: Pagination) {
    try {
      const response = await api.get(this.route(`exam/${id}/absents`), {
        params: args,
      });
      return response.data as CountedList<Candidature>;
    } catch (error) {
      return { count: 0, values: [] };
    }
  }

  async download(id: string, args: Pagination & { center?: string }) {
    try {
      const response = await api.get(`${this.basePath}/exam/${id}/download`, {
        params: { ...args, limit: -1 },
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

  async downloadRank(id: string, args: Pagination & { center?: string }) {
    try {
      const response = await api.get(
        `${this.basePath}/exam-by-rank/${id}/download`,
        {
          params: { ...args, limit: -1 },
          responseType: 'blob',
        },
      );
      const uri = URL.createObjectURL(response.data);
      const a = document.createElement('a');
      a.href = uri;
      a.click();
    } catch (error) {
      console.log(error);
    }
  }

  async getByRank(id: string, args: Pagination) {
    try {
      const response = await api.get(this.route(`exam-by-rank/${id}`), {
        params: args,
      });
      return response.data as CountedList<Candidature>;
    } catch (error) {
      return { count: 0, values: [] };
    }
  }

  async selectCandidates(
    id: string,
    n: number,
    type: 'mean-under-n' | 'under-n',
  ) {
    try {
      const response = await api.get(this.route(`select/${id}/${n}/${type}`));
      console.log(response.data);
    } catch (error) {
      console.log(error);
    }
  }

  async closeStep(id: string) {
    try {
      const response = await api.get(this.route(`close-step/${id}`));
      console.log(response.data);
    } catch (error) {
      console.log(error);
    }
  }
}

export const sportApi = new SportApi();
