import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from '../api/axios'
import toast, { Toaster } from 'react-hot-toast'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'

const Checkout = () => {
  const { cartItems, totalPrice, clearCart } = useCart()
  const { user } = useAuth()
  const navigate = useNavigate()

  const [address, setAddress] = useState('')
  const [city, setCity] = useState('')
  const [postalCode, setPostalCode] = useState('')
  const [state, setState] = useState('')
  const [loading, setLoading] = useState(false)

  const loadRazorpay = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script')
      script.src = 'https://checkout.razorpay.com/v1/checkout.js'
      script.onload = () => resolve(true)
      script.onerror = () => resolve(false)
      document.body.appendChild(script)
    })
  }

  const submitHandler = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      // Step 1: Create Razorpay payment order only
      const { data: razorpayOrder } = await axios.post('/payment/create-order', { totalPrice })

      const loaded = await loadRazorpay()
      if (!loaded) {
        toast.error('Razorpay failed to load')
        setLoading(false)
        return
      }

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: razorpayOrder.amount,
        currency: 'INR',
        name: 'ShopEasy',
        description: 'Order Payment',
        order_id: razorpayOrder.id,
        handler: async (response) => {
          try {
            // Step 2: Verify payment
            await axios.post('/payment/verify', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            })

            // Step 3: Only now create order in DB
            const orderItems = cartItems.map(item => ({
              product: item.product,
              name: item.name,
              image: item.image,
              price: item.price,
              quantity: item.quantity,
            }))

            const { data: order } = await axios.post('/orders', {
              orderItems,
              shippingAddress: { address, city, postalCode, state },
              paymentMethod: 'Razorpay',
              totalPrice,
              isPaid: true,
              paidAt: Date.now(),
              paymentResult: {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                status: 'paid',
              },
            })

            clearCart()
            toast.success('Payment successful')
            navigate(`/order/${order._id}`)
          } catch {
            toast.error('Payment verification failed')
          }
        },
        prefill: { name: user.name, email: user.email },
        theme: { color: '#222222' },
      }

      const rzp = new window.Razorpay(options)
      rzp.open()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Checkout failed')
    } finally {
      setLoading(false)
    }
  }

  if (cartItems.length === 0) {
    navigate('/')
    return null
  }

  return (
    <div style={styles.page}>
      <Toaster />
      <h1 style={styles.heading}>Checkout</h1>
      <div style={styles.layout}>
        <form onSubmit={submitHandler} style={styles.form}>
          <h2 style={styles.subheading}>Shipping Address</h2>
          <input style={styles.input} placeholder="Address" value={address} onChange={e => setAddress(e.target.value)} required />
          <input style={styles.input} placeholder="City" value={city} onChange={e => setCity(e.target.value)} required />
          <input style={styles.input} placeholder="State" value={state} onChange={e => setState(e.target.value)} required />
          <input style={styles.input} placeholder="Postal Code" value={postalCode} onChange={e => setPostalCode(e.target.value)} required />
          <button style={styles.button} type="submit" disabled={loading}>
            {loading ? 'Processing...' : `Pay ₹${totalPrice.toLocaleString()}`}
          </button>
        </form>
        <div style={styles.summary}>
          <h2 style={styles.subheading}>Order Summary</h2>
          {cartItems.map(item => (
            <div key={item.product} style={styles.summaryItem}>
              <span>{item.name} × {item.quantity}</span>
              <span>₹{(item.price * item.quantity).toLocaleString()}</span>
            </div>
          ))}
          <div style={styles.summaryTotal}>
            <span>Total</span>
            <span>₹{totalPrice.toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

const styles = {
  page: { padding: 'clamp(1rem, 3vw, 2rem) clamp(1rem, 4vw, 2rem)' },
  heading: { fontSize: 'clamp(1.3rem, 3vw, 2rem)', marginBottom: '1.5rem' },
  layout: { display: 'flex', gap: 'clamp(1rem, 3vw, 2rem)', flexWrap: 'wrap', alignItems: 'flex-start' },
  form: { flex: 2, minWidth: '280px', display: 'flex', flexDirection: 'column', gap: '1rem', backgroundColor: '#fff', padding: 'clamp(1rem, 3vw, 1.5rem)', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.07)' },
  subheading: { margin: 0, fontSize: 'clamp(1rem, 2.5vw, 1.2rem)' },
  input: { padding: 'clamp(0.5rem, 1.5vw, 0.75rem)', fontSize: 'clamp(0.85rem, 2vw, 1rem)', border: '1px solid #ddd', borderRadius: '4px', outline: 'none' },
  button: { padding: 'clamp(0.6rem, 1.5vw, 0.75rem)', backgroundColor: '#222', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: 'clamp(0.85rem, 2vw, 1rem)' },
  summary: { flex: 1, minWidth: '220px', backgroundColor: '#fff', padding: 'clamp(1rem, 3vw, 1.5rem)', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.07)', display: 'flex', flexDirection: 'column', gap: '0.75rem' },
  summaryItem: { display: 'flex', justifyContent: 'space-between', fontSize: 'clamp(0.8rem, 2vw, 0.95rem)', color: '#444' },
  summaryTotal: { display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: 'clamp(0.9rem, 2vw, 1rem)', borderTop: '1px solid #eee', paddingTop: '0.75rem', marginTop: '0.25rem' },
}

export default Checkout