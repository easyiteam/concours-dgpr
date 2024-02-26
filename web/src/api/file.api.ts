import { api } from '.';

export default {
  async upload(file: File) {
    try {
      const formData = new FormData();
      formData.append('file', file);
      const response = api.post('file/upload', formData);
      return (await response).data;
    } catch (error) {
      console.log(error);
    }
  },
};
