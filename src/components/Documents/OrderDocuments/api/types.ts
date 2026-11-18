export interface OrderResponse {
  error_code: number;
  error: string | null;
  order: Order;
}

export interface Order {
  orderId: string;
  orderNumber: string;
  orderType: string;
  orderStatus: string | null;
  title: string;
  closedDate: string | null;
  createdDateTime: string | null;
}
