import { App, Select, Tooltip } from 'antd';
import { FieldSkeleton, fieldLabel } from '../common/fields';
import { useFieldValues } from '../common/hooks';
import type { DocumentData, ValueField } from '../common/types';
import { useSaveField } from './api';

export interface FieldSelectProps {
  document: DocumentData;
  field: ValueField;
}

export const FieldSelect = ({ document, field }: FieldSelectProps) => {
  const { notification } = App.useApp();
  const mutation = useSaveField(document, field);
  const fieldValues = useFieldValues(document.docType);
  const items = fieldValues.data?.[field] ?? [];
  const renderLabel = (code: string) => (fieldValues.isLoading ? <FieldSkeleton /> : fieldLabel(field, code, items));
  const options = items.map(({ code }) => ({ value: code, label: fieldLabel(field, code, items) }));
  const error = mutation.isError
    ? `Ошибка сохранения: ${mutation.error.message}`
    : fieldValues.isError
      ? `Ошибка загрузки вариантов: ${fieldValues.error.message}`
      : undefined;
  return (
    <Tooltip title={error}>
      <Select
        size="small"
        style={{ width: '100%' }}
        value={document.versionData[field]}
        options={options}
        labelRender={({ value }) => renderLabel(String(value))}
        status={error ? 'error' : undefined}
        loading={mutation.isPending || fieldValues.isLoading}
        disabled={mutation.isPending || fieldValues.isLoading}
        onChange={(value) =>
          mutation.mutate(value, {
            onError: (saveError) =>
              notification.error({
                title: 'Не удалось сохранить изменения',
                description: `${document.versionData.docName}: ${saveError.message}`,
              }),
          })}
      />
    </Tooltip>
  );
};
