import { useMemo } from 'react';
import { DocumentsTable } from '../common/DocumentsTable';
import { useDocStructure } from '../common/hooks';
import { buildTree } from './buildTree';
import { COLUMNS } from './columns';
import { useDocumentsData, useOrder } from './api';

const firstLoadError = (...queries: { data?: unknown; error: Error | null }[]) =>
  queries.find((query) => !query.data && query.error)?.error ?? null;

export interface OrderDocumentsProps {
  orderId: string;
}

export const OrderDocuments = ({ orderId }: OrderDocumentsProps) => {
  const order = useOrder(orderId);
  const structure = useDocStructure();
  const documents = useDocumentsData(order.data ? `${order.data.orderType}~${order.data.orderId}` : '');

  const rows = useMemo(
    () => (structure.data && documents.data ? buildTree(structure.data, documents.data) : []),
    [structure.data, documents.data],
  );

  return (
    <DocumentsTable
      rows={rows}
      columns={COLUMNS}
      error={firstLoadError(order, structure, documents)}
      loading={order.isPending || structure.isPending || documents.isPending}
    />
  );
};
