import { usersHandlers } from './users';
import { orderDocumentsDefaultHandlers, orderDocumentsHandlers } from './orderDocuments';

/** Хендлеры по умолчанию для всех историй. */
export const defaultHandlers = [usersHandlers.success, ...orderDocumentsDefaultHandlers];

export { usersHandlers, orderDocumentsHandlers };
