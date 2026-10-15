export interface User {
  id: number;
  name: string;
  email: string;
}

export const users: User[] = [
  { id: 1, name: 'Иван Петров', email: 'ivan@example.com' },
  { id: 2, name: 'Мария Сидорова', email: 'maria@example.com' },
  { id: 3, name: 'Алексей Смирнов', email: 'alexey@example.com' },
];
