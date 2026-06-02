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
      })

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
        name: 'Vendora',
        description: 'Order Payment',
        order_id: razorpayOrder.id,
        handler: async (response) => {
          try {
            await axios.post('/payment/verify', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            })

            await axios.put(`/orders/${order._id}/pay`, {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            })

            clearCart()
            toast.success('Payment successful!')
            navigate(`/order/${order._id}`)
          } catch {
            toast.error('Payment verification failed')
          }
        },
        prefill: { name: user.name, email: user.email },
        theme: { color: '#c2714f' },
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
    <div className="page-wrapper">
      <Toaster position="bottom-right" toastOptions={{ style: { fontFamily: 'DM Sans, sans-serif', fontSize: '0.9rem' } }} />

      <div className="page-header">
        <h1 className="page-header__title">Checkout</h1>
      </div>

      <div className="split-layout">
        {/* Shipping Form */}
        <div className="split-layout__main">
          <form onSubmit={submitHandler} className="admin-form">
            <h2 className="heading-sm">Shipping Address</h2>
            <hr className="divider" />

            <div className="form-group">
              <label className="form-label" htmlFor="checkout-address">Street Address</label>
              <input
                id="checkout-address"
                className="input-field"
                placeholder="123 Main Street"
                value={address}
                onChange={e => setAddress(e.target.value)}
                autoComplete="street-address"
                required
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
              <div className="form-group">
                <label className="form-label" htmlFor="checkout-city">City</label>
                <input
                  id="checkout-city"
                  className="input-field"
                  placeholder="Mumbai"
                  value={city}
                  onChange={e => setCity(e.target.value)}
                  autoComplete="address-level2"
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="checkout-state">State</label>
                <input
                  id="checkout-state"
                  className="input-field"
                  placeholder="Maharashtra"
                  value={state}
                  onChange={e => setState(e.target.value)}
                  autoComplete="address-level1"
                  required
                />
              </div>
            </div>

            <div className="form-group" style={{ maxWidth: '200px' }}>
              <label className="form-label" htmlFor="checkout-postal">Postal Code</label>
              <input
                id="checkout-postal"
                className="input-field"
                placeholder="400001"
                value={postalCode}
                onChange={e => setPostalCode(e.target.value)}
                autoComplete="postal-code"
                inputMode="numeric"
                required
              />
            </div>

            <button
              className="btn btn-primary btn-lg"
              type="submit"
              disabled={loading}
            >
              {loading ? 'Processing…' : `Pay ₹${totalPrice.toLocaleString('en-IN')}`}
            </button>
          </form>
        </div>

        {/* Order Summary */}
        <div className="split-layout__aside">
          <div className="order-summary-card">
            <h2 className="heading-sm">Order Summary</h2>
            <hr className="divider" />
            {cartItems.map(item => (
              <div key={item.product} className="order-summary-row">
                <span className="truncate" style={{ maxWidth: '160px' }}>{item.name} × {item.quantity}</span>
                <span style={{ flexShrink: 0 }}>₹{(item.price * item.quantity).toLocaleString('en-IN')}</span>
              </div>
            ))}
            <hr className="divider" />
            <div className="order-summary-row--total">
              <span>Total</span>
              <span>₹{totalPrice.toLocaleString('en-IN')}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Checkout