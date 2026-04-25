import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from '../api/axios'

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

  if (loading) return <p style={styles.center}>Loading...</p>
  if (!order) return null

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h1 style={styles.heading}>✓ Order Placed</h1>
        <p style={styles.orderId}>Order ID: <strong>{order._id}</strong></p>
        <p style={styles.status}>Payment: <span style={{ color: order.isPaid ? '#27ae60' : '#e74c3c' }}>{order.isPaid ? 'Paid' : 'Pending'}</span></p>
        <h2 style={styles.subheading}>Items</h2>
        {order.orderItems.map((item, i) => (
          <div key={i} style={styles.item}>
            <span>{item.name} × {item.quantity}</span>
            <span>₹{(item.price * item.quantity).toLocaleString()}</span>
          </div>
        ))}
        <div style={styles.total}>
          <span>Total</span>
          <span>₹{order.totalPrice.toLocaleString()}</span>
        </div>
        <h2 style={styles.subheading}>Shipping</h2>
        <p style={styles.address}>{order.shippingAddress.address}, {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.postalCode}</p>
        <button style={styles.button} onClick={() => navigate('/')}>Continue Shopping</button>
      </div>
    </div>
  )
}

const styles = {
  page: { display: 'flex', justifyContent: 'center', padding: 'clamp(1rem, 3vw, 2rem) clamp(1rem, 4vw, 2rem)' },
  card: { backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 2px 12px rgba(0,0,0,0.08)', padding: 'clamp(1.5rem, 4vw, 2.5rem)', width: 'clamp(280px, 90vw, 600px)', display: 'flex', flexDirection: 'column', gap: '0.75rem' },
  heading: { margin: 0, fontSize: 'clamp(1.3rem, 3vw, 1.8rem)', color: '#27ae60' },
  orderId: { margin: 0, fontSize: 'clamp(0.75rem, 1.8vw, 0.9rem)', color: '#666', wordBreak: 'break-all' },
  status: { margin: 0, fontSize: 'clamp(0.85rem, 2vw, 1rem)' },
  subheading: { margin: '0.5rem 0 0', fontSize: 'clamp(0.95rem, 2.5vw, 1.1rem)' },
  item: { display: 'flex', justifyContent: 'space-between', fontSize: 'clamp(0.8rem, 2vw, 0.95rem)', color: '#444' },
  total: { display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', borderTop: '1px solid #eee', paddingTop: '0.75rem', fontSize: 'clamp(0.9rem, 2vw, 1rem)' },
  address: { margin: 0, fontSize: 'clamp(0.8rem, 2vw, 0.95rem)', color: '#555' },
  button: { marginTop: '0.5rem', padding: 'clamp(0.6rem, 1.5vw, 0.75rem)', backgroundColor: '#222', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: 'clamp(0.85rem, 2vw, 1rem)' },
}

export default OrderConfirmation