import { delay, http, HttpResponse } from 'msw';
import type { DocumentsDataResponse } from '@/components/Documents/common/types';
import type { NewVersionRequest } from '@/components/Documents/TaskDocuments/api';
import { documentsData } from '../data/orderDocuments';

const TASK_LIST_URL = '/credit-doc/taskList/:taskId';
const NEW_VERSION_URL = '/credit-doc/new-version/:documentId';

export const TASK_ID = 'task-1';

const initialTaskList = (): DocumentsDataResponse => ({
  docLists: documentsData.docLists.map(({ counterparty, documentData }) => ({
    counterparty: { ...counterparty },
    documentData: documentData.map((document) => ({
      ...document,
      versionData: {
        ...document.versionData,
        docInEntityId: `${TASK_ID}~${document.nkpDocumentId}`,
      },
    })),
  })),
});

let taskList = initialTaskList();

export const resetTaskList = () => {
  taskList = initialTaskList();
};

export const taskDocumentsHandlers = {
  taskList: http.post(TASK_LIST_URL, async () => {
    await delay(500);
    return HttpResponse.json(taskList);
  }),
  // TODO: ответ ручки сохранения не описан — мок возвращает пустой объект и поднимает версию
  newVersion: http.post<{ documentId: string }, NewVersionRequest>(NEW_VERSION_URL, async ({ params, request }) => {
    await delay(400);
    const { versionData } = await request.json();
    const { id, ...fields } = versionData;
    const document = taskList.docLists
      .flatMap((list) => list.documentData)
      .find((item) => item.nkpDocumentId === params.documentId && item.versionData.nkpDocId === id);
    if (!document) return HttpResponse.json({ message: 'Документ не найден' }, { status: 404 });
    Object.assign(document.versionData, fields, { version: document.versionData.version + 1 });
    return HttpResponse.json({});
  }),

  taskListEmpty: http.post(TASK_LIST_URL, () => HttpResponse.json({ docLists: [] })),
  taskListError: http.post(TASK_LIST_URL, () =>
    HttpResponse.json({ message: 'Внутренняя ошибка сервера' }, { status: 500 }),
  ),
  taskListLoading: http.post(TASK_LIST_URL, async () => {
    await delay('infinite');
  }),
  newVersionError: http.post(NEW_VERSION_URL, async () => {
    await delay(400);
    return HttpResponse.json({ message: 'Внутренняя ошибка сервера' }, { status: 500 });
  }),
};

export const taskDocumentsDefaultHandlers = [taskDocumentsHandlers.taskList, taskDocumentsHandlers.newVersion];
