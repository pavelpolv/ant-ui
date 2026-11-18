import { Button, Tooltip } from 'antd';
import { FileAddOutlined } from '@ant-design/icons';
import { useModals } from '@/components/modals';
import { AddCompanyDocumentModal, type AddCompanyDocumentModalProps } from './AddCompanyDocumentModal';

export type AddCompanyDocumentButtonProps = AddCompanyDocumentModalProps;

export const AddCompanyDocumentButton = (props: AddCompanyDocumentButtonProps) => {
  const modals = useModals();
  return (
    <Tooltip title="Добавить документ">
      <Button
        size="small"
        color="primary"
        variant="text"
        icon={<FileAddOutlined />}
        aria-label="Добавить документ"
        onClick={() => modals.show(AddCompanyDocumentModal, props)}
      />
    </Tooltip>
  );
};
