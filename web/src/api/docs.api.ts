import { api } from '.';

export async function getPosts() {
  const response = await api.get('documents');
  return response.data.values;
}

export async function viewPost(id: string) {
  await api.patch(`documents/${id}/view`);
}

export async function downloadPost(id: string) {
  await api.patch(`documents/${id}/download`);
}
