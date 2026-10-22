import type { ReactNode } from 'react';
import {
  AuditOutlined,
  CloudOutlined,
  CopyOutlined,
  FileProtectOutlined,
  PrinterOutlined,
  SafetyCertificateOutlined,
  SignatureOutlined,
} from '@ant-design/icons';
import type { ValueField } from './types';

export interface FieldValue {
  label: string;
  icon: ReactNode;
}

// TODO: коды значений предположительные — сверить со справочниками бэкенда
export const FIELD_VALUES: Record<ValueField, Record<string, FieldValue>> = {
  assuranceLevel: {
    ORIGINAL: { label: 'Оригинал', icon: <FileProtectOutlined /> },
    NOTARIAL_COPY: { label: 'Нотариальная копия', icon: <AuditOutlined /> },
    CLIENT_CERTIFIED_COPY: { label: 'Копия, заверенная клиентом', icon: <CopyOutlined /> },
  },
  provisionForm: {
    PAPER: { label: 'Бумажная', icon: <PrinterOutlined /> },
    ELECTRONIC: { label: 'Электронная', icon: <CloudOutlined /> },
  },
  signType: {
    ELECTRONIC_SIGNATURE: { label: 'ЭП', icon: <SafetyCertificateOutlined /> },
    HANDWRITTEN: { label: 'Собственноручная', icon: <SignatureOutlined /> },
  },
};

export interface ValueColumn {
  key: string;
  title: ReactNode;
  fields: ValueField[];
  width: number;
}

export const VALUE_COLUMNS: ValueColumn[] = [
  {
    key: 'assurance-provision',
    title: <>Вид заверения<br />Форма предоставления</>,
    fields: ['assuranceLevel', 'provisionForm'],
    width: 240,
  },
  {
    key: 'signType',
    title: <>Способ<br />подписания</>,
    fields: ['signType'],
    width: 200,
  },
];

// TODO: коды статусов предположительные — сверить с бэкендом
export const STATUS_COLORS: Record<string, string> = { ACTIVE: 'green', ON_REVIEW: 'gold' };
