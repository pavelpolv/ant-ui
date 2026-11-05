import { useState } from 'react';
import { Alert, App, Form, Typography } from 'antd';
import { Modal, useModal } from '@/components/modals';
import type { Counterparty } from '../../common/types';
import { useAddDocument } from '../api';
import { describeError } from '../describeError';
import { DocTypeField } from './DocTypeField';
import { FilesField } from './FilesField';
import { validateFile } from './fileValidation';
import type { PresetDocType, SelectedFile } from './types';

export interface AddCompanyDocumentModalProps {
  entityId: string;
  counterparty: Counterparty;
  presetDocType?: PresetDocType;
}

export const AddCompanyDocumentModal = ({ entityId, counterparty, presetDocType }: AddCompanyDocumentModalProps) => {
  const modal = useModal();
  const { notification } = App.useApp();
  const mutation = useAddDocument();
  const [docType, setDocType] = useState<PresetDocType | undefined>(presetDocType);
  const [versionId, setVersionId] = useState<string>();
  const [files, setFiles] = useState<SelectedFile[]>([]);

  const docTypeName = docType?.shortName ?? '';
  const pendingFiles = files.filter(({ status }) => status !== 'done' && status !== 'invalid');
  const hasInvalidFiles = files.some(({ status }) => status === 'invalid');

  const addFile = (file: File & { uid: string }) => {
    const error = validateFile(file);
    setFiles((prev) => [...prev, { uid: file.uid, file, status: error ? 'invalid' : 'idle', error }]);
  };
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
      okButtonProps={{ disabled: !docType || !pendingFiles.length || hasInvalidFiles }}
      confirmLoading={mutation.isPending}
      onOk={handleOk}
      width={640}
    >
      <Form layout="vertical" requiredMark>
        <Form.Item style={{ marginTop: 16 }}>
          <Typography.Text type="secondary">Контрагент:</Typography.Text>{' '}
          <Typography.Text strong>{counterparty.counterpartyName}</Typography.Text>
        </Form.Item>
        <DocTypeField
          value={docType?.id}
          disabled={Boolean(presetDocType) || Boolean(versionId) || mutation.isPending}
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
