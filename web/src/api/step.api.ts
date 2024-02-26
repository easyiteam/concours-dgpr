import { api } from '.';

export async function getCurrentStep(id: string) {
  try {
    const result = await api.get(`steps/current-step/${id}`);
    return result.data;
  } catch (error) {
    return null;
  }
}
