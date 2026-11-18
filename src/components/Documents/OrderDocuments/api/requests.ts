import { http } from '@/api/http';
import { saveFile } from '@/components/Documents/common/saveFile';
import type { DocumentsDataResponse, FileInfo } from '@/components/Documents/common/types';
import type { Order, OrderResponse } from './types';

export const fetchOrder = async (orderId: string): Promise<Order> => {
  const { data } = await http.get<OrderResponse>(`/credit-doc/order/${orderId}`);
  if (data.error_code !== 0) throw new Error(data.error ?? `Ошибка загрузки заявки (код ${data.error_code})`);
  return data.order;
};

export const fetchDocumentsData = async (entityId: string): Promise<DocumentsDataResponse> =>
  (await http.get<DocumentsDataResponse>(`/credit-doc/documents-data/${entityId}`)).data;

export const downloadFile = async ({ id, name }: FileInfo): Promise<void> => {
  const { data } = await http.get<Blob>(`/credit-doc/elar-file/${id}`, { responseType: 'blob' });
  saveFile(data, name);
};
