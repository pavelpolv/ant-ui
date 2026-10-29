import { Tag, Typography, type TableColumnsType } from 'antd';
import { DocumentTitle, FileList, FolderIcon } from '../common/cells';
import type { DocFile, FileInfo } from '../common/types';
import { downloadFile } from './api';
import { AddCompanyDocumentButton } from './AddCompanyDocument';
import { AddDocumentButton } from './AddDocumentButton';
import type { TreeRow } from './buildTree';
import { DeleteDocTypeButton } from './DeleteDocType';
import { FieldSelect } from './FieldSelect';
import { EDITABLE_COLUMNS, STATUS_COLORS } from './fields';

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
          case 'docType': {
            const { counterparty, counterpartyCode, counterpartyName } = row.counterparty;
            return (
              <>
                <FolderIcon /> {row.name}{' '}
                <AddDocumentButton
                  docTypeId={row.docType}
                  // TODO: docInEntityId — docList.id из GET /docList, ручки нет — берём первый
                  docInEntityId={row.docInEntityIds[0]}
                  counterpartyName={counterpartyName}
                  counterparty={counterparty}
                  counterpartyCode={counterpartyCode}
                />
                <DeleteDocTypeButton
                  name={row.name}
                  counterpartyName={counterpartyName}
                  docInEntityIds={row.docInEntityIds}
                  documentsCount={row.children.filter((child) => child.kind === 'document').length}
                />
              </>
            );
          }
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
