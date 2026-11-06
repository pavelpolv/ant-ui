import { Button, Flex, theme, Typography } from 'antd';
import { CheckCircleFilled, DeleteOutlined, LoadingOutlined } from '@ant-design/icons';
import { FileTypeIcon } from './FileTypeIcon';
import type { FileStatus, SelectedFile } from './types';

const SIZE_UNITS = ['Б', 'КБ', 'МБ', 'ГБ'];

export const formatSize = (bytes: number): string => {
  let value = bytes;
  let unit = 0;
  while (value >= 1024 && unit < SIZE_UNITS.length - 1) {
    value /= 1024;
    unit += 1;
  }
  return `${value.toLocaleString('ru-RU', { maximumFractionDigits: unit ? 1 : 0 })} ${SIZE_UNITS[unit]}`;
};

const STATUS_TEXT: Partial<Record<FileStatus, string>> = {
  uploading: 'Загружается…',
  done: 'Загружен',
  deleting: 'Удаляется…',
};

export interface FileCardProps {
  item: SelectedFile;
  disabled: boolean;
  onRemove?: () => void;
}

export const FileCard = ({ item, disabled, onRemove }: FileCardProps) => {
  const { token } = theme.useToken();
  const failed = item.status === 'error' || item.status === 'invalid';
  const status = failed ? `Ошибка: ${item.error}` : STATUS_TEXT[item.status];
  return (
    <Flex
      align="center"
      gap={12}
      style={{
        flexShrink: 0,
        padding: `${token.paddingXS}px ${token.paddingSM}px`,
        border: `1px solid ${failed ? token.colorErrorBorder : token.colorBorderSecondary}`,
        borderRadius: token.borderRadiusLG,
        background: failed ? token.colorErrorBg : token.colorBgContainer,
      }}
    >
      <FileTypeIcon name={item.file.name} />
      <Flex vertical style={{ flex: 1, minWidth: 0 }}>
        <Typography.Text ellipsis={{ tooltip: item.file.name }}>{item.file.name}</Typography.Text>
        <Typography.Text
          type={failed ? 'danger' : 'secondary'}
          ellipsis={{ tooltip: status }}
          style={{ fontSize: token.fontSizeSM }}
        >
          {formatSize(item.file.size)}{status && ` · ${status}`}
        </Typography.Text>
      </Flex>
      {(item.status === 'uploading' || item.status === 'deleting') && <LoadingOutlined style={{ color: token.colorPrimary }} />}
      {item.status === 'done' && !onRemove && <CheckCircleFilled style={{ color: token.colorSuccess }} />}
      {onRemove && (
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
