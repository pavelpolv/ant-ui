import { useEffect, useMemo } from 'react';
import { useModals } from '@/components/modals';
import { DocumentsTable } from '../common/DocumentsTable';
import { useDocStructure, useEntityId } from '../common/hooks';
import type { DocumentsConfig } from '../common/types';
import { AddCompanyDocumentModal } from './AddCompanyDocument/AddCompanyDocumentModal';
import { buildTree } from './buildTree';
import { createColumns } from './columns';
import { DeleteDocTypeModal } from './DeleteDocType/DeleteDocTypeModal';
import { SCROLL_X } from './fields';
import { TaskDocumentModal } from './TaskDocumentModal';
import { useTaskList } from './api';

const TASK_MODALS = [TaskDocumentModal, AddCompanyDocumentModal, DeleteDocTypeModal];

const firstLoadError = (...queries: { data?: unknown; error: Error | null }[]) =>
  queries.find((query) => !query.data && query.error)?.error ?? null;

export interface TaskDocumentsProps {
  taskId: string;
  orderId: string;
  definitionKey: string;
  config: DocumentsConfig;
}

const TaskDocumentsContent = ({
  taskId,
  orderId,
  definitionKey,
}: {
  taskId: string;
  orderId: string;
  definitionKey: string;
}) => {
  const modals = useModals();
  useEffect(() => () => TASK_MODALS.forEach((modal) => modals.hide(modal)), [modals]);
  const entityId = useEntityId(orderId);
  const structure = useDocStructure();
  const documents = useTaskList(entityId.data ?? '', definitionKey);

  const rows = useMemo(
    () => (structure.data && documents.data ? buildTree(structure.data, documents.data) : []),
    [structure.data, documents.data],
  );
  const columns = useMemo(() => createColumns(taskId), [taskId]);

  return (
    <DocumentsTable
      rows={rows}
      columns={columns}
      error={firstLoadError(entityId, structure, documents)}
      loading={entityId.isPending || structure.isPending || documents.isPending}
      scrollX={SCROLL_X}
    />
  );
};

export const TaskDocuments = ({ taskId, orderId, definitionKey, config }: TaskDocumentsProps) =>
  config?.visible === true ? (
    <TaskDocumentsContent taskId={taskId} orderId={orderId} definitionKey={definitionKey} />
  ) : null;
