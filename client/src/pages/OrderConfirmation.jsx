import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from '../api/axios'

const CheckIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
)

const OrderConfirmation = () => {
  const { id } = useParams()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await axios.get(`/orders/${id}`)
        setOrder(data)
      } catch {
        navigate('/')
      } finally {
        setLoading(false)
      }
    }
    fetch()
  }, [id])

  if (loading) return (
    <div className="confirm-page">
      <div className="confirm-card">
        {[100, 60, 80, 40].map((w, i) => (
          <div key={i} className="skeleton" style={{ height: '1.4rem', width: `${w}%`, borderRadius: 'var(--radius-sm)' }} />
        ))}
      </div>
    </div>
  )

  if (!order) return null

  return (
    <div className="confirm-page">
      <div className="confirm-card">
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
          <div className="confirm-check">
            <CheckIcon />
          </div>
          <div>
            <h1 style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--text-primary)' }}>Order Placed!</h1>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontFamily: 'monospace', marginTop: '2px' }}>#{order._id}</p>
          </div>
        </div>

        <hr className="confirm-divider" />

        {/* Payment & Delivery status */}
        <div style={{ display: 'flex', gap: 'var(--space-3)', flexWrap: 'wrap' }}>
          <span className={`badge ${order.isPaid ? 'badge-success' : 'badge-pending'}`}>
            {order.isPaid ? '✓ Paid' : '⏳ Payment Pending'}
          </span>
          <span className={`badge ${order.isDelivered ? 'badge-success' : 'badge-neutral'}`}>
            {order.isDelivered ? '✓ Delivered' : 'Processing'}
          </span>
        </div>

        <hr className="confirm-divider" />

        {/* Items */}
        <div>
          <p className="form-label" style={{ marginBottom: 'var(--space-3)' }}>Items Ordered</p>
          {order.orderItems.map((item, i) => (
            <div key={i} className="confirm-row" style={{ marginBottom: 'var(--space-2)' }}>
              <span>{item.name} <span className="text-muted">× {item.quantity}</span></span>
              <span style={{ fontWeight: 600 }}>₹{(item.price * item.quantity).toLocaleString('en-IN')}</span>
            </div>
          ))}
          <div className="confirm-row--total">
            <span>Total Paid</span>
            <span>₹{order.totalPrice.toLocaleString('en-IN')}</span>
          </div>
        </div>

        <hr className="confirm-divider" />

        {/* Shipping */}
        <div>
          <p className="form-label" style={{ marginBottom: 'var(--space-2)' }}>Shipping To</p>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
            {order.shippingAddress.address}, {order.shippingAddress.city},<br />
            {order.shippingAddress.state} — {order.shippingAddress.postalCode}
          </p>
        </div>

        <button className="btn btn-primary btn-lg" onClick={() => navigate('/')}>
          Continue Shopping
        </button>
      </div>
    </div>
  )
}

export default OrderConfirmation