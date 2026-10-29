import { useState } from 'react';
import { Alert, App, Form, Typography } from 'antd';
import { Modal, useModal } from '@/components/modals';
import type { Counterparty } from '../../common/types';
import { useAddDocument, type DocTypesDictItem } from '../api';
import { describeError } from '../describeError';
import { DocTypeField } from './DocTypeField';
import { FilesField } from './FilesField';
import type { SelectedFile } from './types';

export interface AddCompanyDocumentModalProps {
  entityId: string;
  counterparty: Counterparty;
}

export const AddCompanyDocumentModal = ({ entityId, counterparty }: AddCompanyDocumentModalProps) => {
  const modal = useModal();
  const { notification } = App.useApp();
  const mutation = useAddDocument();
  const [docType, setDocType] = useState<DocTypesDictItem>();
  const [versionId, setVersionId] = useState<string>();
  const [files, setFiles] = useState<SelectedFile[]>([]);

  const docTypeName = docType?.shortName ?? '';
  const pendingFiles = files.filter(({ status }) => status !== 'done');

  const addFile = (file: File & { uid: string }) =>
    setFiles((prev) => [...prev, { uid: file.uid, file, status: 'idle' }]);
  const removeFile = (uid: string) => setFiles((prev) => prev.filter((item) => item.uid !== uid));

  const handleOk = () => {
    if (!docType) return;
    const uploading = new Set(pendingFiles.map(({ uid }) => uid));
    setFiles((prev) => prev.map((item) =>
      uploading.has(item.uid) ? { ...item, status: 'uploading', error: undefined } : item));
    mutation.mutate(
      {
        request: { ...counterparty, entityId, docTypeId: docType.id },
        versionId,
        files: pendingFiles.map(({ uid, file }) => ({ uid, file })),
      },
      {
        onSuccess: (result) => {
          setVersionId(result.versionId);
          setFiles((prev) => prev.map((item) => {
            if (!uploading.has(item.uid)) return item;
            const error = result.failed.get(item.uid);
            return error ? { ...item, status: 'error', error: error.message } : { ...item, status: 'done' };
          }));
          if (result.failed.size) {
            notification.error({
              title: 'Не все файлы загружены',
              description: `${docTypeName}: не загружено ${result.failed.size} из ${uploading.size}`,
            });
            return;
          }
          notification.success({ title: 'Документ добавлен', description: docTypeName });
          modal.hide();
        },
        onError: () =>
          setFiles((prev) => prev.map((item) => (uploading.has(item.uid) ? { ...item, status: 'idle' } : item))),
      },
    );
  };

  return (
    <Modal
      title="Добавить документ"
      okText="Добавить"
      cancelText="Отмена"
      okButtonProps={{ disabled: !docType || !pendingFiles.length }}
      confirmLoading={mutation.isPending}
      onOk={handleOk}
      width={640}
    >
      <Form layout="vertical" requiredMark>
        <Form.Item label="Контрагент">
          <Typography.Text>{counterparty.counterpartyName}</Typography.Text>
        </Form.Item>
        <DocTypeField
          value={docType?.id}
          disabled={Boolean(versionId) || mutation.isPending}
          onChange={setDocType}
        />
        <FilesField files={files} disabled={mutation.isPending} onAdd={addFile} onRemove={removeFile} />
      </Form>
      {mutation.isError && (
        <Alert type="error" showIcon title="Не удалось добавить документ" description={describeError(mutation.error)} />
      )}
    </Modal>
  );
};
