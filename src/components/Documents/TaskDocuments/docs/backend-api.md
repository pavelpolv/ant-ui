# TaskDocuments — API бэкенда

Структура каталогов (`GET /credit-doc/doc-structure`) и сборка дерева — как в [OrderDocuments](../../OrderDocuments/docs/backend-api.md).
Заявка (`GET /credit-doc/order/{orderId}`) не запрашивается. Код компонента от OrderDocuments не зависит. Общие с OrderDocuments
типы, запросы и хуки (`/doc-structure`, `/credit-doc/docTypeDict`) — в `common/`; сборка дерева и колонки — свои копии
в `TaskDocuments/`.

## Данные документов

```
POST /credit-doc/taskList/{entityId}
```

Вместо `GET /credit-doc/documents-data/{entityId}`. Ответ — как у `/documents-data` (`docLists`), плюс поле
`versionData.docInEntityId: string` (пока не используется).

- [ ] Откуда берётся `entityId` и параметры тела запроса — не описано. Сейчас в URL подставляется `taskId` из props, тело `{}`.

## Варианты полей

`GET /credit-doc/docTypeDict/{docType}` — как в [OrderDocuments](../../OrderDocuments/docs/backend-api.md#3-справочник-типа-документа).

## Сохранение поля

```
POST /credit-doc/new-version/{documentId}
```

```ts
interface NewVersionRequest {
  versionData: {
    id: string;              // versionData.nkpDocId
    assuranceLevel?: string; // одно изменённое поле
    provisionForm?: string;
    signType?: string;
  };
}
```

- `documentId` — `DocumentData.nkpDocumentId`.
- После успешного сохранения перезапрашивается `POST /credit-doc/taskList`.
- [ ] Ручка описана не до конца: сверить, что такое `documentId` и `id`, и что приходит в ответе. Сейчас ответ не используется. Мок поднимает версию документа на 1.

## Колонки

| Колонка | Ширина | Источник | Сохранение |
|---|---|---|---|
| Документ | остаток | как в OrderDocuments | — |
| Файлы | 300 | как в OrderDocuments | — |
| Статус | 130 | `versionData.statusName` | — |
| Вид заверения | 280 | `versionData.assuranceLevel` | `{ id, assuranceLevel }` |
| Форма предоставления | 170 | `versionData.provisionForm` | `{ id, provisionForm }` |
| Способ подписания | 200 | `versionData.signType` | `{ id, signType }` |

Горизонтальная прокрутка — если таблица уже 1450px.
