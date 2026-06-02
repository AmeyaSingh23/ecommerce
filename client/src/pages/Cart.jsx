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
    <div className="page-wrapper">
      <Toaster position="bottom-right" toastOptions={{ style: { fontFamily: 'DM Sans, sans-serif', fontSize: '0.9rem' } }} />
      <div className="empty-state" style={{ minHeight: '60vh' }}>
        <div className="empty-state__icon">🛒</div>
        <p className="empty-state__title">Your cart is empty</p>
        <p className="empty-state__text">Looks like you haven't added anything yet.</p>
        <button className="btn btn-primary btn-lg" onClick={() => navigate('/')}>Browse Products</button>
      </div>
    </div>
  )

  return (
    <div className="page-wrapper">
      <Toaster position="bottom-right" toastOptions={{ style: { fontFamily: 'DM Sans, sans-serif', fontSize: '0.9rem' } }} />

      <div className="page-header">
        <h1 className="page-header__title">Your Cart</h1>
        <p className="page-header__subtitle">{cartItems.reduce((a, i) => a + i.quantity, 0)} items</p>
      </div>

      <div className="split-layout">
        {/* Items */}
        <div className="split-layout__main">
          <div className="cart-items">
            {cartItems.map(item => (
              <div key={item.product} className="cart-item">
                <img
                  src={item.image || 'https://placehold.co/96x96/f5f0ea/c4a882?text=?'}
                  alt={item.name}
                  className="cart-item__image"
                />
                <div className="cart-item__info">
                  <p className="cart-item__name">{item.name}</p>
                  <p className="cart-item__price">₹{item.price.toLocaleString('en-IN')} each</p>
                  <div className="cart-item__controls">
                    <label className="form-label" style={{ margin: 0, fontSize: '0.82rem' }}>Qty:</label>
                    <select
                      className="select-field"
                      style={{ width: 'auto', padding: '0.3rem 0.6rem', fontSize: '0.88rem' }}
                      value={item.quantity}
                      onChange={e => updateQuantity(item.product, Number(e.target.value))}
                    >
                      {[...Array(Math.min(item.stock, 10)).keys()].map(i => (
                        <option key={i + 1} value={i + 1}>{i + 1}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="cart-item__right">
                  <p className="cart-item__subtotal">₹{(item.price * item.quantity).toLocaleString('en-IN')}</p>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => removeFromCart(item.product)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 'var(--space-4)' }}>
            <button className="btn btn-ghost btn-sm" onClick={clearCart}>Clear Cart</button>
          </div>
        </div>

        {/* Summary */}
        <div className="split-layout__aside">
          <div className="order-summary-card">
            <h2 className="heading-sm">Order Summary</h2>
            <hr className="divider" />
            <div className="order-summary-row">
              <span>Items ({cartItems.reduce((a, i) => a + i.quantity, 0)})</span>
              <span>₹{totalPrice.toLocaleString('en-IN')}</span>
            </div>
            <div className="order-summary-row">
              <span>Shipping</span>
              <span className="text-success">Free</span>
            </div>
            <hr className="divider" />
            <div className="order-summary-row--total">
              <span>Total</span>
              <span>₹{totalPrice.toLocaleString('en-IN')}</span>
            </div>
            <button className="btn btn-primary btn-full btn-lg" onClick={checkoutHandler}>
              Proceed to Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Cart