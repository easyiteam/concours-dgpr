import { api } from '.';
import { CountedList } from '../helpers/typings';
import { Center, Pagination, WritingProfile } from './typings';

export class WritingApi {
  private basePath: string = 'writings';

  private route(path: string) {
    return `${this.basePath}/${path}`;
  }

  async findAllByExam(id: string, args: Pagination) {
    try {
      const response = await api.get(this.route(`exam/${id}`), {
        params: args,
      });
      return response.data as CountedList<WritingProfile>;
    } catch (error) {
      return { count: 0, values: [] };
    }
  }

  async findAllResultByExam(id: string, args: Pagination) {
    try {
      const response = await api.get(this.route(`exam/${id}/result`), {
        params: args,
      });
      return response.data as CountedList<WritingProfile>;
    } catch (error) {
      return { count: 0, values: [] };
    }
  }

  async getCenters() {
    try {
      const response = await api.get(this.route('centers'));
      return response.data as Center[];
    } catch (error) {
      return [];
    }
  }

  async getCenter(id?: string) {
    try {
      const response = await api.get(this.route(`centers/${id}`));
      return response.data as Center;
    } catch (error) {
      return undefined;
    }
  }

  async getRepartition(examId?: string, centerId?: string) {
    try {
      const response = await api.get(
        this.route(`by-center-by-room/${examId}/${centerId}`),
      );
      return response.data as WritingProfile[][];
    } catch (error) {
      return [];
    }
  }

  async makeRepartition(data: { examId: string; centerId: string; n: number }) {
    try {
      await api.post(this.route('repartition'), data);
    } catch (error) {
      console.log(error);
    }
  }

  async generateCodes(examId: string, fieldId: string) {
    try {
      await api.post(this.route(`generate-codes`), { examId, fieldId });
    } catch (error) {
      console.log(error);
    }
  }

  async downloadRoomList(examId: string, centerId: string, room: number) {
    try {
      const response = await api.get(
        `${this.basePath}/download-by-center-by-room/${examId}/${centerId}/${room}`,
        { responseType: 'blob' },
      );
      const uri = URL.createObjectURL(response.data);
      const a = document.createElement('a');
      a.href = uri;
      a.click();
    } catch (error) {
      console.log(error);
    }
  }

  async downloadAnonymousList(
    examId: string,
    centerId: string,
    fieldId: string,
    room: number,
  ) {
    try {
      const response = await api.get(
        `${this.basePath}/download-anonymous-list/${examId}/${centerId}/${fieldId}/${room}`,
        { responseType: 'blob' },
      );
      const uri = URL.createObjectURL(response.data);
      const a = document.createElement('a');
      a.href = uri;
      a.click();
    } catch (error) {
      console.log(error);
    }
  }

  async downloadQrcodes(
    examId: string,
    centerId: string,
    fieldId: string,
    room: number,
  ) {
    try {
      const response = await api.get(
        `${this.basePath}/download-qrcodes/${examId}/${centerId}/${fieldId}/${room}`,
        { responseType: 'blob' },
      );
      const uri = URL.createObjectURL(response.data);
      window.open(uri, '_blank');
    } catch (error) {
      console.log(error);
    }
  }

  async insertScore(code: string, value: number) {
    try {
      await api.post(this.route(`insert-score`), { code, value });
    } catch (error) {
      console.log(error);
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

  async downloadRank(id: string) {
    try {
      const response = await api.get(
        `${this.basePath}/exam/${id}/result/download`,
        {
          responseType: 'blob',
        },
      );
      const uri = URL.createObjectURL(response.data);
      const a = document.createElement('a');
      a.href = uri;
      a.target = '_blank';
      a.click();
    } catch (error) {
      console.log(error);
    }
  }

  async downloadRankFinal(id: string) {
    try {
      const response = await api.get(
        `${this.basePath}/exam/${id}/result-final/download`,
        {
          responseType: 'blob',
        },
      );
      const uri = URL.createObjectURL(response.data);
      const a = document.createElement('a');
      a.href = uri;
      a.target = '_blank';
      a.click();
    } catch (error) {
      console.log(error);
    }
  }
}

export const writingApi = new WritingApi();
