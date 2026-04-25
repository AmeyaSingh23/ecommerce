import { useEffect, useState } from 'react'
import axios from '../api/axios'
import toast, { Toaster } from 'react-hot-toast'

const AdminOrders = () => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchOrders = async () => {
    try {
      const { data } = await axios.get('/orders')
      setOrders(data)
    } catch {
      toast.error('Failed to load orders')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchOrders() }, [])

  const deliverHandler = async (id) => {
    try {
      await axios.put(`/orders/${id}/deliver`)
      toast.success('Marked as delivered')
      fetchOrders()
    } catch {
      toast.error('Failed to update order')
    }
  }

  if (loading) return <p style={styles.center}>Loading...</p>

  return (
    <div style={styles.page}>
      <Toaster />
      <h1 style={styles.heading}>All Orders</h1>
      <div style={styles.tableWrapper}>
        <table style={styles.table}>
          <thead>
            <tr>
              {['Order ID', 'User', 'Total', 'Paid', 'Delivered', 'Action'].map(h => (
                <th key={h} style={styles.th}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order._id} style={styles.row}>
                <td style={styles.td}><span style={styles.id}>{order._id}</span></td>
                <td style={styles.td}>{order.user?.name}<br /><span style={styles.email}>{order.user?.email}</span></td>
                <td style={styles.td}>₹{order.totalPrice.toLocaleString()}</td>
                <td style={styles.td}><span style={{ ...styles.badge, backgroundColor: order.isPaid ? '#27ae60' : '#e74c3c' }}>{order.isPaid ? 'Paid' : 'Pending'}</span></td>
                <td style={styles.td}><span style={{ ...styles.badge, backgroundColor: order.isDelivered ? '#27ae60' : '#e67e22' }}>{order.isDelivered ? 'Delivered' : 'Pending'}</span></td>
                <td style={styles.td}>
                  {!order.isDelivered && (
                    <button style={styles.deliverBtn} onClick={() => deliverHandler(order._id)}>
                      Mark Delivered
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

const styles = {
  page: { padding: 'clamp(1rem, 3vw, 2rem) clamp(1rem, 4vw, 2rem)' },
  heading: { fontSize: 'clamp(1.3rem, 3vw, 2rem)', marginBottom: '1.5rem' },
  tableWrapper: { overflowX: 'auto' },
  table: { width: '100%', borderCollapse: 'collapse', backgroundColor: '#fff', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.07)' },
  th: { textAlign: 'left', padding: 'clamp(0.6rem, 1.5vw, 0.85rem) clamp(0.75rem, 2vw, 1rem)', backgroundColor: '#222', color: '#fff', fontSize: 'clamp(0.8rem, 1.8vw, 0.9rem)', whiteSpace: 'nowrap' },
  row: { borderBottom: '1px solid #f0f0f0' },
  td: { padding: 'clamp(0.6rem, 1.5vw, 0.85rem) clamp(0.75rem, 2vw, 1rem)', fontSize: 'clamp(0.78rem, 1.8vw, 0.9rem)', color: '#333', verticalAlign: 'middle' },
  id: { fontFamily: 'monospace', fontSize: 'clamp(0.7rem, 1.5vw, 0.8rem)', color: '#666' },
  email: { fontSize: 'clamp(0.7rem, 1.5vw, 0.8rem)', color: '#888' },
  badge: { color: '#fff', padding: '2px 10px', borderRadius: '12px', fontSize: 'clamp(0.7rem, 1.5vw, 0.8rem)', whiteSpace: 'nowrap' },
  deliverBtn: { backgroundColor: '#2980b9', color: '#fff', border: 'none', padding: '0.3rem 0.75rem', borderRadius: '4px', cursor: 'pointer', fontSize: 'clamp(0.75rem, 1.8vw, 0.85rem)', whiteSpace: 'nowrap' },
  center: { textAlign: 'center', marginTop: '2rem' },
}

export default AdminOrders