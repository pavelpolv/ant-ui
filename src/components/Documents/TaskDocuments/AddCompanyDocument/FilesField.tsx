import { Button, Empty, Flex, Form, Typography, Upload } from 'antd';
import { PaperClipOutlined } from '@ant-design/icons';
import { FileCard } from './FileCard';
import type { SelectedFile } from './types';

// TODO: узнать ограничения количества, размера и типов файлов
const FILE_LIST_MAX_HEIGHT = 280;

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
          showUploadList={false}
          disabled={disabled}
          beforeUpload={(file) => {
            onAdd(file);
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
                <FileCard key={item.uid} item={item} disabled={disabled} onRemove={() => onRemove(item.uid)} />
              ))}
            </Flex>
          )
        : <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="Файлы не выбраны" style={{ marginBlock: 8 }} />}
    </Flex>
  </Form.Item>
);
