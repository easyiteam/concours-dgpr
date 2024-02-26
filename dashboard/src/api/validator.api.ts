import { api } from '.';
import {
  CreateValidator,
  Validation,
  Validator,
  ValidatorValidation,
} from './typings';

export class ValidatorApi {
  private basePath: string = 'validators';

  private route(path: string) {
    return `${this.basePath}/${path}`;
  }

  async findAll() {
    try {
      const response = await api.get(this.route(''));
      return response.data as Validator[];
    } catch (error) {
      return [];
    }
  }

  async addValidator(data: CreateValidator) {
    try {
      const response = await api.post(this.route(''), data);
      return response.data as Validator;
    } catch (error) {
      console.log(error);
    }
  }

  async initValidation() {
    try {
      const response = await api.post(this.route('init-process'), {});
      return response.data as Validation;
    } catch (error) {
      console.log(error);
    }
  }

  async getValidationStatus(id: string) {
    try {
      const response = await api.get(this.route(`validation-status/${id}`));
      return response.data as {
        validators: ValidatorValidation[];
        success: boolean;
      };
    } catch (error) {
      console.log(error);
    }
  }

  async definePin(id: string, data: { pin: string }) {
    try {
      const response = await api.patch(this.route(`${id}/define-pin`), data);
      return response.data as Validator[];
    } catch (error) {
      console.log(error);
    }
  }

  async revocate(id: string) {
    try {
      const response = await api.delete(this.route(`${id}/revocate`));
      return response.data;
    } catch (error) {
      console.log(error);
    }
  }
}

export const validatorApi = new ValidatorApi();
