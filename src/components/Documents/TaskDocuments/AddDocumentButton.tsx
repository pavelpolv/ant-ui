import { Button, Descriptions, Tooltip } from 'antd';
import { FileAddOutlined } from '@ant-design/icons';
import { Modal, useModals } from '@/components/modals';

interface NewDocumentModalProps {
  docTypeId: string;
  docInEntityId: string;
  counterpartyName: string;
  counterparty: string;
  counterpartyCode: string;
}

// TODO: заглушка формы «Документ» (п. 9.3 ТЗ) в режиме создания — показывает переданные параметры
const NewDocumentModal = (props: NewDocumentModalProps) => (
  <Modal title="Новый документ" footer={null}>
    <Descriptions
      size="small"
      column={1}
      bordered
      items={Object.entries(props).map(([key, value]) => ({ key, label: key, children: value }))}
    />
  </Modal>
);

export type AddDocumentButtonProps = NewDocumentModalProps;

export const AddDocumentButton = (props: AddDocumentButtonProps) => {
  const modals = useModals();
  return (
    <Tooltip title="Добавить документ">
      <Button
        size="small"
        color="primary"
        variant="text"
        icon={<FileAddOutlined />}
        aria-label="Добавить документ"
        onClick={() => modals.show(NewDocumentModal, props)}
      />
    </Tooltip>
  );
};
