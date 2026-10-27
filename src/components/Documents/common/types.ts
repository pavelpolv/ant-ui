export interface FileInfo {
  id: string;
  name: string;
  createdAt: string;
  createdBy: string;
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
  counterparty: string;
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
  docInEntityId: string;
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

export interface DictItem {
  code: string;
  value: string;
}

export interface DictList {
  List: DictItem[];
}

export interface DocTypeDict {
  id: string;
  codeEkd: string;
  shortName: string;
  fullName: string;
  multipleInList: boolean;
  client: boolean;
  docSelectionByDetails: boolean;
  signType: DictList | null;
  period: DictList | null;
  // TODO: в примере ответа validityPeriod = null — тип не известен
  validityPeriod: DictList | null;
  initiatorChannel: DictList | null;
  provisionForm: DictList | null;
  assuranceLevel: DictList | null;
  usingCopy: boolean;
  submittingOriginalDeadline: string | null;
  primaryDocument: boolean;
  taxMonitoringDoc: boolean;
  archive: boolean;
  createAt: string;
  createBy: string;
  updateAt: string | null;
  updateBy: string | null;
}
