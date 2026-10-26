import type { Meta, StoryObj } from '@storybook/react-vite';
import { orderDocumentsHandlers } from '@/mocks/handlers';
import { ORDER_ID } from '@/mocks/data/orderDocuments';
import { OrderDocuments } from '@/components';

const meta = {
  title: 'Components/OrderDocuments',
  component: OrderDocuments,
  args: { orderId: ORDER_ID },
} satisfies Meta<typeof OrderDocuments>;

export default meta;
type Story = StoryObj<typeof meta>;

export const View: Story = {};

export const Empty: Story = {
  beforeEach({ msw }) {
    msw.use(orderDocumentsHandlers.documentsEmpty);
  },
};

export const OrderError: Story = {
  beforeEach({ msw }) {
    msw.use(orderDocumentsHandlers.orderError);
  },
};

export const ServerError: Story = {
  beforeEach({ msw }) {
    msw.use(orderDocumentsHandlers.documentsError);
  },
};

export const Loading: Story = {
  beforeEach({ msw }) {
    msw.use(orderDocumentsHandlers.documentsLoading);
  },
};

export const DownloadError: Story = {
  beforeEach({ msw }) {
    msw.use(orderDocumentsHandlers.downloadError);
  },
};
