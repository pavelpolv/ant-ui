import { usersHandlers } from './users';
import { docTypeDictDefaultHandlers, docTypeDictHandlers } from './docTypeDict';
import { orderDocumentsDefaultHandlers, orderDocumentsHandlers } from './orderDocuments';

export const defaultHandlers = [usersHandlers.success, ...docTypeDictDefaultHandlers, ...orderDocumentsDefaultHandlers];

export { usersHandlers, docTypeDictHandlers, orderDocumentsHandlers };
