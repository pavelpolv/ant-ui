import type { Meta, StoryObj } from '@storybook/react-vite';
import { usersHandlers } from '../mocks/handlers';
import { UsersList } from './UsersList';

const meta = {
  title: 'Examples/UsersList',
  component: UsersList,
} satisfies Meta<typeof UsersList>;

export default meta;
type Story = StoryObj<typeof meta>;

// success подключён глобально в preview.tsx
export const Success: Story = {};

export const Empty: Story = {
  beforeEach({ msw }) {
    msw.use(usersHandlers.empty);
  },
};

export const ServerError: Story = {
  beforeEach({ msw }) {
    msw.use(usersHandlers.error);
  },
};

export const Loading: Story = {
  beforeEach({ msw }) {
    msw.use(usersHandlers.loading);
  },
};
