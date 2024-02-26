import { BaseApi } from './base.api';
import { Document, CreateDocument } from './typings';

export class DocumentApi extends BaseApi<Document, CreateDocument> {
  constructor() {
    super('documents');
  }
}

export const documentApi = new DocumentApi();
