import { useEffect, useMemo } from 'react';
import { useModals } from '@/components/modals';
import { DocumentsTable } from '../common/DocumentsTable';
import { useDocStructure, useEntityId } from '../common/hooks';
import type { DocumentsConfig } from '../common/types';
import { buildTree } from './buildTree';
import { COLUMNS } from './columns';
import { OrderDocumentModal } from './OrderDocumentModal';
import { useDocumentsData } from './api';

const firstLoadError = (...queries: { data?: unknown; error: Error | null }[]) =>
  queries.find((query) => !query.data && query.error)?.error ?? null;

export interface OrderDocumentsProps {
  orderId: string;
  config: DocumentsConfig;
}

const OrderDocumentsContent = ({ orderId }: { orderId: string }) => {
  const modals = useModals();
  useEffect(() => () => modals.hide(OrderDocumentModal), [modals]);
  const entityId = useEntityId(orderId);
  const structure = useDocStructure();
  const documents = useDocumentsData(entityId.data ?? '');

  const rows = useMemo(
    () => (structure.data && documents.data ? buildTree(structure.data, documents.data) : []),
    [structure.data, documents.data],
  );

  return (
    <DocumentsTable
      rows={rows}
      columns={COLUMNS}
      error={firstLoadError(entityId, structure, documents)}
      loading={entityId.isPending || structure.isPending || documents.isPending}
    />
  );
};

export const OrderDocuments = ({ orderId, config }: OrderDocumentsProps) =>
  config?.visible === true ? <OrderDocumentsContent orderId={orderId} /> : null;
