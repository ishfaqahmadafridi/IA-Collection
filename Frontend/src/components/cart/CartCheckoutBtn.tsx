import { Link } from 'react-router-dom';
import { useCheckout } from '../../hooks/orders/useCheckout';
import { SHIPPING_ADDRESS_MIN_LENGTH, SHIPPING_ADDRESS_MAX_LENGTH } from '../../constants/orders';
export default function CartCheckoutBtn() {
  const { hasItems, authenticated, address, setAddress, loading, error, submit } = useCheckout();
  if (!hasItems) return null;
  if (!authenticated) return <Link to="/signin" className="block mt-6 underline">Sign in to place your order</Link>;
  return <form onSubmit={submit} className="mt-6 space-y-3">
    <label htmlFor="shipping-address" className="block">Shipping address</label>
    <textarea id="shipping-address" autoComplete="street-address" required minLength={SHIPPING_ADDRESS_MIN_LENGTH} maxLength={SHIPPING_ADDRESS_MAX_LENGTH} value={address} onChange={event => setAddress(event.target.value)} disabled={loading} className="w-full p-3 rounded border bg-background" />
    <p className="text-sm">This submits an order request. No online payment is collected. The server confirms product prices and availability.</p>
    {error && <p role="alert">{error}</p>}
    <button disabled={loading} className="w-full py-4 bg-primary text-primary-foreground rounded disabled:opacity-50">{loading ? 'Placing order…' : 'Place order'}</button>
  </form>;
}
