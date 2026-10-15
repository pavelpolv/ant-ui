import { Modal as AntModal, type ModalProps as AntModalProps } from 'antd';
import { useOptionalModal } from './createModalManager';

export type ModalProps = AntModalProps;

/**
 * Modal из antd. Внутри компонента, открытого через show(), сам управляет
 * open/закрытием/удалением; вне show() работает как обычный antd Modal.
 */
export const Modal = ({ open, onCancel, afterClose, ...props }: ModalProps) => {
  const modal = useOptionalModal();
  if (!modal) {
    return <AntModal open={open} onCancel={onCancel} afterClose={afterClose} {...props} />;
  }
  return (
    <AntModal
      open={open ?? modal.visible}
      onCancel={(e) => {
        onCancel?.(e);
        modal.hide();
      }}
      afterClose={() => {
        afterClose?.();
        modal.remove();
      }}
      {...props}
    />
  );
};
