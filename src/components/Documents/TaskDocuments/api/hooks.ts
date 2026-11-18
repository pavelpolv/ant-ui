import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createDocumentInList,
  deleteDocInEntity,
  deleteVersionFile,
  fetchDocTypesDict,
  fetchTaskList,
  saveVersion,
  uploadVersionFile,
} from './requests';
import type { NewDocumentToListRequest } from './types';
import type { DocumentEditing } from '@/components/Documents/common/DocumentModal';
import type { DocumentFields } from '@/components/Documents/common/types';
import type { DocumentData, ValueField } from '@/components/Documents/common/types';

export const TASK_DOCUMENTS_KEY = 'taskDocuments';

export const useTaskList = (entityId: string, taskCode: string) =>
  useQuery({
    queryKey: [TASK_DOCUMENTS_KEY, 'taskList', entityId, taskCode],
    queryFn: () => fetchTaskList(entityId, taskCode),
    enabled: Boolean(entityId) && Boolean(taskCode),
  });

export const useSaveField = (document: DocumentData, field: ValueField) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (value: string) =>
      saveVersion(document.nkpDocumentId, document.versionData.nkpDocId, { [field]: value }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [TASK_DOCUMENTS_KEY, 'taskList'] }),
  });
};

const uploadFiles = async (versionId: string, files: { uid: string; file: File }[]) => {
  const results = await Promise.allSettled(files.map(({ file }) => uploadVersionFile(versionId, file)));
  const failed = new Map<string, Error>();
  results.forEach((result, index) => {
    if (result.status === 'rejected') failed.set(files[index].uid, result.reason as Error);
  });
  return failed;
};

export const useDocumentEditing = (document: DocumentData): DocumentEditing => {
  const queryClient = useQueryClient();
  const versionId = document.versionData.nkpDocId;
  const invalidate = () => queryClient.invalidateQueries({ queryKey: [TASK_DOCUMENTS_KEY, 'taskList'] });
  const save = useMutation({
    mutationFn: (changes: Partial<DocumentFields>) => saveVersion(document.nkpDocumentId, versionId, changes),
    onSuccess: invalidate,
  });
  return {
    save,
    uploadFile: async (file) => {
      const fileId = await uploadVersionFile(versionId, file);
      void invalidate();
      return fileId;
    },
    deleteFile: async (fileId) => {
      await deleteVersionFile(versionId, fileId);
      void invalidate();
    },
  };
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
      return { versionId: id, failed: await uploadFiles(id, files) };
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [TASK_DOCUMENTS_KEY, 'taskList'] }),
  });
};
