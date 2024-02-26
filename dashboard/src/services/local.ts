import fileApi from '../api/file.api';

export async function uploadFileLocalStrategy(file: File) {
  const result = await fileApi.upload(file);
  return (result as { url: string }).url;
}
