import type { ReactNode } from 'react';
import type { ValueField } from '../common/types';

export interface EditableColumn {
  field: ValueField;
  title: ReactNode;
  width: number;
}

export const EDITABLE_COLUMNS: EditableColumn[] = [
  { field: 'assuranceLevel', title: 'Вид заверения', width: 280 },
  { field: 'provisionForm', title: <>Форма<br />предоставления</>, width: 170 },
  { field: 'signType', title: <>Способ<br />подписания</>, width: 200 },
];

export const STATUS_COLORS: Record<string, string> = {
  NewDoc: 'blue',
  InProgress: 'gold',
  InApprove: 'purple',
  Actual: 'green',
};

export const SCROLL_X = 1450;
