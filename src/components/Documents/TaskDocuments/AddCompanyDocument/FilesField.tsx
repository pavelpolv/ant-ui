import { Button, Empty, Flex, Form, Typography, Upload } from 'antd';
import { PaperClipOutlined } from '@ant-design/icons';
import { FileCard } from './FileCard';
import { ALLOWED_FILE_EXTENSIONS, MAX_FILE_SIZE_MB } from './fileValidation';
import type { SelectedFile } from './types';

// TODO: узнать ограничение количества файлов
const FILE_LIST_MAX_HEIGHT = 280;
const ACCEPT = ALLOWED_FILE_EXTENSIONS.map((extension) => `.${extension}`).join(',');

export interface FilesFieldProps {
  files: SelectedFile[];
  disabled: boolean;
  onAdd: (file: File & { uid: string }) => void;
  onRemove: (uid: string) => void;
}

export const FilesField = ({ files, disabled, onAdd, onRemove }: FilesFieldProps) => (
  <Form.Item label="Файлы" required>
    <Flex vertical gap={8}>
      <Flex align="center" gap={12}>
        <Upload
          multiple
          accept={ACCEPT}
          showUploadList={false}
          disabled={disabled}
          beforeUpload={(file) => {
            onAdd(file);
            return false;
          }}
        >
          <Button icon={<PaperClipOutlined />}>Выбрать файлы</Button>
        </Upload>
        <Typography.Text type="secondary">Можно выбрать несколько файлов, до {MAX_FILE_SIZE_MB} МБ каждый.</Typography.Text>
      </Flex>
      {files.length
        ? (
            <Flex vertical gap={8} style={{ maxHeight: FILE_LIST_MAX_HEIGHT, overflowY: 'auto' }}>
              {files.map((item) => (
                <FileCard key={item.uid} item={item} disabled={disabled} onRemove={() => onRemove(item.uid)} />
              ))}
            </Flex>
          )
        : <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="Файлы не выбраны" style={{ marginBlock: 8 }} />}
    </Flex>
  </Form.Item>
);
