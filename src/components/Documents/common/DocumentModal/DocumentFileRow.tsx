import { App, Flex, theme, Tooltip, Typography } from 'antd';
import { formatDate } from '../cells';
import { FileTypeIcon, formatSize } from '../files';
import { useDownloadFile } from '../hooks';
import type { DocFile, FileInfo } from '../types';

const toFileInfo = (file: DocFile): FileInfo => ({
  id: file.nkpFileId,
  name: file.fileName,
  createdAt: file.nkpCreateAt,
  createdBy: file.nkpCreatedBy,
});

export interface DocumentFileRowProps {
  file: DocFile;
  download: (file: FileInfo) => Promise<void>;
}

export const DocumentFileRow = ({ file, download }: DocumentFileRowProps) => {
  const { token } = theme.useToken();
  const { notification } = App.useApp();
  const mutation = useDownloadFile(toFileInfo(file), download);
  return (
    <Flex
      align="center"
      gap={12}
      style={{
        flexShrink: 0,
        padding: `${token.paddingXXS}px ${token.paddingSM}px`,
        border: `1px solid ${mutation.isError ? token.colorErrorBorder : token.colorBorderSecondary}`,
        borderRadius: token.borderRadiusLG,
      }}
    >
      <FileTypeIcon name={file.fileName} />
      <Flex vertical style={{ flex: 1, minWidth: 0 }}>
        <Tooltip title={mutation.isError ? `Ошибка скачивания: ${mutation.error.message}` : file.fileName}>
          <Typography.Link
            ellipsis
            type={mutation.isError ? 'danger' : undefined}
            disabled={mutation.isPending}
            onClick={() =>
              mutation.mutate(undefined, {
                onError: (error) =>
                  notification.error({ title: 'Не удалось скачать файл', description: `${file.fileName}: ${error.message}` }),
              })}
          >
            {file.fileName}
          </Typography.Link>
        </Tooltip>
        <Typography.Text type="secondary" style={{ fontSize: token.fontSizeSM }}>
          {formatSize(file.size)} · {formatDate(file.nkpCreateAt)} · {file.nkpCreatedBy}
        </Typography.Text>
      </Flex>
    </Flex>
  );
};
