import { Modal } from '@/components/modals';

export interface DocumentModalProps {
  title: string;
}

export const DocumentModal = ({ title }: DocumentModalProps) => <Modal title={title} footer={null} />;
