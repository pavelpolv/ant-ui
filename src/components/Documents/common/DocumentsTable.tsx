import { useMemo, useState } from 'react';
import { Result, Spin, Table, type TableColumnsType } from 'antd';
import { TREE_INDENT } from './cells';

export interface TreeNode {
  key: string;
  children?: TreeNode[];
}

const collectParentKeys = (rows: TreeNode[]): string[] =>
  rows.flatMap((row) => (row.children?.length ? [row.key, ...collectParentKeys(row.children)] : []));

export interface DocumentsTableProps<T> {
  rows: T[];
  columns: TableColumnsType<T>;
  error?: Error | null;
  loading: boolean;
  scrollX?: number;
}

export const DocumentsTable = <T extends TreeNode>({
  rows,
  columns,
  error,
  loading,
  scrollX = 1200,
}: DocumentsTableProps<T>) => {
  const [collapsed, setCollapsed] = useState<Set<string>>(() => new Set());
  const parentKeys = useMemo(() => collectParentKeys(rows), [rows]);
  const expandedRowKeys = parentKeys.filter((key) => !collapsed.has(key));

  if (error) return <Result status="error" title="Ошибка загрузки" subTitle={error.message} />;
  if (loading) return <Spin />;

  return (
    <Table<T>
      rowKey="key"
      size="small"
      bordered
      pagination={false}
      dataSource={rows}
      columns={columns}
      expandable={{
        expandedRowKeys,
        onExpand: (expanded, row) =>
          setCollapsed((prev) => {
            const next = new Set(prev);
            if (expanded) next.delete(row.key);
            else next.add(row.key);
            return next;
          }),
        indentSize: TREE_INDENT,
      }}
      tableLayout="fixed"
      scroll={{ x: scrollX }}
      locale={{ emptyText: 'Документов нет' }}
    />
  );
};
