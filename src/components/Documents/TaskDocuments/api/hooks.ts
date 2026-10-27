import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchTaskList, saveVersionField } from './requests';
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
