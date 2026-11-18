import { useEffect } from 'react';
import { App, Form, Select, Typography } from 'antd';
import { useDocTypesDict, type DocTypesDictItem } from '../api';

const DOC_TYPES_ERROR_KEY = 'docTypesDict-error';
const DOC_TYPES_ERROR_TITLE = 'Не удалось загрузить виды документов';

export interface DocTypeFieldProps {
  value?: string;
  disabled: boolean;
  onChange: (docType: DocTypesDictItem) => void;
}

export const DocTypeField = ({ value, disabled, onChange }: DocTypeFieldProps) => {
  const { notification } = App.useApp();
  const docTypes = useDocTypesDict();
  const { data, isError, isFetching, error, errorUpdatedAt } = docTypes;
  const listError = isError ? `${DOC_TYPES_ERROR_TITLE}: ${error.message}` : undefined;

  useEffect(() => {
    if (!isError || isFetching) return;
    notification.error({ key: DOC_TYPES_ERROR_KEY, title: DOC_TYPES_ERROR_TITLE, description: error?.message });
  }, [isError, isFetching, error, errorUpdatedAt, notification]);

  // TODO: multipleInList не учитывается — уже добавленные виды не скрываются, уточнить поведение
  const options = (data ?? []).map(({ id, codeEkd, shortName, fullName }) => ({
    value: id,
    label: `${codeEkd} · ${shortName}`,
    title: fullName,
    codeEkd,
    shortName,
    fullName,
  }));

  return (
    <Form.Item
      label="Вид документа"
      required
      validateStatus={listError ? 'error' : undefined}
      help={listError && (
        <>
          {listError}{' '}
          <Typography.Link disabled={isFetching} onClick={() => docTypes.refetch()}>
            Повторить
          </Typography.Link>
        </>
      )}
    >
      <Select
        value={value}
        options={options}
        placeholder="Введите код или наименование"
        showSearch={{ optionFilterProp: ['codeEkd', 'shortName', 'fullName'] }}
        loading={isFetching && !data}
        notFoundContent={listError && <Typography.Text type="danger">{listError}</Typography.Text>}
        disabled={disabled}
        onChange={(id: string) => {
          const docType = data?.find((item) => item.id === id);
          if (docType) onChange(docType);
        }}
      />
    </Form.Item>
  );
};
