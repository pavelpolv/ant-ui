import { useMemo } from 'react';
import { DocumentsTable } from '../common/DocumentsTable';
import { useDocStructure } from '../common/hooks';
import { buildTree } from './buildTree';
import { COLUMNS } from './columns';
import { SCROLL_X } from './fields';
import { useTaskList } from './api';

const firstLoadError = (...queries: { data?: unknown; error: Error | null }[]) =>
  queries.find((query) => !query.data && query.error)?.error ?? null;

// TODO: состав props не определён — кроме taskId будет что-то ещё
export interface TaskDocumentsProps {
  taskId: string;
}

export const TaskDocuments = ({ taskId }: TaskDocumentsProps) => {
  const structure = useDocStructure();
  const documents = useTaskList(taskId);

  const rows = useMemo(
    () => (structure.data && documents.data ? buildTree(structure.data, documents.data) : []),
    [structure.data, documents.data],
  );

  return (
    <DocumentsTable
      rows={rows}
      columns={COLUMNS}
      error={firstLoadError(structure, documents)}
      loading={structure.isPending || documents.isPending}
      scrollX={SCROLL_X}
    />
  );
};
