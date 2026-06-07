import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from '../api/axios'
import toast, { Toaster } from 'react-hot-toast'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'

const CATEGORIES = ['all', 'Electronics', 'Clothing', 'Books', 'Home', 'Sports', 'Other']

const SearchIcon = () => (
  <svg className="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
)

const HeartIcon = ({ filled }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
)

const ChevronLeft = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="15 18 9 12 15 6" />
  </svg>
)

const ChevronRight = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 18 15 12 9 6" />
  </svg>
)

const Pagination = ({ page, pages, onPageChange }) => {
  if (pages <= 1) return null

  // Build page number array with ellipsis logic
  const getPageNumbers = () => {
    if (pages <= 7) return Array.from({ length: pages }, (_, i) => i + 1)
    const nums = [1]
    if (page > 3) nums.push('...')
    for (let i = Math.max(2, page - 1); i <= Math.min(pages - 1, page + 1); i++) nums.push(i)
    if (page < pages - 2) nums.push('...')
    nums.push(pages)
    return nums
  }

  return (
    <div className="pagination">
      <button
        className="pagination__btn"
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1}
      >
        <ChevronLeft />
      </button>

      {getPageNumbers().map((num, i) =>
        num === '...' ? (
          <span key={`ellipsis-${i}`} className="pagination__ellipsis">…</span>
        ) : (
          <button
            key={num}
            className={`pagination__btn ${page === num ? 'pagination__btn--active' : ''}`}
            onClick={() => onPageChange(num)}
          >
            {num}
          </button>
        )
      )}

      <button
        className="pagination__btn"
        onClick={() => onPageChange(page + 1)}
        disabled={page === pages}
      >
        <ChevronRight />
      </button>
    </div>
  )
}

const Home = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('all')
  const [page, setPage] = useState(1)
  const [pages, setPages] = useState(1)
  const [total, setTotal] = useState(0)
  const { addToCart } = useCart()
  const { user } = useAuth()
  const [wishlistIds, setWishlistIds] = useState(new Set())
  const navigate = useNavigate()

  useEffect(() => {
    // Reset to page 1 when search/category changes
    setPage(1)
  }, [search, category])

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true)
      try {
        const { data } = await axios.get('/products', {
          params: { search, category, page }
        })
        setProducts(data.products)
        setPages(data.pages)
        setTotal(data.total)
      } catch {
        toast.error('Failed to load products')
      } finally {
        setLoading(false)
      }
    }

    const debounce = setTimeout(fetchProducts, 400)
    return () => clearTimeout(debounce)
  }, [search, category, page])

  useEffect(() => {
    if (!user) return
    axios.get('/wishlist').then(({ data }) => {
      setWishlistIds(new Set(data.map(p => p._id)))
    }).catch(() => { })
  }, [user])

  const toggleWishlist = async (e, productId) => {
    e.stopPropagation()
    if (!user) return toast.error('Please log in to save to wishlist')
    const isWishlisted = wishlistIds.has(productId)
    try {
      if (isWishlisted) {
        await axios.delete(`/wishlist/${productId}`)
        setWishlistIds(prev => { const s = new Set(prev); s.delete(productId); return s })
        toast.success('Removed from wishlist')
      } else {
        await axios.post(`/wishlist/${productId}`)
        setWishlistIds(prev => new Set(prev).add(productId))
        toast.success('Added to wishlist')
      }
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || 'Failed to update wishlist')
    }
  }

  const handlePageChange = (newPage) => {
    setPage(newPage)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <>
      <Toaster
        position="bottom-right"
        toastOptions={{ style: { fontFamily: 'DM Sans, sans-serif', fontSize: '0.9rem' } }}
      />

      {/* Hero */}
      <div className="home-hero">
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
          <>
            <p className="results-count">{total} product{total !== 1 ? 's' : ''} found</p>
            <div className="product-grid">
              {products.map(product => (
                <article key={product._id} className="product-card">
                  <div className="product-card__image-wrap">
                    <img
                      src={
                        product.image
                          ? product.image.startsWith('http')
                            ? product.image
                            : `http://localhost:5000${product.image}`
                          : 'https://placehold.co/400x300/f5f0ea/c4a882?text=No+Image'
                      }
                      alt={product.name}
                      className="product-card__image"
                      onClick={() => navigate(`/product/${product._id}`)}
                      loading="lazy"
                    />
                    <button
                      className={`wishlist-btn ${wishlistIds.has(product._id) ? 'wishlist-btn--active' : ''}`}
                      onClick={(e) => toggleWishlist(e, product._id)}
                      title={wishlistIds.has(product._id) ? 'Remove from wishlist' : 'Add to wishlist'}
                    >
                      <HeartIcon filled={wishlistIds.has(product._id)} />
                    </button>
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

            <Pagination page={page} pages={pages} onPageChange={handlePageChange} />
          </>
        )}
      </div>
    </>
  )
}

export default Home