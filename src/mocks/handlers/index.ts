import { usersHandlers } from './users';
import { docTypeDictDefaultHandlers, docTypeDictHandlers } from './docTypeDict';
import { orderDocumentsDefaultHandlers, orderDocumentsHandlers } from './orderDocuments';
import { resetTaskList, taskDocumentsDefaultHandlers, taskDocumentsHandlers } from './taskDocuments';

export const defaultHandlers = [
  usersHandlers.success,
  ...docTypeDictDefaultHandlers,
  ...orderDocumentsDefaultHandlers,
  ...taskDocumentsDefaultHandlers,
];

export { usersHandlers, docTypeDictHandlers, orderDocumentsHandlers, taskDocumentsHandlers, resetTaskList };
