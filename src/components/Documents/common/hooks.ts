import { useMutation, useQuery } from '@tanstack/react-query';
import { fetchDocStructure, fetchDocTypeDict, fetchOrder } from './requests';
import type { DictItem, DocTypeDict, FileInfo, ValueField } from './types';

export const useDownloadFile = (file: FileInfo, download: (file: FileInfo) => Promise<void>) =>
  useMutation({ mutationFn: () => download(file) });

/** `entityId` для ручек документов: `{order.orderType}~{order.orderId}` из `GET /front-bank/order/{orderId}`. */
export const useEntityId = (orderId: string) =>
  useQuery({
    queryKey: ['order', orderId],
    queryFn: () => fetchOrder(orderId),
    select: (order) => `${order.orderType}~${order.orderId}`,
    enabled: Boolean(orderId),
  });

export const useDocStructure = () =>
  useQuery({
    queryKey: ['docStructure'],
    queryFn: () => fetchDocStructure(),
  });

const selectFieldValues = (dict: DocTypeDict): Record<ValueField, DictItem[]> => ({
  assuranceLevel: dict.assuranceLevel?.List ?? [],
  provisionForm: dict.provisionForm?.List ?? [],
  signType: dict.signType?.List ?? [],
});

const docTypeDictQuery = (docType: string) => ({
  queryKey: ['docTypeDict', docType],
  queryFn: () => fetchDocTypeDict(docType),
  enabled: Boolean(docType),
  staleTime: Infinity,
});

export const useFieldValues = (docType: string) =>
  useQuery({ ...docTypeDictQuery(docType), select: selectFieldValues });

const selectInitiatorChannels = (dict: DocTypeDict): DictItem[] => dict.initiatorChannel?.List ?? [];

export const useInitiatorChannels = (docType: string) =>
  useQuery({ ...docTypeDictQuery(docType), select: selectInitiatorChannels });
