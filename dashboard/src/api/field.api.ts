import { api } from '.';
import { CountedList } from '../helpers/typings';
import { BaseApi } from './base.api';
import { Field } from './typings';

export class FieldApi extends BaseApi<Field, Omit<Field, 'id' | 'exam'>> {
  constructor() {
    super('fields');
  }

  async findAllByExam(id?: string) {
    try {
      const response = await api.get(`${this.basePath}/exam/${id}`);
      return response.data as CountedList<Field>;
    } catch (error) {
      return { count: 0, values: [] };
    }
  }
}

export const fieldApi = new FieldApi();
