import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from '../api/axios'
import toast, { Toaster } from 'react-hot-toast'

const MyOrders = () => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await axios.get('/orders/my')
        setOrders(data)
      } catch {
        toast.error('Failed to load orders')
      } finally {
        setLoading(false)
      }
    }
    fetch()
  }, [])

  return (
    <div className="page-wrapper">
      <Toaster position="bottom-right" toastOptions={{ style: { fontFamily: 'DM Sans, sans-serif', fontSize: '0.9rem' } }} />
      <div className="page-header">
        <h1 className="page-header__title">My Orders</h1>
      </div>

      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="skeleton" style={{ height: '56px', borderRadius: 'var(--radius-md)' }} />
          ))}
        </div>
      ) : orders.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state__icon">📦</div>
          <p className="empty-state__title">No orders yet</p>
          <p className="empty-state__text">Your completed orders will appear here.</p>
          <button className="btn btn-primary" onClick={() => navigate('/')}>Start Shopping</button>
        </div>
      ) : (
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Date</th>
                <th>Total</th>
                <th>Payment</th>
                <th>Delivery</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(order => (
                <tr
                  key={order._id}
                  className="clickable"
                  onClick={() => navigate(`/order/${order._id}`)}
                >
                  <td><span className="mono">{order._id.slice(-8).toUpperCase()}</span></td>
                  <td>{new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
                  <td style={{ fontWeight: 600 }}>₹{order.totalPrice.toLocaleString('en-IN')}</td>
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
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default MyOrders