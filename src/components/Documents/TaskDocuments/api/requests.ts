import { http } from '@/api/http';
import { saveFile } from '@/components/Documents/common/saveFile';
import type { DocumentsDataResponse, FileInfo, ValueField } from '@/components/Documents/common/types';
import type {
  DocTypesDictItem,
  NewDocumentToListRequest,
  NewDocumentToListResponse,
  NewVersionRequest,
} from './types';

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

export const deleteDocInEntity = async (docInEntityId: string): Promise<void> => {
  await http.delete(`/credit-doc/document-in-entity/${docInEntityId}`);
};

export const fetchDocTypesDict = async (): Promise<DocTypesDictItem[]> =>
  (await http.get<DocTypesDictItem[]>('/credit-doc/docTypesDict', { params: { archive: false } })).data;

export const createDocumentInList = async (body: NewDocumentToListRequest): Promise<string> =>
  (await http.post<NewDocumentToListResponse>('/credit-doc/new-document-to-list', body)).data.docVersionId;

export const uploadVersionFile = async (versionId: string, file: File): Promise<void> => {
  const body = new FormData();
  body.append('file', file);
  await http.post(`/credit-doc/file/${versionId}`, body);
};

export const downloadFile = async ({ id, name }: FileInfo): Promise<void> => {
  const { data } = await http.get<Blob>(`/credit-doc/elar-file/${id}`, { responseType: 'blob' });
  saveFile(data, name);
};
