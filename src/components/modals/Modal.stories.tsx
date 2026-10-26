import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from '@/components/Button';
import { useModal, useModals } from './createModalManager';
import { Modal } from './Modal';
import { Drawer } from './Drawer';

const ConfirmModal = ({ text }: { text: string }) => {
  const modal = useModal<boolean>();
  return (
    <Modal
      title="Подтверждение"
      onOk={() => {
        modal.resolve(true);
        modal.hide();
      }}
      onCancel={() => modal.resolve(false)}
    >
      {text}
    </Modal>
  );
};

const InfoDrawer = () => (
  <Drawer title="Информация">Содержимое дровера</Drawer>
);

const Demo = () => {
  const modals = useModals();
  const [result, setResult] = useState<string>('—');
  return (
    <>
      <Button
        type="primary"
        onClick={async () => {
          const ok = await modals.show<typeof ConfirmModal, boolean>(ConfirmModal, { text: 'Удалить запись?' });
          setResult(ok ? 'подтверждено' : 'отменено');
        }}
      >
        Открыть модалку
      </Button>{' '}
      <Button onClick={() => modals.show(InfoDrawer)}>Открыть дровер</Button>
      <p>Результат: {result}</p>
    </>
  );
};

const meta = {
  title: 'Modals/ModalManager',
  component: Demo,
} satisfies Meta<typeof Demo>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
