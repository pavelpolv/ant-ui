import { http } from '@/api/http';
import { saveFile } from '@/components/Documents/common/saveFile';
import type { DocumentFields, DocumentsDataResponse, FileInfo } from '@/components/Documents/common/types';
import type {
  DocTypesDictItem,
  NewDocumentToListRequest,
  NewDocumentToListResponse,
  NewVersionRequest,
  UploadFileResponse,
} from './types';

// TODO: entityId и параметры тела POST /taskList не описаны — уточнить у бэкенда
export const fetchTaskList = async (taskId: string): Promise<DocumentsDataResponse> =>
  (await http.post<DocumentsDataResponse>(`/credit-doc/taskList/${taskId}`, {})).data;

// TODO: ручка сохранения не описана до конца — сверить тело запроса и ответ с бэкендом
export const saveVersion = async (
  documentId: string,
  versionId: string,
  fields: Partial<DocumentFields>,
): Promise<void> => {
  const body: NewVersionRequest = { versionData: { id: versionId, ...fields } };
  await http.post(`/credit-doc/new-version/${documentId}`, body);
};

export const deleteDocInEntity = async (docInEntityId: string): Promise<void> => {
  await http.delete(`/credit-doc/document-in-entity/${docInEntityId}`);
};

export const fetchDocTypesDict = async (): Promise<DocTypesDictItem[]> =>
  (await http.get<DocTypesDictItem[]>('/credit-doc/docTypesDict', { params: { archive: false } })).data;

export const createDocumentInList = async (body: NewDocumentToListRequest): Promise<string> =>
  (await http.post<NewDocumentToListResponse>('/credit-doc/new-document-to-list', body)).data.docVersionId;

export const uploadVersionFile = async (versionId: string, file: File): Promise<string> => {
  const body = new FormData();
  body.append('file', file);
  return (await http.post<UploadFileResponse>(`/credit-doc/file/${versionId}`, body)).data.fileId;
};

export const deleteVersionFile = async (versionId: string, fileId: string): Promise<void> => {
  await http.delete(`/credit-doc/file/${versionId}/${fileId}`);
};

export const downloadFile = async ({ id, name }: FileInfo): Promise<void> => {
  const { data } = await http.get<Blob>(`/credit-doc/elar-file/${id}`, { responseType: 'blob' });
  saveFile(data, name);
};
