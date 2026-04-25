import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'

const Navbar = () => {
  const { user, logout } = useAuth()
  const { totalItems } = useCart()
  const navigate = useNavigate()

  const logoutHandler = () => {
    logout()
    navigate('/login')
  }

  return (
    <nav style={styles.nav}>
      <Link to="/" style={styles.brand}>ShopEasy</Link>
      <div style={styles.links}>
        <Link to="/cart" style={styles.link}>Cart {totalItems > 0 && <span style={styles.badge}>{totalItems}</span>}</Link>
        {user ? (
          <>
            <Link to="/my-orders" style={styles.link}>My Orders</Link>
            {user.role === 'admin' && (
              <>
                <Link to="/admin/products" style={styles.link}>Products</Link>
                <Link to="/admin/orders" style={styles.link}>Orders</Link>
              </>
            )}
            <button onClick={logoutHandler} style={styles.logoutBtn}>{user.name}</button>
          </>
        ) : (
          <>
            <Link to="/login" style={styles.link}>Login</Link>
            <Link to="/register" style={styles.link}>Register</Link>
          </>
        )}
      </div>
    </nav>
  )
}

const styles = {
  nav: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 'clamp(0.75rem, 2vw, 1rem) clamp(1rem, 4vw, 2rem)', backgroundColor: '#222', color: '#fff', position: 'sticky', top: 0, zIndex: 100 },
  brand: { color: '#fff', textDecoration: 'none', fontSize: 'clamp(1.1rem, 3vw, 1.4rem)', fontWeight: 'bold' },
  links: { display: 'flex', alignItems: 'center', gap: 'clamp(0.75rem, 2vw, 1.5rem)', flexWrap: 'wrap' },
  link: { color: '#fff', textDecoration: 'none', fontSize: 'clamp(0.8rem, 2vw, 0.95rem)', position: 'relative' },
  badge: { backgroundColor: '#e74c3c', color: '#fff', borderRadius: '50%', padding: '2px 6px', fontSize: '0.7rem', marginLeft: '4px' },
  logoutBtn: { background: 'none', border: '1px solid #fff', color: '#fff', padding: 'clamp(0.25rem, 1vw, 0.4rem) clamp(0.5rem, 1.5vw, 0.75rem)', borderRadius: '4px', cursor: 'pointer', fontSize: 'clamp(0.8rem, 2vw, 0.95rem)' },
}

export default Navbar