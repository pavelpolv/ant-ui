import { http } from '@/api/http';
import { saveFile } from '@/components/Documents/common/saveFile';
import type { DocumentsDataResponse, FileInfo, ValueField } from '@/components/Documents/common/types';
import type { NewVersionRequest } from './types';

// TODO: entityId и параметры тела POST /taskList не описаны — уточнить у бэкенда
export const fetchTaskList = async (taskId: string): Promise<DocumentsDataResponse> =>
  (await http.post<DocumentsDataResponse>(`/credit-doc/taskList/${taskId}`, {})).data;

// TODO: ручка сохранения не описана до конца — сверить тело запроса и ответ с бэкендом
export const saveVersionField = async (
  documentId: string,
  versionId: string,
  field: ValueField,
  value: string,
): Promise<void> => {
  const body: NewVersionRequest = { versionData: { id: versionId, [field]: value } };
  await http.post(`/credit-doc/new-version/${documentId}`, body);
};

export const downloadFile = async ({ id, name }: FileInfo): Promise<void> => {
  const { data } = await http.get<Blob>(`/credit-doc/elar-file/${id}`, { responseType: 'blob' });
  saveFile(data, name);
};
