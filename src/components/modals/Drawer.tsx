import { Drawer as AntDrawer, type DrawerProps as AntDrawerProps } from 'antd';
import { useOptionalModal } from './createModalManager';

export type DrawerProps = AntDrawerProps;

/**
 * Drawer из antd. Внутри компонента, открытого через show(), сам управляет
 * open/закрытием/удалением; вне show() работает как обычный antd Drawer.
 */
export const Drawer = ({ open, onClose, afterOpenChange, ...props }: DrawerProps) => {
  const modal = useOptionalModal();
  if (!modal) {
    return <AntDrawer open={open} onClose={onClose} afterOpenChange={afterOpenChange} {...props} />;
  }
  return (
    <AntDrawer
      open={open ?? modal.visible}
      onClose={(e) => {
        onClose?.(e);
        modal.hide();
      }}
      afterOpenChange={(isOpen) => {
        afterOpenChange?.(isOpen);
        if (!isOpen) modal.remove();
      }}
      {...props}
    />
  );
};
