import { http } from '@/api/http';
import { saveFile } from '@/components/Documents/common/saveFile';
import type { DocumentsDataResponse, FileInfo } from '@/components/Documents/common/types';

export const fetchDocumentsData = async (entityId: string): Promise<DocumentsDataResponse> =>
  (await http.get<DocumentsDataResponse>(`/proxy/api/credit-doc/documents-data/${entityId}`)).data;

export const downloadFile = async ({ id, name }: FileInfo): Promise<void> => {
  const { data } = await http.get<Blob>(`/proxy/api/credit-doc/elar-file/${id}`, { responseType: 'blob' });
  saveFile(data, name);
};
