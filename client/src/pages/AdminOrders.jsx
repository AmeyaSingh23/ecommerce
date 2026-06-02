import { useEffect, useState } from 'react'
import axios from '../api/axios'
import toast, { Toaster } from 'react-hot-toast'

const AdminOrders = () => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await axios.get('/orders')
        setOrders(data)
      } catch {
        toast.error('Failed to load orders')
      } finally {
        setLoading(false)
      }
    }
    fetch()
  }, [])

  const markDelivered = async (id) => {
    try {
      const { data } = await axios.put(`/orders/${id}/deliver`)
      setOrders(prev => prev.map(o => o._id === id ? { ...o, isDelivered: data.isDelivered, deliveredAt: data.deliveredAt } : o))
      toast.success('Marked as delivered')
    } catch {
      toast.error('Failed to update order')
    }
  }

  return (
    <div className="page-wrapper">
      <Toaster position="bottom-right" toastOptions={{ style: { fontFamily: 'DM Sans, sans-serif', fontSize: '0.9rem' } }} />

      <div className="page-header">
        <p className="page-header__eyebrow">Admin</p>
        <h1 className="page-header__title">All Orders</h1>
        <p className="page-header__subtitle">{!loading && `${orders.length} total orders`}</p>
      </div>

      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="skeleton" style={{ height: '56px', borderRadius: 'var(--radius-md)' }} />
          ))}
        </div>
      ) : orders.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state__icon">📋</div>
          <p className="empty-state__title">No orders yet</p>
        </div>
      ) : (
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Date</th>
                <th>Total</th>
                <th>Payment</th>
                <th>Delivery</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(order => (
                <tr key={order._id}>
                  <td><span className="mono">{order._id.slice(-8).toUpperCase()}</span></td>
                  <td>
                    <div style={{ fontWeight: 500, fontSize: '0.88rem' }}>{order.user?.name || 'Unknown'}</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{order.user?.email}</div>
                  </td>
                  <td>{new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
                  <td style={{ fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>₹{order.totalPrice.toLocaleString('en-IN')}</td>
                  <td>
                    <span className={`badge ${order.isPaid ? 'badge-success' : 'badge-pending'}`}>
                      {order.isPaid ? 'Paid' : 'Pending'}
                    </span>
                  </td>
                  <td>
                    <span className={`badge ${order.isDelivered ? 'badge-success' : 'badge-neutral'}`}>
                      {order.isDelivered ? 'Delivered' : 'Processing'}
                    </span>
                  </td>
                  <td>
                    {!order.isDelivered && order.isPaid && (
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={() => markDelivered(order._id)}
                      >
                        Mark Delivered
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default AdminOrders