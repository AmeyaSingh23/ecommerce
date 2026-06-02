import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import { useTheme } from '../context/ThemeContext'

const SunIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="5"/>
    <line x1="12" y1="1" x2="12" y2="3"/>
    <line x1="12" y1="21" x2="12" y2="23"/>
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
    <line x1="1" y1="12" x2="3" y2="12"/>
    <line x1="21" y1="12" x2="23" y2="12"/>
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
  </svg>
)

const MoonIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
  </svg>
)

const CartIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="9" cy="21" r="1"/>
    <circle cx="20" cy="21" r="1"/>
    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
  </svg>
)

const Navbar = () => {
  const { user, logout } = useAuth()
  const { totalItems } = useCart()
  const { theme, toggleTheme } = useTheme()
  const navigate = useNavigate()
  const location = useLocation()

  const logoutHandler = () => {
    logout()
    navigate('/login')
  }

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

          {user ? (
            <>
              <Link
                to="/my-orders"
                className={`navbar__link ${isActive('/my-orders') ? 'navbar__link--active' : ''}`}
              >
                My Orders
              </Link>
              {user.role === 'admin' && (
                <>
                  <Link
                    to="/admin/products"
                    className={`navbar__link ${isActive('/admin/products') ? 'navbar__link--active' : ''}`}
                  >
                    Products
                  </Link>
                  <Link
                    to="/admin/orders"
                    className={`navbar__link ${isActive('/admin/orders') ? 'navbar__link--active' : ''}`}
                  >
                    Orders
                  </Link>
                </>
              )}
              <button onClick={logoutHandler} className="navbar__user-btn">
                {user.name.split(' ')[0]}
              </button>
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

          <button
            onClick={toggleTheme}
            className="navbar__theme-btn"
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          >
            {theme === 'light' ? <MoonIcon /> : <SunIcon />}
          </button>
        </div>
      </div>
    </nav>
  )
}

export default Navbar