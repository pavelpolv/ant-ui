import { usersHandlers } from './users';
import { orderDocumentsDefaultHandlers, orderDocumentsHandlers } from './orderDocuments';

export const defaultHandlers = [usersHandlers.success, ...orderDocumentsDefaultHandlers];

export { usersHandlers, orderDocumentsHandlers };
