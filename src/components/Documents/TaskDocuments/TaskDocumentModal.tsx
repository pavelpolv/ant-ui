import { DocumentModal } from '../common/DocumentModal';
import type { DocumentData } from '../common/types';
import { downloadFile, useDocumentEditing } from './api';

export const TaskDocumentModal = ({ document }: { document: DocumentData }) => {
  const editing = useDocumentEditing(document);
  return <DocumentModal document={document} download={downloadFile} editing={editing} />;
};
