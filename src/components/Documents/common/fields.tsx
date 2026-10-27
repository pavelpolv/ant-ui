import type { ReactNode } from 'react';
import { Skeleton } from 'antd';
import {
  AuditOutlined,
  CloudOutlined,
  CopyOutlined,
  DisconnectOutlined,
  EditOutlined,
  FileOutlined,
  FileProtectOutlined,
  InboxOutlined,
  PrinterOutlined,
  SafetyCertificateOutlined,
  SnippetsOutlined,
  StopOutlined,
} from '@ant-design/icons';
import { withIcon } from './cells';
import { useFieldValues } from './hooks';
import type { DictItem, ValueField } from './types';

const FIELD_ICONS: Record<ValueField, Record<string, ReactNode>> = {
  assuranceLevel: {
    ORIGINAL: <FileProtectOutlined />,
    COPY_NOTARY: <AuditOutlined />,
    COPY_AUTHOR: <CopyOutlined />,
    COPY_CLEAN: <SnippetsOutlined />,
  },
  provisionForm: {
    ORIGINAL: <FileProtectOutlined />,
    // TODO: этих кодов нет в ответе бэкенда /docTypeDict — придуманы, сверить с бэкендом
    PAPER: <PrinterOutlined />,
    ELECTRONIC: <CloudOutlined />,
  },
  // TODO: в ответе бэкенда /docTypeDict коды пустые — придуманы, сверить с бэкендом
  signType: {
    EMBEDDED: <SafetyCertificateOutlined />,
    DETACHED: <DisconnectOutlined />,
    ABSENT: <StopOutlined />,
  },
};

const DEFAULT_ICONS: Record<ValueField, ReactNode> = {
  assuranceLevel: <FileOutlined />,
  provisionForm: <InboxOutlined />,
  signType: <EditOutlined />,
};

export const fieldLabel = (field: ValueField, code: string, items: DictItem[] = []): ReactNode => {
  if (!code) return null;
  const label = items.find((item) => item.code === code)?.value ?? code;
  return withIcon(label, FIELD_ICONS[field][code] ?? DEFAULT_ICONS[field]);
};

export const FieldSkeleton = () => (
  <Skeleton.Input active size="small" style={{ width: 120, minWidth: 0, height: 14, verticalAlign: 'middle' }} />
);

export interface FieldValueProps {
  docType: string;
  field: ValueField;
  code: string;
}

export const FieldValue = ({ docType, field, code }: FieldValueProps) => {
  const { data, isLoading } = useFieldValues(docType);
  if (code && isLoading) return <FieldSkeleton />;
  return fieldLabel(field, code, data?.[field]);
};
