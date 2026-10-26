import { Result, Spin, Table, type TableColumnsType } from 'antd';
import { TREE_INDENT } from './cells';

export interface DocumentsTableProps<T> {
  rows: T[];
  columns: TableColumnsType<T>;
  error?: Error | null;
  loading: boolean;
}

export const DocumentsTable = <T extends { key: string }>({
  rows,
  columns,
  error,
  loading,
}: DocumentsTableProps<T>) => {
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
      expandable={{ defaultExpandAllRows: true, indentSize: TREE_INDENT }}
      tableLayout="fixed"
      scroll={{ x: 1200 }}
      locale={{ emptyText: 'Документов нет' }}
    />
  );
};
