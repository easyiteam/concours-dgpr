import { api } from '.';
import { BaseApi } from './base.api';
import { CreateExam, Exam } from './typings';

export class ExamApi extends BaseApi<Exam, CreateExam> {
  constructor() {
    super('exams');
  }

  async close(id: string) {
    try {
      const response = await api.patch(`${this.basePath}/exam/${id}/close`);
      return response.data;
    } catch (error) {
      console.log(error);
    }
  }

  async createCenter(data: { label: string; examId: string }) {
    try {
      const response = await api.post(`${this.basePath}/centers`, data);
      return response.data;
    } catch (error) {
      console.log(error);
    }
  }

  async updateCenter(id: string, data: { label: string; examId: string }) {
    try {
      const response = await api.patch(`${this.basePath}/centers/${id}`, data);
      return response.data;
    } catch (error) {
      console.log(error);
    }
  }

  async deleteCenter(id: string) {
    try {
      const response = await api.delete(`${this.basePath}/centers/${id}`);
      return response.data;
    } catch (error) {
      console.log(error);
    }
  }

  async getCenters(id: string) {
    try {
      const response = await api.get(`${this.basePath}/centers/${id}`);
      return response.data;
    } catch (error) {
      console.log(error);
    }
  }
}

export const examApi = new ExamApi();
