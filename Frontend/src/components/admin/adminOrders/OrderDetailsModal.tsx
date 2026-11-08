import Modal from '../../layout/Modal';
import { IoClose } from 'react-icons/io5';
import type { OrderDetailsModalProps } from '../../../types/components/admin/adminOrders/adminOrdersInterface';

export default function OrderDetailsModal({ order, onClose }: OrderDetailsModalProps) {
  return (
    <Modal title={`Order ${order.order_number}`} onClose={onClose}>
      <div className="bg-white rounded-xl w-full">
        <div className="flex items-center justify-between p-6 border-b">
          <h3 className="text-xl font-bold text-gray-900">Order #{order.order_number}</h3>
          <button
            aria-label="Close order details"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <IoClose className="text-2xl" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Customer</p>
              <p className="font-medium">{order.user_name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Status</p>
              <p className="font-medium capitalize">{order.status}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Date</p>
              <p className="font-medium">{new Date(order.created_at).toLocaleString()}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Amount</p>
              <p className="font-bold text-lg">PKR {order.total_amount}</p>
            </div>
          </div>

          {order.shipping_address && (
            <div>
              <p className="text-sm text-gray-500 mb-2">Shipping Address</p>
              <p className="text-gray-700">{order.shipping_address}</p>
            </div>
          )}

          <div>
            <p className="text-sm text-gray-500 mb-3">Order Items</p>
            <div className="space-y-3">
              {order.items?.map((item, index) => (
                <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                  <div className="flex items-center gap-3">
                    {item.image && (
                      <img
                        src={item.image}
                        alt={item.product_name}
                        className="w-12 h-12 object-cover rounded-lg"
                      />
                    )}
                    <div>
                      <p className="font-medium">{item.product_name}</p>
                      <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                    </div>
                  </div>
                  <p className="font-semibold">PKR {item.price}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}
