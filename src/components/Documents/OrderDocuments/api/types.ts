export interface OrderResponse {
  error_code: number;
  error: string | null;
  order: Order;
}

export interface Order {
  orderId: string;
  orderNumber: string;
  orderType: string;
  orderStatus: string | null;
  title: string;
  closedDate: string | null;
  createdDateTime: string | null;
}

export interface DocStructureItem {
  id: string;
  strLevel: number;
  strName: string;
  strParent: string | null;
  strSort: number;
  docTypeInfo: DocTypeInfo[];
}

export interface DocTypeInfo {
  docType: string;
  docTypeName: string;
  docInStrSort: number;
}

export type DocStructureResponse = DocStructureItem[];

export interface DocumentsDataResponse {
  docLists: DocList[];
}

export interface DocList {
  counterparty: Counterparty;
  documentData: DocumentData[];
}

export interface Counterparty {
  counterpartyCode: string;
  counterpartyName: string;
  counterpartyType: string;
  counterpartyPart: string;
}

export interface DocumentData {
  nkpDocumentId: string;
  ekdBaseDocId: string;
  docType: string;
  docPeriod: string;
  productId: string;
  nkpCreatedBy: string;
  nkpCreateAt: string;
  nkpUpdateBy: string;
  nkpUpdateAt: string;
  versionData: VersionData;
}

export interface VersionData {
  ekdDocId: string;
  nkpDocId: string;
  newVersion: boolean;
  version: number;
  statusCode: string;
  statusName: string;
  docName: string;
  docDate: string;
  docNumber: string;
  signType: string;
  validityPeriod: string;
  initiatorChannel: string;
  provisionForm: string;
  assuranceLevel: string;
  usingCopy: boolean;
  submittingOriginalDeadline: string;
  suspensiveProvision: boolean;
  comment: string;
  storageLocation: string;
  expertiseData: ExpertiseData;
  nkpCreatedBy: string;
  nkpCreateAt: string;
  nkpUpdateBy: string;
  nkpUpdateAt: string;
  files: DocFile[];
}

export interface ExpertiseData {
  expertiseType: string;
  expertiseResolution: string;
  expertiseComment: string;
  expert: string;
  expertBoss: string;
}

export interface DocFile {
  nkpFileId: string;
  fileName: string;
  format: string;
  size: number;
  elarId: string;
  nkpCreatedBy: string;
  nkpCreateAt: string;
  nkpUpdateBy: string;
  nkpUpdateAt: string;
}

export type ValueField = 'signType' | 'assuranceLevel' | 'provisionForm';
