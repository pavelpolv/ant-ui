import { useQuery } from '@tanstack/react-query';
import { fetchDocumentsData, fetchOrder } from './requests';

export const ORDER_DOCUMENTS_KEY = 'orderDocuments';

export const useOrder = (orderId: string) =>
  useQuery({
    queryKey: [ORDER_DOCUMENTS_KEY, 'order', orderId],
    queryFn: () => fetchOrder(orderId),
    enabled: Boolean(orderId),
  });

export const useDocumentsData = (entityId: string) =>
  useQuery({
    queryKey: [ORDER_DOCUMENTS_KEY, 'documents', entityId],
    queryFn: () => fetchDocumentsData(entityId),
    enabled: Boolean(entityId),
  });
