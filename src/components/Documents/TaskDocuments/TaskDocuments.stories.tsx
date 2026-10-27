import type { Meta, StoryObj } from '@storybook/react-vite';
import { docTypeDictHandlers, resetTaskList, taskDocumentsHandlers } from '@/mocks/handlers';
import { TASK_ID } from '@/mocks/handlers/taskDocuments';
import { TaskDocuments } from '@/components';

const meta = {
  title: 'Components/TaskDocuments',
  component: TaskDocuments,
  args: { taskId: TASK_ID },
  beforeEach() {
    resetTaskList();
  },
} satisfies Meta<typeof TaskDocuments>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Edit: Story = {};

export const SaveError: Story = {
  beforeEach({ msw }) {
    msw.use(taskDocumentsHandlers.newVersionError);
  },
};

export const Empty: Story = {
  beforeEach({ msw }) {
    msw.use(taskDocumentsHandlers.taskListEmpty);
  },
};

export const ServerError: Story = {
  beforeEach({ msw }) {
    msw.use(taskDocumentsHandlers.taskListError);
  },
};

export const Loading: Story = {
  beforeEach({ msw }) {
    msw.use(taskDocumentsHandlers.taskListLoading);
  },
};

export const DocTypeDictError: Story = {
  beforeEach({ msw }) {
    msw.use(docTypeDictHandlers.docTypeDictError);
  },
};
