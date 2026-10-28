import { useEffect, useState, type ComponentType, type CSSProperties } from 'react';
import { isAxiosError } from 'axios';
import { Alert, App, Button, Empty, Flex, Form, Select, theme, Tooltip, Typography, Upload, type GlobalToken } from 'antd';
import {
  CheckCircleFilled,
  DeleteOutlined,
  FileAddOutlined,
  FileExcelOutlined,
  FileImageOutlined,
  FileOutlined,
  FilePdfOutlined,
  FileWordOutlined,
  FileZipOutlined,
  LoadingOutlined,
  PaperClipOutlined,
} from '@ant-design/icons';
import { Modal, useModal, useModals } from '@/components/modals';
import type { Counterparty } from '../common/types';
import { useAddDocument, useDocTypesDict } from './api';

type FileStatus = 'idle' | 'uploading' | 'done' | 'error';

interface SelectedFile {
  uid: string;
  file: File;
  status: FileStatus;
  error?: string;
}

const SIZE_UNITS = ['Б', 'КБ', 'МБ', 'ГБ'];

const formatSize = (bytes: number): string => {
  let value = bytes;
  let unit = 0;
  while (value >= 1024 && unit < SIZE_UNITS.length - 1) {
    value /= 1024;
    unit += 1;
  }
  return `${value.toLocaleString('ru-RU', { maximumFractionDigits: unit ? 1 : 0 })} ${SIZE_UNITS[unit]}`;
};

const FILE_ICONS: Record<string, [ComponentType<{ style?: CSSProperties }>, keyof GlobalToken]> = {
  pdf: [FilePdfOutlined, 'colorError'],
  doc: [FileWordOutlined, 'colorPrimary'],
  docx: [FileWordOutlined, 'colorPrimary'],
  rtf: [FileWordOutlined, 'colorPrimary'],
  xls: [FileExcelOutlined, 'colorSuccess'],
  xlsx: [FileExcelOutlined, 'colorSuccess'],
  csv: [FileExcelOutlined, 'colorSuccess'],
  jpg: [FileImageOutlined, 'colorWarning'],
  jpeg: [FileImageOutlined, 'colorWarning'],
  png: [FileImageOutlined, 'colorWarning'],
  tif: [FileImageOutlined, 'colorWarning'],
  tiff: [FileImageOutlined, 'colorWarning'],
  zip: [FileZipOutlined, 'colorTextSecondary'],
  rar: [FileZipOutlined, 'colorTextSecondary'],
  '7z': [FileZipOutlined, 'colorTextSecondary'],
};

const FileTypeIcon = ({ name }: { name: string }) => {
  const { token } = theme.useToken();
  const extension = name.includes('.') ? name.split('.').pop()!.toLowerCase() : '';
  const [Icon, color] = FILE_ICONS[extension] ?? [FileOutlined, 'colorTextSecondary'];
  return <Icon style={{ fontSize: 24, color: token[color] as string }} />;
};

const STATUS_TEXT: Partial<Record<FileStatus, string>> = {
  uploading: 'Загружается…',
  done: 'Загружен',
};

interface FileCardProps {
  item: SelectedFile;
  disabled: boolean;
  onRemove: () => void;
}

const FileCard = ({ item, disabled, onRemove }: FileCardProps) => {
  const { token } = theme.useToken();
  const status = item.status === 'error' ? `Ошибка: ${item.error}` : STATUS_TEXT[item.status];
  return (
    <Flex
      align="center"
      gap={12}
      style={{
        flexShrink: 0,
        padding: `${token.paddingXS}px ${token.paddingSM}px`,
        border: `1px solid ${item.status === 'error' ? token.colorErrorBorder : token.colorBorderSecondary}`,
        borderRadius: token.borderRadiusLG,
        background: item.status === 'error' ? token.colorErrorBg : token.colorBgContainer,
      }}
    >
      <FileTypeIcon name={item.file.name} />
      <Flex vertical style={{ flex: 1, minWidth: 0 }}>
        <Typography.Text ellipsis={{ tooltip: item.file.name }}>{item.file.name}</Typography.Text>
        <Typography.Text
          type={item.status === 'error' ? 'danger' : 'secondary'}
          ellipsis={{ tooltip: status }}
          style={{ fontSize: token.fontSizeSM }}
        >
          {formatSize(item.file.size)}{status && ` · ${status}`}
        </Typography.Text>
      </Flex>
      {item.status === 'uploading' && <LoadingOutlined style={{ color: token.colorPrimary }} />}
      {item.status === 'done' && <CheckCircleFilled style={{ color: token.colorSuccess }} />}
      {(item.status === 'idle' || item.status === 'error') && (
        <Button
          size="small"
          type="text"
          icon={<DeleteOutlined />}
          aria-label="Удалить файл"
          disabled={disabled}
          onClick={onRemove}
        />
      )}
    </Flex>
  );
};

// TODO: узнать ограничения количества, размера и типов файлов
const FILE_LIST_MAX_HEIGHT = 280;
const DOC_TYPES_ERROR_KEY = 'docTypesDict-error';
const DOC_TYPES_ERROR_TITLE = 'Не удалось загрузить виды документов';

// TODO: формат ответа бэкенда с ошибкой не описан — текст берётся из message
const describeError = (error: Error): string => {
  if (!isAxiosError<{ message?: string }>(error) || !error.response) return error.message;
  const { status, data } = error.response;
  return `${data?.message || error.message}. Код ошибки: ${status}`;
};

interface AddCompanyDocumentModalProps {
  entityId: string;
  counterparty: Counterparty;
}

const AddCompanyDocumentModal = ({ entityId, counterparty }: AddCompanyDocumentModalProps) => {
  const modal = useModal();
  const { notification } = App.useApp();
  const docTypes = useDocTypesDict();
  const mutation = useAddDocument();
  const [docTypeId, setDocTypeId] = useState<string>();
  const [versionId, setVersionId] = useState<string>();
  const [files, setFiles] = useState<SelectedFile[]>([]);

  // TODO: multipleInList не учитывается — уже добавленные виды не скрываются, уточнить поведение
  const options = (docTypes.data ?? []).map(({ id, codeEkd, shortName, fullName }) => ({
    value: id,
    label: `${codeEkd} · ${shortName}`,
    title: fullName,
    codeEkd,
    shortName,
    fullName,
  }));
  const docTypeName = docTypes.data?.find(({ id }) => id === docTypeId)?.shortName ?? '';
  const pendingFiles = files.filter(({ status }) => status !== 'done');
  const listError = docTypes.isError ? `${DOC_TYPES_ERROR_TITLE}: ${docTypes.error.message}` : undefined;
  const { isError: docTypesFailed, isFetching: docTypesFetching, error: docTypesError, errorUpdatedAt } = docTypes;

  useEffect(() => {
    if (!docTypesFailed || docTypesFetching) return;
    notification.error({ key: DOC_TYPES_ERROR_KEY, title: DOC_TYPES_ERROR_TITLE, description: docTypesError?.message });
  }, [docTypesFailed, docTypesFetching, docTypesError, errorUpdatedAt, notification]);

  const addFile = (file: File & { uid: string }) =>
    setFiles((prev) => [...prev, { uid: file.uid, file, status: 'idle' }]);
  const removeFile = (uid: string) => setFiles((prev) => prev.filter((item) => item.uid !== uid));

  const handleOk = () => {
    if (!docTypeId) return;
    const uploading = new Set(pendingFiles.map(({ uid }) => uid));
    setFiles((prev) => prev.map((item) =>
      uploading.has(item.uid) ? { ...item, status: 'uploading', error: undefined } : item));
    mutation.mutate(
      {
        request: { ...counterparty, entityId, docTypeId },
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
        onError: (error) => {
          setFiles((prev) => prev.map((item) => (uploading.has(item.uid) ? { ...item, status: 'idle' } : item)));
          notification.error({
            title: 'Не удалось добавить документ',
            description: `${docTypeName}: ${error.message}`,
          });
        },
      },
    );
  };

  return (
    <Modal
      title="Добавить документ"
      okText="Добавить"
      cancelText="Отмена"
      okButtonProps={{ disabled: !docTypeId || !pendingFiles.length }}
      confirmLoading={mutation.isPending}
      onOk={handleOk}
      width={640}
    >
      <Form layout="vertical" requiredMark>
        <Form.Item label="Контрагент">
          <Typography.Text>{counterparty.counterpartyName}</Typography.Text>
        </Form.Item>
        <Form.Item
          label="Вид документа"
          required
          validateStatus={listError ? 'error' : undefined}
          help={listError && (
            <>
              {listError}{' '}
              <Typography.Link disabled={docTypesFetching} onClick={() => docTypes.refetch()}>
                Повторить
              </Typography.Link>
            </>
          )}
        >
          <Select
            value={docTypeId}
            options={options}
            placeholder="Введите код или наименование"
            showSearch={{ optionFilterProp: ['codeEkd', 'shortName', 'fullName'] }}
            loading={docTypesFetching && !docTypes.data}
            notFoundContent={listError && <Typography.Text type="danger">{listError}</Typography.Text>}
            disabled={Boolean(versionId) || mutation.isPending}
            onChange={setDocTypeId}
          />
        </Form.Item>
        <Form.Item label="Файлы" required>
          <Flex vertical gap={8}>
            <Flex align="center" gap={12}>
              <Upload
                multiple
                showUploadList={false}
                disabled={mutation.isPending}
                beforeUpload={(file) => {
                  addFile(file);
                  return false;
                }}
              >
                <Button icon={<PaperClipOutlined />}>Выбрать файлы</Button>
              </Upload>
              <Typography.Text type="secondary">Можно выбрать несколько файлов.</Typography.Text>
            </Flex>
            {files.length
              ? (
                  <Flex vertical gap={8} style={{ maxHeight: FILE_LIST_MAX_HEIGHT, overflowY: 'auto' }}>
                    {files.map((item) => (
                      <FileCard
                        key={item.uid}
                        item={item}
                        disabled={mutation.isPending}
                        onRemove={() => removeFile(item.uid)}
                      />
                    ))}
                  </Flex>
                )
              : <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="Файлы не выбраны" style={{ marginBlock: 8 }} />}
          </Flex>
        </Form.Item>
      </Form>
      {mutation.isError && (
        <Alert type="error" showIcon title="Не удалось добавить документ" description={describeError(mutation.error)} />
      )}
    </Modal>
  );
};

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
