import type { ReactNode } from 'react';
import type { ValueField } from '../common/types';

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

export const STATUS_COLORS: Record<string, string> = {
  NewDoc: 'blue',
  InProgress: 'gold',
  InApprove: 'purple',
  Actual: 'green',
};
