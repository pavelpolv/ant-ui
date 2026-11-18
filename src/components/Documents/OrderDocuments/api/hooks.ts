import { useQuery } from '@tanstack/react-query';
import { fetchDocumentsData } from './requests';

export const ORDER_DOCUMENTS_KEY = 'orderDocuments';

export const useDocumentsData = (entityId: string) =>
  useQuery({
    queryKey: [ORDER_DOCUMENTS_KEY, 'documents', entityId],
    queryFn: () => fetchDocumentsData(entityId),
    enabled: Boolean(entityId),
  });
