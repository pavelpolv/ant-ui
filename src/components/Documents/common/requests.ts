import { http } from '@/api/http';
import type { DocStructureResponse, DocTypeDict } from './types';

export const fetchDocStructure = async (): Promise<DocStructureResponse> =>
  (await http.get<DocStructureResponse>('/credit-doc/doc-structure')).data;

export const fetchDocTypeDict = async (docType: string): Promise<DocTypeDict> =>
  (await http.get<DocTypeDict>(`/credit-doc/docTypeDict/${docType}`)).data;
