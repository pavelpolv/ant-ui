import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createDocumentInList,
  deleteDocInEntity,
  fetchDocTypesDict,
  fetchTaskList,
  saveVersionField,
  uploadVersionFile,
} from './requests';
import type { NewDocumentToListRequest } from './types';
import type { DocumentData, ValueField } from '@/components/Documents/common/types';

export const TASK_DOCUMENTS_KEY = 'taskDocuments';

export const useTaskList = (taskId: string) =>
  useQuery({
    queryKey: [TASK_DOCUMENTS_KEY, 'taskList', taskId],
    queryFn: () => fetchTaskList(taskId),
    enabled: Boolean(taskId),
  });

export const useSaveField = (document: DocumentData, field: ValueField) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (value: string) =>
      saveVersionField(document.nkpDocumentId, document.versionData.nkpDocId, field, value),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [TASK_DOCUMENTS_KEY, 'taskList'] }),
  });
};

export const useDeleteDocType = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (docInEntityIds: string[]) => {
      await Promise.all(docInEntityIds.map(deleteDocInEntity));
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [TASK_DOCUMENTS_KEY, 'taskList'] }),
  });
};

export const useDocTypesDict = () =>
  useQuery({
    queryKey: [TASK_DOCUMENTS_KEY, 'docTypesDict'],
    queryFn: fetchDocTypesDict,
    staleTime: Infinity,
  });

export interface AddDocumentVariables {
  request: NewDocumentToListRequest;
  versionId?: string;
  files: { uid: string; file: File }[];
}

export interface AddDocumentResult {
  versionId: string;
  failed: Map<string, Error>;
}

export const useAddDocument = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ request, versionId, files }: AddDocumentVariables): Promise<AddDocumentResult> => {
      const id = versionId ?? (await createDocumentInList(request));
      const results = await Promise.allSettled(files.map(({ file }) => uploadVersionFile(id, file)));
      const failed = new Map<string, Error>();
      results.forEach((result, index) => {
        if (result.status === 'rejected') failed.set(files[index].uid, result.reason as Error);
      });
      return { versionId: id, failed };
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [TASK_DOCUMENTS_KEY, 'taskList'] }),
  });
};
