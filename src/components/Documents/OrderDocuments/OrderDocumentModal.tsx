import { DocumentModal } from '../common/DocumentModal';
import type { DocumentData } from '../common/types';
import { downloadFile } from './api';

export const OrderDocumentModal = ({ document }: { document: DocumentData }) => (
  <DocumentModal document={document} download={downloadFile} />
);
