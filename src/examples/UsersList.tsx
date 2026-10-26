import { List, Result, Spin } from 'antd';
import axios from 'axios';
import { useQuery } from '@/components';
import type { User } from '@/mocks/data/users';

export const UsersList = () => {
  const { data, isPending, isError, error } = useQuery({
    queryKey: ['users'],
    queryFn: async (): Promise<User[]> => (await axios.get<User[]>('/api/users')).data,
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
