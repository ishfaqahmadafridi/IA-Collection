import { Link } from 'react-router-dom';
import { useOrderTracking } from '../../hooks/orders/useOrderTracking';
import OrderTrackingDetails from './OrderTrackingDetails';
export default function Tracking() {
  const { number, setNumber, order, loading, error, authenticated, initialized, submit } = useOrderTracking();
  return <main className="max-w-2xl mx-auto px-4 pt-32 pb-12 space-y-6"><h1 className="text-3xl">Track your order</h1>
    {!initialized ? <p role="status">Checking session…</p> : !authenticated ? <Link to="/signin" className="underline">Sign in to view your orders</Link> : <>
      <form onSubmit={submit} className="space-y-4">
        <label htmlFor="order-number" className="block">Order number</label>
        <input id="order-number" required value={number} onChange={event => setNumber(event.target.value)} className="w-full border rounded p-3 bg-background" />
        <button disabled={loading} className="bg-primary text-primary-foreground px-6 py-3 rounded disabled:opacity-50">{loading ? 'Looking up order…' : 'View status'}</button>
      </form>
      {error && <p role="alert">{error}</p>}
      {order && <OrderTrackingDetails order={order} />}
    </>}
  </main>;
}
