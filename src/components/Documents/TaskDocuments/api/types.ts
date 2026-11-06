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

// TODO: counterpartyCrmId из ТЗ не отправляется — в Counterparty его нет, уточнить источник
export interface NewDocumentToListRequest extends Counterparty {
  entityId: string;
  docTypeId: string;
}

// TODO: ответ POST /file/{versionId} не описан — ожидаем fileId, сверить с ответом бэкенда
export interface UploadFileResponse {
  fileId: string;
}

// TODO: ответ POST /new-document-to-list не описан — ожидаем docVersionId, сверить с ответом бэкенда
export interface NewDocumentToListResponse {
  docVersionId: string;
}
