import { useEffect, useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from '../api/axios'
import toast, { Toaster } from 'react-hot-toast'

const SearchIcon = () => (
    <svg className="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
)

const HeartFilledIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
)

const PAGE_SIZE = 8

const Wishlist = () => {
    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')
    const [page, setPage] = useState(1)
    const navigate = useNavigate()

    const fetchWishlist = async () => {
        setLoading(true)
        try {
            const { data } = await axios.get('/wishlist')
            setProducts(data)
        } catch {
            toast.error('Failed to load wishlist')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => { fetchWishlist() }, [])

    const removeFromWishlist = async (productId) => {
        try {
            await axios.delete(`/wishlist/${productId}`)
            setProducts(prev => prev.filter(p => p._id !== productId))
            toast.success('Removed from wishlist')
        } catch {
            toast.error('Failed to remove')
        }
    }

    // client-side search + pagination since wishlist is per-user and typically small
    const filtered = useMemo(() => {
        if (!search.trim()) return products
        return products.filter(p =>
            p.name.toLowerCase().includes(search.toLowerCase()) ||
            p.category.toLowerCase().includes(search.toLowerCase())
        )
    }, [products, search])

    const pages = Math.ceil(filtered.length / PAGE_SIZE)
    const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

    useEffect(() => { setPage(1) }, [search])

    return (
        <div style={{ maxWidth: 'var(--page-max)', margin: '0 auto', padding: '0 var(--page-pad) var(--space-12)' }}>
            <Toaster position="bottom-right" toastOptions={{ style: { fontFamily: 'DM Sans, sans-serif', fontSize: '0.9rem' } }} />

            <div className="page-header">
                <p className="page-header__eyebrow">My Account</p>
                <h1 className="page-header__title">Wishlist</h1>
            </div>

            {!loading && products.length > 0 && (
                <div className="controls" style={{ marginBottom: 'var(--space-6)' }}>
                    <div className="input-with-icon" style={{ maxWidth: '400px' }}>
                        <SearchIcon />
                        <input
                            className="input-field"
                            type="text"
                            placeholder="Search wishlist…"
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            autoComplete="off"
                        />
                    </div>
                </div>
            )}

            {loading ? (
                <div className="product-grid">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="skeleton skeleton-card" />
                    ))}
                </div>
            ) : products.length === 0 ? (
                <div className="empty-state">
                    <div className="empty-state__icon">🤍</div>
                    <p className="empty-state__title">Your wishlist is empty</p>
                    <p className="empty-state__text">Save products you love by clicking the heart icon.</p>
                    <button className="btn btn-primary" onClick={() => navigate('/')}>Browse Products</button>
                </div>
            ) : filtered.length === 0 ? (
                <div className="empty-state">
                    <div className="empty-state__icon">🔍</div>
                    <p className="empty-state__title">No results</p>
                    <p className="empty-state__text">Try a different search term.</p>
                </div>
            ) : (
                <>
                    <p className="results-count">{filtered.length} item{filtered.length !== 1 ? 's' : ''}</p>
                    <div className="product-grid">
                        {paginated.map(product => (
                            <article key={product._id} className="product-card">
                                <div className="product-card__image-wrap">
                                    <img
                                        src={
                                            product.image
                                                ? product.image.startsWith('http')
                                                    ? product.image
                                                    : `${import.meta.env.VITE_API_URL?.replace('/api', '')}${product.image}`
                                                : 'https://placehold.co/400x300/f5f0ea/c4a882?text=No+Image'
                                        }
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
                                    <div className="product-card__footer" style={{ display: 'flex', gap: 'var(--space-2)' }}>
                                        <button
                                            className="btn btn-primary btn-full"
                                            disabled={product.stock === 0}
                                            onClick={() => navigate(`/product/${product._id}`)}
                                        >
                                            View Product
                                        </button>
                                        <button
                                            className="btn btn-danger"
                                            onClick={() => removeFromWishlist(product._id)}
                                            title="Remove from wishlist"
                                        >
                                            <HeartFilledIcon />
                                        </button>
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>

                    {pages > 1 && (
                        <div className="pagination">
                            <button className="pagination__btn" onClick={() => setPage(p => p - 1)} disabled={page === 1}>‹</button>
                            {Array.from({ length: pages }, (_, i) => i + 1).map(num => (
                                <button
                                    key={num}
                                    className={`pagination__btn ${page === num ? 'pagination__btn--active' : ''}`}
                                    onClick={() => setPage(num)}
                                >
                                    {num}
                                </button>
                            ))}
                            <button className="pagination__btn" onClick={() => setPage(p => p + 1)} disabled={page === pages}>›</button>
                        </div>
                    )}
                </>
            )}
        </div>
    )
}

export default Wishlist