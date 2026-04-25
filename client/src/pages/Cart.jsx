import { useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import toast, { Toaster } from 'react-hot-toast'

const Cart = () => {
  const { cartItems, removeFromCart, updateQuantity, clearCart, totalPrice } = useCart()
  const { user } = useAuth()
  const navigate = useNavigate()

  const checkoutHandler = () => {
    if (!user) {
      toast.error('Please login to checkout')
      navigate('/login')
      return
    }
    navigate('/checkout')
  }

  if (cartItems.length === 0) return (
    <div style={styles.empty}>
      <Toaster />
      <p>Your cart is empty.</p>
      <button style={styles.button} onClick={() => navigate('/')}>Shop Now</button>
    </div>
  )

  return (
    <div style={styles.page}>
      <Toaster />
      <h1 style={styles.heading}>Your Cart</h1>
      <div style={styles.layout}>
        <div style={styles.items}>
          {cartItems.map(item => (
            <div key={item.product} style={styles.card}>
              <img src={item.image || 'https://placehold.co/100x80'} alt={item.name} style={styles.image} />
              <div style={styles.details}>
                <p style={styles.name}>{item.name}</p>
                <p style={styles.price}>₹{item.price.toLocaleString()}</p>
                <div style={styles.qtyRow}>
                  <label style={styles.label}>Qty:</label>
                  <select
                    style={styles.select}
                    value={item.quantity}
                    onChange={e => updateQuantity(item.product, Number(e.target.value))}
                  >
                    {[...Array(Math.min(item.stock, 10)).keys()].map(i => (
                      <option key={i + 1} value={i + 1}>{i + 1}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div style={styles.right}>
                <p style={styles.subtotal}>₹{(item.price * item.quantity).toLocaleString()}</p>
                <button style={styles.remove} onClick={() => removeFromCart(item.product)}>Remove</button>
              </div>
            </div>
          ))}
          <button style={styles.clearBtn} onClick={clearCart}>Clear Cart</button>
        </div>
        <div style={styles.summary}>
          <h2 style={styles.summaryTitle}>Order Summary</h2>
          <div style={styles.summaryRow}>
            <span>Items</span>
            <span>{cartItems.reduce((a, i) => a + i.quantity, 0)}</span>
          </div>
          <div style={styles.summaryRow}>
            <span>Total</span>
            <span style={styles.total}>₹{totalPrice.toLocaleString()}</span>
          </div>
          <button style={styles.button} onClick={checkoutHandler}>Proceed to Checkout</button>
        </div>
      </div>
    </div>
  )
}

const styles = {
  page: { padding: 'clamp(1rem, 3vw, 2rem) clamp(1rem, 4vw, 2rem)' },
  heading: { fontSize: 'clamp(1.3rem, 3vw, 2rem)', marginBottom: '1.5rem' },
  layout: { display: 'flex', gap: 'clamp(1rem, 3vw, 2rem)', flexWrap: 'wrap', alignItems: 'flex-start' },
  items: { flex: 2, minWidth: '280px', display: 'flex', flexDirection: 'column', gap: '1rem' },
  card: { display: 'flex', gap: '1rem', backgroundColor: '#fff', padding: 'clamp(0.75rem, 2vw, 1rem)', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.07)', flexWrap: 'wrap' },
  image: { width: 'clamp(70px, 12vw, 100px)', height: 'clamp(60px, 10vw, 80px)', objectFit: 'cover', borderRadius: '4px' },
  details: { flex: 1, display: 'flex', flexDirection: 'column', gap: '0.4rem' },
  name: { margin: 0, fontWeight: '600', fontSize: 'clamp(0.85rem, 2vw, 1rem)' },
  price: { margin: 0, color: '#444', fontSize: 'clamp(0.8rem, 2vw, 0.95rem)' },
  qtyRow: { display: 'flex', alignItems: 'center', gap: '0.5rem' },
  label: { fontSize: 'clamp(0.8rem, 2vw, 0.9rem)' },
  select: { padding: '0.3rem', borderRadius: '4px', border: '1px solid #ddd', fontSize: 'clamp(0.8rem, 2vw, 0.9rem)' },
  right: { display: 'flex', flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'space-between' },
  subtotal: { margin: 0, fontWeight: 'bold', fontSize: 'clamp(0.9rem, 2vw, 1rem)' },
  remove: { background: 'none', border: 'none', color: '#e74c3c', cursor: 'pointer', fontSize: 'clamp(0.8rem, 2vw, 0.9rem)' },
  clearBtn: { background: 'none', border: '1px solid #ccc', padding: '0.5rem 1rem', borderRadius: '4px', cursor: 'pointer', fontSize: 'clamp(0.8rem, 2vw, 0.9rem)', alignSelf: 'flex-start' },
  summary: { flex: 1, minWidth: '220px', backgroundColor: '#fff', padding: 'clamp(1rem, 3vw, 1.5rem)', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.07)', display: 'flex', flexDirection: 'column', gap: '1rem' },
  summaryTitle: { margin: 0, fontSize: 'clamp(1rem, 2.5vw, 1.3rem)' },
  summaryRow: { display: 'flex', justifyContent: 'space-between', fontSize: 'clamp(0.85rem, 2vw, 1rem)' },
  total: { fontWeight: 'bold', fontSize: 'clamp(1rem, 2.5vw, 1.2rem)' },
  button: { padding: 'clamp(0.6rem, 1.5vw, 0.75rem)', backgroundColor: '#222', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: 'clamp(0.85rem, 2vw, 1rem)' },
  empty: { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', gap: '1rem' },
}

export default Cart