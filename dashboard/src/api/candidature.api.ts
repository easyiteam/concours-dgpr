import { api } from '.';
import { CountedList } from '../helpers/typings';
import { BaseApi } from './base.api';
import { CandidatureStatus } from './enums';
import { Candidature, CreateCandidature, Pagination } from './typings';

export type Tboard = {
  candidatures: Candidature[];
  allCount: number;
  newCount: number;
  acceptedCount: number;
  rejectedCount: number;
};

export class CandidatureApi extends BaseApi<Candidature, CreateCandidature> {
  constructor() {
    super('candidatures');
  }

  async findAllByExam(
    id: string,
    args: Pagination & { status?: CandidatureStatus },
  ) {
    try {
      const response = await api.get(`${this.basePath}/exam/${id}`, {
        params: args,
      });
      return response.data as CountedList<Candidature>;
    } catch (error) {
      return { count: 0, values: [] };
    }
  }

  async findAllReclamationsByExam(
    id: string,
    args: Pagination & { status?: CandidatureStatus },
  ) {
    try {
      const response = await api.get(
        `${this.basePath}/exam/${id}/reclamations`,
        {
          params: args,
        },
      );
      return response.data as CountedList<Candidature>;
    } catch (error) {
      return { count: 0, values: [] };
    }
  }

  async gotoWritingStep(id: string) {
    try {
      await api.get(`${this.basePath}/goto-writing-step/${id}`);
      return true;
    } catch (error) {
      return false;
    }
  }

  async tboadByExam(id: string) {
    try {
      const response = await api.get(`${this.basePath}/exam/${id}/tboard`);
      return response.data as Tboard;
    } catch (error) {
      return {
        candidatures: [],
        allCount: 0,
        newCount: 0,
        acceptedCount: 0,
        rejectedCount: 0,
      };
    }
  }

  async acceptCandidature(id: string) {
    await api.patch(`${this.basePath}/${id}/accept`);
  }

  async rejectCandidature(id: string, reason: string) {
    await api.patch(`${this.basePath}/${id}/reject`, { reason });
  }

  async download(
    id: string,
    args: Pagination & { status?: CandidatureStatus; center?: string },
  ) {
    try {
      const response = await api.get(`${this.basePath}/download/${id}`, {
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
}

export const candidatureApi = new CandidatureApi();
