import type { Counterparty, DocStructureResponse, DocumentData, DocumentsDataResponse } from '../common/types';

export type TreeRow =
  | { kind: 'company'; key: string; counterparty: Counterparty; children?: TreeRow[] }
  | { kind: 'folder'; key: string; name: string; children: TreeRow[] }
  | { kind: 'docType'; key: string; name: string; children: TreeRow[] }
  | { kind: 'document'; key: string; document: DocumentData; level: number };

const counterpartyRank = ({ counterpartyType, counterpartyPart }: Counterparty): number => {
  if (counterpartyType === 'HOLDING') return 0;
  if (counterpartyPart === 'Borrower') return 1;
  return 2;
};

const compareCounterparties = (a: Counterparty, b: Counterparty): number =>
  counterpartyRank(a) - counterpartyRank(b) || a.counterpartyName.localeCompare(b.counterpartyName, 'ru');

export const buildTree = (structure: DocStructureResponse, data: DocumentsDataResponse): TreeRow[] => {
  const childFolders = new Map<string | null, DocStructureResponse>();
  for (const item of structure) {
    const siblings = childFolders.get(item.strParent) ?? [];
    siblings.push(item);
    childFolders.set(item.strParent, siblings);
  }
  for (const siblings of childFolders.values()) siblings.sort((a, b) => a.strSort - b.strSort);

  const docLists = [...data.docLists].sort((a, b) => compareCounterparties(a.counterparty, b.counterparty));

  return docLists.map(({ counterparty, documentData }) => {
    const companyKey = counterparty.counterpartyCode;

    const docsByType = new Map<string, DocumentData[]>();
    for (const doc of documentData) {
      const docs = docsByType.get(doc.docType) ?? [];
      docs.push(doc);
      docsByType.set(doc.docType, docs);
    }

    const buildFolders = (parentId: string | null, level: number): TreeRow[] =>
      (childFolders.get(parentId) ?? []).flatMap((folder): TreeRow[] => {
        const key = `${companyKey}/${folder.id}`;
        const docTypeInfo = [...folder.docTypeInfo].sort((a, b) => a.docInStrSort - b.docInStrSort);
        const docTypes = docTypeInfo.flatMap((docType): TreeRow[] => {
          const docs = docsByType.get(docType.docType);
          if (!docs?.length) return [];
          const typeKey = `${key}/${docType.docType}`;
          const children = docs.map((document): TreeRow => ({ kind: 'document', key: `${typeKey}/${document.nkpDocumentId}`, document, level: level + 2 }));
          return [{ kind: 'docType', key: typeKey, name: docType.docTypeName, children }];
        });
        const children = [...docTypes, ...buildFolders(folder.id, level + 1)];
        return children.length ? [{ kind: 'folder', key, name: folder.strName, children }] : [];
      });

    const folders = buildFolders(null, 1);
    return { kind: 'company', key: companyKey, counterparty, children: folders.length ? folders : undefined };
  });
};
