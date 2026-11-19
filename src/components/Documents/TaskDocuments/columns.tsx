import { Typography, type TableColumnsType } from 'antd';
import { DocumentTitle, FileList, FolderIcon, StatusTag } from '../common/cells';
import type { DocFile, FileInfo } from '../common/types';
import { downloadFile } from './api';
import { AddCompanyDocumentButton } from './AddCompanyDocument';
import type { TreeRow } from './buildTree';
import { TaskDocumentModal } from './TaskDocumentModal';
import { DeleteDocTypeButton } from './DeleteDocType';
import { FieldSelect } from './FieldSelect';
import { EDITABLE_COLUMNS } from './fields';

const toFileInfo = (file: DocFile): FileInfo => ({
  id: file.nkpFileId,
  name: file.fileName,
  createdAt: file.nkpCreateAt,
  createdBy: file.nkpCreatedBy,
});

const groupSpan = (row: TreeRow) => ({ colSpan: row.kind === 'document' ? 1 : 0 });

export const createColumns = (entityId: string): TableColumnsType<TreeRow> => {
  const columns: TableColumnsType<TreeRow> = [
    {
      key: 'document',
      title: 'Документ',
      onCell: (row) =>
        row.kind === 'document' ? { style: { whiteSpace: 'nowrap' } } : { colSpan: columns.length },
      render: (_, row) => {
        switch (row.kind) {
          case 'company':
            return (
              <>
                <Typography.Text strong>{row.counterparty.counterpartyName}</Typography.Text>{' '}
                <AddCompanyDocumentButton entityId={entityId} counterparty={row.counterparty} />
              </>
            );
          case 'folder':
            return <><FolderIcon /> {row.name}</>;
          case 'docType':
            return (
              <>
                <FolderIcon /> {row.name}{' '}
                <AddCompanyDocumentButton
                  entityId={entityId}
                  counterparty={row.counterparty}
                  presetDocType={{ id: row.docType, shortName: row.name }}
                />
                <DeleteDocTypeButton
                  name={row.name}
                  counterpartyName={row.counterparty.counterpartyName}
                  docInEntityIds={row.docInEntityIds}
                  documentsCount={row.children.filter((child) => child.kind === 'document').length}
                />
              </>
            );
          case 'document': {
            return <DocumentTitle document={row.document} level={row.level} modal={TaskDocumentModal} />;
          }
        }
      },
    },
    {
      key: 'files',
      title: 'Файлы',
      width: 260,
      onCell: groupSpan,
      render: (_, row) =>
        row.kind === 'document'
          ? <FileList files={row.document.versionData.files.map(toFileInfo)} download={downloadFile} />
          : null,
    },
    {
      key: 'status',
      title: 'Статус',
      width: 120,
      onCell: groupSpan,
      render: (_, row) => {
        if (row.kind !== 'document') return null;
        return <StatusTag versionData={row.document.versionData} />;
      },
    },
    ...EDITABLE_COLUMNS.map(({ field, title, width }) => ({
      key: field,
      title,
      width,
      onCell: groupSpan,
      render: (_: unknown, row: TreeRow) =>
        row.kind === 'document' ? <FieldSelect document={row.document} field={field} /> : null,
    })),
  ];
  return columns;
};
