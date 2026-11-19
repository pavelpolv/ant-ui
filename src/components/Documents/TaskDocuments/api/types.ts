import type { Counterparty, DocumentFields } from '@/components/Documents/common/types';

export interface NewVersionRequest {
  versionData: { id: string } & Partial<DocumentFields>;
}

export interface DocTypesDictItem {
  id: string;
  codeEkd: string;
  shortName: string;
  fullName: string;
  multipleInList: boolean;
  client: boolean;
}

export interface NewDocumentToListRequest extends Counterparty {
  entityId: string; // taskId из props, а не entityId из заявки (см. docs/backend-api.md)
  docTypeId: string;
}

// TODO: ответ POST /file/{versionId} не описан — ожидаем fileId, сверить с ответом бэкенда
export interface UploadFileResponse {
  fileId: string;
}

export interface NewDocumentToListResponse {
  documentId: string;
  docVersionId: string;
}
