import type { ComponentType, CSSProperties } from 'react';
import { theme, type GlobalToken } from 'antd';
import {
  FileExcelOutlined,
  FileImageOutlined,
  FileOutlined,
  FilePdfOutlined,
  FileWordOutlined,
  FileZipOutlined,
} from '@ant-design/icons';

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

export const FileTypeIcon = ({ name }: { name: string }) => {
  const { token } = theme.useToken();
  const extension = name.includes('.') ? name.split('.').pop()!.toLowerCase() : '';
  const [Icon, color] = FILE_ICONS[extension] ?? [FileOutlined, 'colorTextSecondary'];
  return <Icon style={{ fontSize: 24, color: token[color] as string }} />;
};
