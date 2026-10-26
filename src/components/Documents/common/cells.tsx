import type { ReactNode } from 'react';
import { Flex, Popover, Space, Tag, theme, Tooltip, Typography } from 'antd';
import { FileTextOutlined, FolderFilled, PaperClipOutlined } from '@ant-design/icons';
import { useModals } from '@/components/modals';
import { DocumentModal } from './DocumentModal';
import { useDownloadFile } from './hooks';
import type { FileInfo } from './types';

export const FolderIcon = () => {
  const { token } = theme.useToken();
  return <FolderFilled style={{ color: token.colorWarning }} />;
};

export const TREE_INDENT = 15;
const EXPAND_ICON_SPACE = 25;

export interface DocumentTitleProps {
  name: string;
  version: number;
  level: number;
}

export const DocumentTitle = ({ name, version, level }: DocumentTitleProps) => {
  const modals = useModals();
  const { token } = theme.useToken();
  return (
    <Flex
      component="span"
      align="center"
      gap={6}
      style={{ display: 'inline-flex', verticalAlign: 'middle', maxWidth: `calc(100% - ${level * TREE_INDENT + EXPAND_ICON_SPACE}px)` }}
    >
      <FileTextOutlined style={{ color: token.colorPrimary }} />
      <Tooltip title={name}>
        <Typography.Link ellipsis style={{ minWidth: 0 }} onClick={() => modals.show(DocumentModal, { title: name })}>
          {name}
        </Typography.Link>
      </Tooltip>
      <Tag variant="filled" style={{ marginInlineEnd: 0 }}>v.{version}</Tag>
    </Flex>
  );
};

export const formatDate = (value: string): string => {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString('ru-RU');
};

export const withIcon = (text: string, icon: ReactNode) =>
  icon ? <Space size={6} style={{ whiteSpace: 'nowrap' }}>{icon}{text}</Space> : text;

interface FileItemProps {
  file: FileInfo;
  download: (file: FileInfo) => Promise<void>;
}

const FileItem = ({ file, download }: FileItemProps) => {
  const mutation = useDownloadFile(file, download);
  return (
    <div>
      <Tooltip title={mutation.isError ? `Ошибка скачивания: ${mutation.error.message}` : file.name}>
        <Typography.Link
          style={{ display: 'block' }}
          ellipsis
          type={mutation.isError ? 'danger' : undefined}
          disabled={mutation.isPending}
          onClick={() => mutation.mutate()}
        >
          <PaperClipOutlined /> {file.name}
        </Typography.Link>
      </Tooltip>
      <Typography.Text type="secondary" style={{ fontSize: 12 }}>
        {formatDate(file.createdAt)} · {file.createdBy}
      </Typography.Text>
    </div>
  );
};

const VISIBLE_FILES = 2;

export interface FileListProps {
  files: FileInfo[];
  download: (file: FileInfo) => Promise<void>;
}

export const FileList = ({ files, download }: FileListProps) => {
  if (!files.length) return <Typography.Text type="secondary">Нет файлов</Typography.Text>;
  const items = (list: FileInfo[]) =>
    list.map((file) => <FileItem key={file.id} file={file} download={download} />);
  const hidden = files.slice(VISIBLE_FILES);
  return (
    <Flex vertical gap={4}>
      {items(files.slice(0, VISIBLE_FILES))}
      {hidden.length > 0 && (
        <Popover content={<Flex vertical gap={4} style={{ maxWidth: 400 }}>{items(hidden)}</Flex>}>
          <Typography.Link style={{ alignSelf: 'flex-start' }}>ещё {hidden.length}</Typography.Link>
        </Popover>
      )}
    </Flex>
  );
};
