import { useState } from 'react';
import type { UseMutationResult } from '@tanstack/react-query';
import { Alert, App, Button, Checkbox, Col, ConfigProvider, DatePicker, Flex, Form, Input, Row, Select, Space, Tag, theme, Typography, Upload } from 'antd';
import { PaperClipOutlined } from '@ant-design/icons';
import { Modal, useModal } from '@/components/modals';
import { StatusTag } from '../cells';
import { describeError } from '../describeError';
import { fieldLabel } from '../fields';
import { ALLOWED_FILE_EXTENSIONS, FileCard, MAX_FILE_SIZE_MB, type SelectedFile, validateFile } from '../files';
import { useFieldValues, useInitiatorChannels } from '../hooks';
import type { DocumentData, DocumentFields, FileInfo, ValueField } from '../types';
import { DocumentFileRow } from './DocumentFileRow';
import { changedFields, dateValueProps, normalizeDate, normalizeSelect, pickFields, selectValueProps } from './formValues';

export interface DocumentEditing {
  save: UseMutationResult<void, Error, Partial<DocumentFields>>;
  uploadFile: (file: File) => Promise<string>;
  deleteFile: (fileId: string) => Promise<void>;
}

export interface DocumentModalProps {
  document: DocumentData;
  download: (file: FileInfo) => Promise<void>;
  editing?: DocumentEditing;
}

const ACCEPT = ALLOWED_FILE_EXTENSIONS.map((extension) => `.${extension}`).join(',');

const COMPACT_FORM = { components: { Form: { itemMarginBottom: 12, verticalLabelPadding: '0 0 2px' } } };

const DATE_PICKER = { style: { width: '100%' }, format: 'DD.MM.YYYY' };

const DATE_ITEM = { getValueProps: dateValueProps, normalize: normalizeDate };

const SELECT_ITEM = { getValueProps: selectValueProps, normalize: normalizeSelect };

const VALUE_FIELDS: { field: ValueField; label: string }[] = [
  { field: 'assuranceLevel', label: 'Вид заверения' },
  { field: 'provisionForm', label: 'Форма предоставления' },
  { field: 'signType', label: 'Способ подписания' },
];

export const DocumentModal = ({ document, download, editing }: DocumentModalProps) => {
  const modal = useModal();
  const { token } = theme.useToken();
  const [form] = Form.useForm<DocumentFields>();
  const { notification } = App.useApp();
  const fieldValues = useFieldValues(document.docType);
  const initiatorChannels = useInitiatorChannels(document.docType);
  const [base] = useState(() => pickFields(document.versionData));
  const [changes, setChanges] = useState<Partial<DocumentFields>>({});
  const [files, setFiles] = useState<SelectedFile[]>([]);

  const readonly = !editing;
  const pending = Boolean(editing?.save.isPending);
  const { docName, version } = document.versionData;
  const filesBusy = files.some(({ status }) => status === 'uploading' || status === 'deleting');
  const formTheme = readonly ? { ...COMPACT_FORM, token: { colorTextDisabled: token.colorText } } : COMPACT_FORM;

  const patchFile = (uid: string, patch: Partial<SelectedFile>) =>
    setFiles((prev) => prev.map((item) => (item.uid === uid ? { ...item, ...patch } : item)));
  const dropFile = (uid: string) => setFiles((prev) => prev.filter((item) => item.uid !== uid));

  const addFile = (file: File & { uid: string }) => {
    if (!editing) return;
    const error = validateFile(file);
    setFiles((prev) => [...prev, { uid: file.uid, file, status: error ? 'invalid' : 'uploading', error }]);
    if (error) return;
    editing.uploadFile(file).then(
      (fileId) => patchFile(file.uid, { status: 'done', fileId }),
      (uploadError: Error) => patchFile(file.uid, { status: 'error', error: uploadError.message }),
    );
  };

  const removeFile = ({ uid, file, fileId, status }: SelectedFile) => {
    if (!editing || status !== 'done' || !fileId) {
      dropFile(uid);
      return;
    }
    patchFile(uid, { status: 'deleting' });
    editing.deleteFile(fileId).then(
      () => dropFile(uid),
      (deleteError: Error) => {
        patchFile(uid, { status: 'done' });
        notification.error({ title: 'Не удалось удалить файл', description: `${file.name}: ${describeError(deleteError)}` });
      },
    );
  };

  const handleOk = async () => {
    if (!editing) return;
    try {
      await form.validateFields();
    } catch {
      return;
    }
    if (!Object.keys(changes).length) {
      modal.hide();
      return;
    }
    editing.save.mutate(changes, {
      onSuccess: () => {
        notification.success({ title: 'Документ сохранён', description: docName });
        modal.hide();
      },
    });
  };

  const valueOptions = (field: ValueField) => {
    const items = fieldValues.data?.[field] ?? [];
    return items.map(({ code }) => ({ value: code, label: fieldLabel(field, code, items) }));
  };

  return (
    <Modal
      centered
      width={860}
      styles={{ body: { maxHeight: 'calc(100vh - 160px)', overflowY: 'auto', marginInline: -24, paddingInline: 24 } }}
      title={(
        <Space size={8}>
          {docName}
          <Tag variant="filled">v.{version}</Tag>
          <StatusTag versionData={document.versionData} />
        </Space>
      )}
      okText="ОК"
      cancelText="Отмена"
      okButtonProps={{ disabled: filesBusy }}
      confirmLoading={pending}
      onOk={handleOk}
      footer={readonly ? <Button onClick={modal.hide}>Закрыть</Button> : undefined}
    >
      <ConfigProvider theme={formTheme}>
        <Form
          form={form}
          layout="vertical"
          requiredMark={!readonly}
          disabled={readonly || pending}
          initialValues={base}
          onValuesChange={(_, values: DocumentFields) => setChanges(changedFields(base, values))}
          style={{ marginTop: 12 }}
        >
          <Row gutter={12}>
            <Col span={16}>
              <Form.Item name="docName" label="Наименование" rules={[{ required: true, whitespace: true, message: 'Укажите наименование' }]}>
                <Input maxLength={512} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="docNumber" label="Номер">
                <Input maxLength={255} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="docDate" label="Дата" {...DATE_ITEM}>
                <DatePicker {...DATE_PICKER} />
              </Form.Item>
            </Col>
            <Col span={8}>
              {/* TODO: тип validityPeriod не известен — сейчас дата */}
              <Form.Item name="validityPeriod" label="Срок действия" {...DATE_ITEM}>
                <DatePicker {...DATE_PICKER} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="initiatorChannel" label="Канал получения" {...SELECT_ITEM}>
                <Select
                  loading={initiatorChannels.isLoading}
                  status={initiatorChannels.isError ? 'error' : undefined}
                  options={initiatorChannels.data?.map(({ code, value }) => ({ value: code, label: value }))}
                />
              </Form.Item>
            </Col>
            {VALUE_FIELDS.map(({ field, label }) => (
              <Col key={field} span={8}>
                <Form.Item name={field} label={label} {...SELECT_ITEM}>
                  <Select
                    loading={fieldValues.isLoading}
                    status={fieldValues.isError ? 'error' : undefined}
                    options={valueOptions(field)}
                  />
                </Form.Item>
              </Col>
            ))}
            <Col span={8}>
              <Form.Item name="submittingOriginalDeadline" label="Срок предоставления оригинала" {...DATE_ITEM}>
                <DatePicker {...DATE_PICKER} />
              </Form.Item>
            </Col>
            <Col span={16}>
              <Form.Item name="storageLocation" label="Место хранения">
                <Input maxLength={255} />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Flex gap={24} wrap>
                <Form.Item name="usingCopy" valuePropName="checked">
                  <Checkbox>Можно использовать копию до получения оригинала</Checkbox>
                </Form.Item>
                <Form.Item name="suspensiveProvision" valuePropName="checked">
                  <Checkbox>Возможно отлагательное предоставление</Checkbox>
                </Form.Item>
              </Flex>
            </Col>
            <Col span={24}>
              <Form.Item name="comment" label="Комментарий">
                <Input.TextArea autoSize={{ minRows: 3, maxRows: 6 }} maxLength={512} />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item label="Файлы">
            <Flex vertical gap={8}>
              {!readonly && (
                <Flex align="center" gap={12}>
                  <Upload
                    multiple
                    accept={ACCEPT}
                    showUploadList={false}
                    beforeUpload={(file) => {
                      addFile(file);
                      return false;
                    }}
                  >
                    <Button icon={<PaperClipOutlined />}>Выбрать файлы</Button>
                  </Upload>
                  <Typography.Text type="secondary">Можно выбрать несколько файлов, до {MAX_FILE_SIZE_MB} МБ каждый.</Typography.Text>
                </Flex>
              )}
              {document.versionData.files.length || files.length
                ? (
                    <Flex vertical gap={6}>
                      {document.versionData.files.map((file) => (
                        <DocumentFileRow key={file.nkpFileId} file={file} download={download} />
                      ))}
                      {files.map((item) => (
                        <FileCard
                          key={item.uid}
                          item={item}
                          disabled={pending}
                          onRemove={item.status === 'uploading' || item.status === 'deleting' ? undefined : () => removeFile(item)}
                        />
                      ))}
                    </Flex>
                  )
                : <Typography.Text type="secondary">Нет файлов</Typography.Text>}
            </Flex>
          </Form.Item>
        </Form>
      </ConfigProvider>
      {editing?.save.isError && (
        <Alert type="error" showIcon title="Не удалось сохранить документ" description={describeError(editing.save.error)} />
      )}
    </Modal>
  );
};
