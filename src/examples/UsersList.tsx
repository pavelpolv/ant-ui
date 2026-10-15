import { List, Result, Spin } from 'antd';
import { useQuery } from '../components';
import type { User } from '../mocks/data/users';

/** Пример компонента с запросом через react-query (не входит в сборку библиотеки). */
export const UsersList = () => {
  const { data, isPending, isError, error } = useQuery({
    queryKey: ['users'],
    queryFn: async (): Promise<User[]> => {
      const response = await fetch('/api/users');
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return response.json();
    },
  });

  if (isPending) return <Spin />;
  if (isError) return <Result status="error" title="Ошибка загрузки" subTitle={error.message} />;
  return (
    <List
      dataSource={data}
      locale={{ emptyText: 'Пользователей нет' }}
      renderItem={(user) => <List.Item>{user.name} — {user.email}</List.Item>}
    />
  );
};
