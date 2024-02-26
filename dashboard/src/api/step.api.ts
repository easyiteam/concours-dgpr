import { api } from '.';
import { PaginationArgs } from '../components/table/TableControls';
import { CountedList } from '../helpers/typings';
import { BaseApi } from './base.api';
import { CreateStep, Step } from './typings';

export class StepApi extends BaseApi<Step, CreateStep> {
  constructor() {
    super('steps');
  }

  async findAllByExam(id: string, args: PaginationArgs) {
    try {
      const response = await api.get(`${this.basePath}/exam/${id}`, {
        params: args,
      });
      return response.data as CountedList<Step>;
    } catch (error) {
      return { count: 0, values: [] };
    }
  }

  async activateStep(id: string) {
    return await api.patch(`${this.basePath}/${id}/activate`);
  }
}

export const stepApi = new StepApi();
