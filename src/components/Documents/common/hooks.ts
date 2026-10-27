import { useMutation, useQuery } from '@tanstack/react-query';
import { fetchDocStructure, fetchDocTypeDict } from './requests';
import type { DictItem, DocTypeDict, FileInfo, ValueField } from './types';

export const useDownloadFile = (file: FileInfo, download: (file: FileInfo) => Promise<void>) =>
  useMutation({ mutationFn: () => download(file) });

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

export const useFieldValues = (docType: string) =>
  useQuery({
    queryKey: ['docTypeDict', docType],
    queryFn: () => fetchDocTypeDict(docType),
    select: selectFieldValues,
    enabled: Boolean(docType),
    staleTime: Infinity,
  });
