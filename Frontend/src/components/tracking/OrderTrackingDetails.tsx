import type { OrderTrackingDetailsProps } from '../../types/orders';
export default function OrderTrackingDetails({ order }: OrderTrackingDetailsProps) {
  return <section aria-label="Order details" className="space-y-3">
    <h2 className="text-xl">{order.order_number}</h2>
    <p>Status: {order.status}</p>
    <p>Total: PKR {order.total_amount}</p>
    <p>Delivery address: {order.shipping_address}</p>
    <ul>{order.items.map(item => <li key={item.id}>{item.product_name} × {item.quantity}</li>)}</ul>
  </section>;
}
