import type { Meta, StoryObj } from '@storybook/react-vite';
import { docTypeDictHandlers, resetTaskList, taskDocumentsHandlers } from '@/mocks/handlers';
import { DEFINITION_KEY, TASK_ID } from '@/mocks/handlers/taskDocuments';
import { ORDER_ID } from '@/mocks/data/orderDocuments';
import { TaskDocuments } from '@/components';

const meta = {
  title: 'Components/TaskDocuments',
  component: TaskDocuments,
  args: {
    taskId: TASK_ID,
    orderId: ORDER_ID,
    definitionKey: DEFINITION_KEY,
    config: { visible: true, readonly: false },
  },
  beforeEach() {
    resetTaskList();
  },
} satisfies Meta<typeof TaskDocuments>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Edit: Story = {};

export const Hidden: Story = {
  args: { config: { visible: false, readonly: false } },
};

export const DeleteError: Story = {
  beforeEach({ msw }) {
    msw.use(taskDocumentsHandlers.deleteDocInEntityError);
  },
};

export const AddDocumentError: Story = {
  beforeEach({ msw }) {
    msw.use(taskDocumentsHandlers.newDocumentToListError);
  },
};

export const FileUploadError: Story = {
  beforeEach({ msw }) {
    msw.use(taskDocumentsHandlers.uploadFilePartialError);
  },
};

export const DeleteFileError: Story = {
  beforeEach({ msw }) {
    msw.use(taskDocumentsHandlers.deleteFileError);
  },
};

export const DocTypesDictError: Story = {
  beforeEach({ msw }) {
    msw.use(taskDocumentsHandlers.docTypesDictError);
  },
};

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
