import { Alert, App, Flex, theme, Typography } from 'antd';
import { ExclamationCircleFilled } from '@ant-design/icons';
import { Modal, useModal } from '@/components/modals';
import { useDeleteDocType } from '../api';
import { describeError } from '../describeError';

export interface DeleteDocTypeModalProps {
  name: string;
  counterpartyName: string;
  docInEntityIds: string[];
  documentsCount: number;
}

export const DeleteDocTypeModal = ({
  name,
  counterpartyName,
  docInEntityIds,
  documentsCount,
}: DeleteDocTypeModalProps) => {
  const modal = useModal();
  const { notification } = App.useApp();
  const { token } = theme.useToken();
  const mutation = useDeleteDocType();
  const handleOk = () =>
    mutation.mutate(docInEntityIds, {
      onSuccess: () => {
        notification.success({ title: 'Вид документа исключён', description: name });
        modal.hide();
      },
    });
  return (
    <Modal
      title={(
        <Flex gap={12} align="flex-start" style={{ paddingInlineEnd: 24 }}>
          <ExclamationCircleFilled style={{ color: token.colorError, fontSize: 22, marginTop: 1 }} />
          Вы уверены, что хотите исключить вид документа из списка?
        </Flex>
      )}
      okText="Да, исключить"
      cancelText="Отмена"
      okButtonProps={{ danger: true }}
      confirmLoading={mutation.isPending}
      onOk={handleOk}
      width={420}
    >
      <Flex vertical gap={16} style={{ paddingInlineStart: 34 }}>
        <Typography.Text>
          <Typography.Text strong>«{name}»</Typography.Text>
          {documentsCount > 0 ? ` и его документы (${documentsCount}) будут исключены` : ' будет исключён'}
          {' из списка компании '}
          <Typography.Text strong>{counterpartyName}</Typography.Text>.
        </Typography.Text>
        {mutation.isError && (
          <Alert
            type="error"
            showIcon
            title="Не удалось исключить вид документа"
            description={describeError(mutation.error)}
          />
        )}
      </Flex>
    </Modal>
  );
};
