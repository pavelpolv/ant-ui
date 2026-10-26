import { http } from '@/api/http';
import { saveFile } from '@/components/Documents/common/saveFile';
import type { FileInfo } from '@/components/Documents/common/types';
import type { DocStructureResponse, DocumentsDataResponse, Order, OrderResponse } from './types';

export const fetchOrder = async (orderId: string): Promise<Order> => {
  const { data } = await http.get<OrderResponse>(`/order/${orderId}`);
  if (data.error_code !== 0) throw new Error(data.error ?? `Ошибка загрузки заявки (код ${data.error_code})`);
  return data.order;
};

export const fetchDocStructure = async (): Promise<DocStructureResponse> =>
  (await http.get<DocStructureResponse>('/doc-structure')).data;

export const fetchDocumentsData = async (entityId: string): Promise<DocumentsDataResponse> =>
  (await http.get<DocumentsDataResponse>(`/documents-data/${entityId}`)).data;

export const downloadFile = async ({ id, name }: FileInfo): Promise<void> => {
  const { data } = await http.get<Blob>(`/elar-file/${id}`, { responseType: 'blob' });
  saveFile(data, name);
};
