import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'

const CartIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="9" cy="21" r="1" />
    <circle cx="20" cy="21" r="1" />
    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
  </svg>
)

const HeartIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
)

const Navbar = () => {
  const { user } = useAuth()
  const { totalItems } = useCart()
  const location = useLocation()

  const isActive = (path) => location.pathname === path

  return (
    <nav className="navbar">
      <div className="navbar__inner">
        <Link to="/" className="navbar__brand">Vendora</Link>

        <div className="navbar__links">
          <Link
            to="/cart"
            className={`navbar__link navbar__cart-btn ${isActive('/cart') ? 'navbar__link--active' : ''}`}
          >
            <CartIcon />
            {totalItems > 0 && (
              <span className="navbar__cart-badge">{totalItems}</span>
            )}
          </Link>
          {user && (
            <Link
              to="/wishlist"
              className={`navbar__link ${isActive('/wishlist') ? 'navbar__link--active' : ''}`}
              title="Wishlist"
            >
              <HeartIcon />
            </Link>
          )}

          {user ? (
            <>
              <Link
                to="/profile"
                className={`navbar__link ${isActive('/profile') ? 'navbar__link--active' : ''}`}
              >
                {user.name.split(' ')[0]}
              </Link>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className={`navbar__link ${isActive('/login') ? 'navbar__link--active' : ''}`}
              >
                Login
              </Link>
              <Link
                to="/register"
                className={`navbar__link ${isActive('/register') ? 'navbar__link--active' : ''}`}
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar
