import { Button, Tooltip } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import { useModals } from '@/components/modals';
import { DeleteDocTypeModal, type DeleteDocTypeModalProps } from './DeleteDocTypeModal';

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
