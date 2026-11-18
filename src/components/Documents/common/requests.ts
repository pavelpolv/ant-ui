import { http } from '@/api/http';
import type { DocStructureResponse, DocTypeDict, Order, OrderResponse } from './types';

export const fetchDocStructure = async (): Promise<DocStructureResponse> =>
  (await http.get<DocStructureResponse>('/proxy/api/credit-doc/doc-structure')).data;

export const fetchDocTypeDict = async (docType: string): Promise<DocTypeDict> =>
  (await http.get<DocTypeDict>(`/proxy/api/credit-doc/docTypeDict/${docType}`)).data;

// Заявка лежит вне шлюза /proxy/api — своя ручка front-bank.
export const fetchOrder = async (orderId: string): Promise<Order> => {
  const { data } = await http.get<OrderResponse>(`/front-bank/order/${orderId}`);
  if (data.error_code !== 0) throw new Error(data.error ?? `Ошибка загрузки заявки (код ${data.error_code})`);
  return data.order;
};
