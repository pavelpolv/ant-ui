import { Flex, Tag, Typography, type TableColumnsType } from 'antd';
import { DocumentTitle, FileList, FolderIcon } from '../common/cells';
import { FieldValue } from '../common/fields';
import type { DocFile, FileInfo } from '../common/types';
import { downloadFile } from './api';
import type { TreeRow } from './buildTree';
import { STATUS_COLORS, VALUE_COLUMNS } from './fields';

const toFileInfo = (file: DocFile): FileInfo => ({
  id: file.nkpFileId,
  name: file.fileName,
  createdAt: file.nkpCreateAt,
  createdBy: file.nkpCreatedBy,
});

const groupSpan = (row: TreeRow) => ({ colSpan: row.kind === 'document' ? 1 : 0 });

export const COLUMNS: TableColumnsType<TreeRow> = [
  {
    key: 'document',
    title: 'Документ',
    onCell: (row) =>
      row.kind === 'document' ? { style: { whiteSpace: 'nowrap' } } : { colSpan: COLUMNS.length },
    render: (_, row) => {
      switch (row.kind) {
        case 'company':
          return <Typography.Text strong>{row.counterparty.counterpartyName}</Typography.Text>;
        case 'folder':
        case 'docType':
          return <><FolderIcon /> {row.name}</>;
        case 'document': {
          const { docName, version } = row.document.versionData;
          return <DocumentTitle name={docName} version={version} level={row.level} />;
        }
      }
    },
  },
  {
    key: 'files',
    title: 'Файлы',
    width: 300,
    onCell: groupSpan,
    render: (_, row) =>
      row.kind === 'document'
        ? <FileList files={row.document.versionData.files.map(toFileInfo)} download={downloadFile} />
        : null,
  },
  {
    key: 'status',
    title: 'Статус',
    width: 130,
    onCell: groupSpan,
    render: (_, row) => {
      if (row.kind !== 'document') return null;
      const { statusCode, statusName } = row.document.versionData;
      return <Tag color={STATUS_COLORS[statusCode]}>{statusName}</Tag>;
    },
  },
  ...VALUE_COLUMNS.map(({ key, title, fields, width }) => ({
    key,
    title,
    width,
    onCell: groupSpan,
    render: (_: unknown, row: TreeRow) => {
      if (row.kind !== 'document') return null;
      const { docType, versionData } = row.document;
      return (
        <Flex vertical gap={2}>
          {fields.map((field) => (
            <div key={field}>
              <FieldValue docType={docType} field={field} code={versionData[field]} />
            </div>
          ))}
        </Flex>
      );
    },
  })),
];
