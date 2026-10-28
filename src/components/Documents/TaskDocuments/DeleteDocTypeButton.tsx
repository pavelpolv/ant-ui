import { App, Button, Tooltip, Typography } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import { Modal, useModal, useModals } from '@/components/modals';
import { useDeleteDocType } from './api';

interface DeleteDocTypeModalProps {
  name: string;
  docInEntityIds: string[];
}

const DeleteDocTypeModal = ({ name, docInEntityIds }: DeleteDocTypeModalProps) => {
  const modal = useModal();
  const { notification } = App.useApp();
  const mutation = useDeleteDocType();
  const handleOk = () =>
    mutation.mutate(docInEntityIds, {
      onSuccess: () => {
        notification.success({ title: 'Вид документа исключён', description: name });
        modal.hide();
      },
      onError: (error) =>
        notification.error({ title: 'Не удалось исключить вид документа', description: `${name}: ${error.message}` }),
    });
  return (
    <Modal
      title="Вы уверены, что хотите исключить вид документа из списка?"
      okText="Да"
      cancelText="Отмена"
      okButtonProps={{ danger: true }}
      confirmLoading={mutation.isPending}
      onOk={handleOk}
    >
      <Typography.Text strong>{name}</Typography.Text>
    </Modal>
  );
};

export type DeleteDocTypeButtonProps = DeleteDocTypeModalProps;

export const DeleteDocTypeButton = (props: DeleteDocTypeButtonProps) => {
  const modals = useModals();
  return (
    <Tooltip title="Исключить вид документа">
      <Button
        size="small"
        type="text"
        danger
        icon={<DeleteOutlined />}
        aria-label="Исключить вид документа"
        onClick={() => modals.show(DeleteDocTypeModal, props)}
      />
    </Tooltip>
  );
};
