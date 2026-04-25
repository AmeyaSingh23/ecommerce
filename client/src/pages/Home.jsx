import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from '../api/axios'
import toast, { Toaster } from 'react-hot-toast'
import { useCart } from '../context/CartContext'

const CATEGORIES = ['all', 'Electronics', 'Clothing', 'Books', 'Home', 'Sports', 'Other']

const Home = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('all')
  const { addToCart } = useCart()
  const navigate = useNavigate()

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true)
      try {
        const { data } = await axios.get('/products', {
          params: { search, category }
        })
        setProducts(data)
      } catch {
        toast.error('Failed to load products')
      } finally {
        setLoading(false)
      }
    }

    const debounce = setTimeout(fetchProducts, 400)
    return () => clearTimeout(debounce)
  }, [search, category])

  return (
    <div style={styles.page}>
      <Toaster />
      <div style={styles.controls}>
        <input
          style={styles.searchInput}
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <div style={styles.categories}>
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              style={{ ...styles.catBtn, ...(category === cat ? styles.catBtnActive : {}) }}
              onClick={() => setCategory(cat)}
            >
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <p style={styles.center}>Loading...</p>
      ) : products.length === 0 ? (
        <p style={styles.center}>No products found.</p>
      ) : (
        <div style={styles.grid}>
          {products.map(product => (
            <div key={product._id} style={styles.card}>
              <img
                src={product.image || 'https://placehold.co/300x200'}
                alt={product.name}
                style={styles.image}
                onClick={() => navigate(`/product/${product._id}`)}
              />
              <div style={styles.cardBody}>
                <h3 style={styles.name} onClick={() => navigate(`/product/${product._id}`)}>{product.name}</h3>
                <p style={styles.category}>{product.category}</p>
                <p style={styles.price}>₹{product.price.toLocaleString()}</p>
                <p style={styles.stock}>{product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}</p>
                <button
                  style={{ ...styles.button, opacity: product.stock === 0 ? 0.5 : 1 }}
                  disabled={product.stock === 0}
                  onClick={() => { addToCart(product); toast.success('Added to cart') }}
                >
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

const styles = {
  page: { padding: 'clamp(1rem, 3vw, 2rem) clamp(1rem, 4vw, 2rem)' },
  controls: { display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: 'clamp(1rem, 2vw, 1.5rem)' },
  searchInput: { padding: 'clamp(0.5rem, 1.5vw, 0.75rem) clamp(0.75rem, 2vw, 1rem)', fontSize: 'clamp(0.85rem, 2vw, 1rem)', border: '1px solid #ddd', borderRadius: '6px', outline: 'none', width: '100%', boxSizing: 'border-box', maxWidth: '500px' },
  categories: { display: 'flex', gap: '0.5rem', flexWrap: 'wrap' },
  catBtn: { padding: 'clamp(0.35rem, 1vw, 0.5rem) clamp(0.65rem, 2vw, 1rem)', border: '1px solid #ddd', borderRadius: '20px', backgroundColor: '#fff', cursor: 'pointer', fontSize: 'clamp(0.75rem, 1.8vw, 0.88rem)', color: '#444', transition: 'all 0.2s' },
  catBtnActive: { backgroundColor: '#222', color: '#fff', borderColor: '#222' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(clamp(200px, 25vw, 280px), 1fr))', gap: 'clamp(1rem, 2vw, 1.5rem)' },
  card: { backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', overflow: 'hidden', display: 'flex', flexDirection: 'column' },
  image: { width: '100%', height: 'clamp(150px, 20vw, 200px)', objectFit: 'cover', cursor: 'pointer' },
  cardBody: { padding: 'clamp(0.75rem, 2vw, 1rem)', display: 'flex', flexDirection: 'column', gap: '0.4rem', flex: 1 },
  name: { margin: 0, fontSize: 'clamp(0.9rem, 2vw, 1.1rem)', cursor: 'pointer', fontWeight: '600' },
  category: { margin: 0, fontSize: 'clamp(0.75rem, 1.5vw, 0.85rem)', color: '#888' },
  price: { margin: 0, fontSize: 'clamp(1rem, 2.5vw, 1.2rem)', fontWeight: 'bold', color: '#222' },
  stock: { margin: 0, fontSize: 'clamp(0.75rem, 1.5vw, 0.85rem)', color: '#27ae60' },
  button: { marginTop: 'auto', padding: 'clamp(0.5rem, 1.5vw, 0.65rem)', backgroundColor: '#222', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: 'clamp(0.8rem, 2vw, 0.9rem)' },
  center: { textAlign: 'center', marginTop: '2rem' },
}

export default Home