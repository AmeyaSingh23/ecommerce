import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from '../api/axios'
import toast, { Toaster } from 'react-hot-toast'
import { useCart } from '../context/CartContext'

const CATEGORIES = ['all', 'Electronics', 'Clothing', 'Books', 'Home', 'Sports', 'Other']

const SearchIcon = () => (
  <svg className="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
  </svg>
)

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
    <>
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            fontFamily: 'DM Sans, sans-serif',
            fontSize: '0.9rem',
          }
        }}
      />

      {/* Hero */}
      <div className="home-hero">
        <span className="home-hero__tagline">Curated for you</span>
        <h1 className="home-hero__title">Discover Something You'll Love</h1>
        <p className="home-hero__sub">Premium products across every category, delivered to your door.</p>
      </div>

      {/* Controls */}
      <div className="controls">
        <div className="input-with-icon" style={{ maxWidth: '480px' }}>
          <SearchIcon />
          <input
            className="input-field"
            type="text"
            placeholder="Search products…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            autoComplete="off"
          />
        </div>
        <div className="category-pills">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              className={`pill ${category === cat ? 'pill--active' : ''}`}
              onClick={() => setCategory(cat)}
            >
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Product Grid */}
      <div style={{ maxWidth: 'var(--page-max)', margin: '0 auto', padding: '0 var(--page-pad) var(--space-12)' }}>
        {loading ? (
          <div className="product-grid">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="skeleton skeleton-card" />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state__icon">🛍️</div>
            <p className="empty-state__title">No products found</p>
            <p className="empty-state__text">Try a different search term or browse a different category.</p>
          </div>
        ) : (
          <div className="product-grid">
            {products.map(product => (
              <article key={product._id} className="product-card">
                <div className="product-card__image-wrap">
                  <img
                    src={product.image || 'https://placehold.co/400x300/f5f0ea/c4a882?text=No+Image'}
                    alt={product.name}
                    className="product-card__image"
                    onClick={() => navigate(`/product/${product._id}`)}
                    loading="lazy"
                  />
                </div>
                <div className="product-card__body">
                  <span className="product-card__category">{product.category}</span>
                  <h3
                    className="product-card__name"
                    onClick={() => navigate(`/product/${product._id}`)}
                  >
                    {product.name}
                  </h3>
                  <p className="product-card__price">₹{product.price.toLocaleString('en-IN')}</p>
                  <p className={`product-card__stock ${product.stock === 0 ? 'product-card__stock--out' : ''}`}>
                    {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                  </p>
                  <div className="product-card__footer">
                    <button
                      className="btn btn-primary btn-full"
                      disabled={product.stock === 0}
                      onClick={() => { addToCart(product); toast.success(`${product.name} added to cart`) }}
                    >
                      {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </>
  )
}

export default Home