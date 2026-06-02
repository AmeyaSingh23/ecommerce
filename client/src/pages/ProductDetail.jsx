import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from '../api/axios'
import toast, { Toaster } from 'react-hot-toast'
import { useCart } from '../context/CartContext'

const BackIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
  </svg>
)

const ProductDetail = () => {
  const { id } = useParams()
  const [product, setProduct] = useState(null)
  const [quantity, setQuantity] = useState(1)
  const [loading, setLoading] = useState(true)
  const { addToCart } = useCart()
  const navigate = useNavigate()

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await axios.get(`/products/${id}`)
        setProduct(data)
      } catch {
        toast.error('Product not found')
        navigate('/')
      } finally {
        setLoading(false)
      }
    }
    fetch()
  }, [id])

  if (loading) {
    return (
      <div className="detail-page">
        <div style={{ display: 'flex', gap: '3rem', flexWrap: 'wrap' }}>
          <div className="skeleton" style={{ width: 'clamp(280px, 45vw, 520px)', aspectRatio: '4/3', borderRadius: 'var(--radius-xl)' }} />
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1rem', minWidth: '280px' }}>
            {[80, 40, 60, 100, 50].map((w, i) => (
              <div key={i} className="skeleton" style={{ height: '1.5rem', width: `${w}%`, borderRadius: 'var(--radius-sm)' }} />
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (!product) return null

  return (
    <div className="detail-page">
      <Toaster position="bottom-right" toastOptions={{ style: { fontFamily: 'DM Sans, sans-serif', fontSize: '0.9rem' } }} />

      <button onClick={() => navigate('/')} className="detail-back">
        <BackIcon /> Back to store
      </button>

      <div className="detail-layout">
        <img
          src={product.image || 'https://placehold.co/520x400/f5f0ea/c4a882?text=No+Image'}
          alt={product.name}
          className="detail-image"
        />

        <div className="detail-info">
          <span className="product-card__category">{product.category}</span>
          <h1 className="detail-name">{product.name}</h1>
          <p className="detail-price">₹{product.price.toLocaleString('en-IN')}</p>
          <p className="detail-description">{product.description}</p>

          <div>
            {product.stock > 0 ? (
              <span className="badge badge-success">✓ In Stock ({product.stock} available)</span>
            ) : (
              <span className="badge badge-danger">Out of Stock</span>
            )}
          </div>

          {product.stock > 0 && (
            <div className="detail-qty-row">
              <label className="form-label" style={{ margin: 0 }}>Quantity</label>
              <select
                className="select-field"
                style={{ width: 'auto' }}
                value={quantity}
                onChange={e => setQuantity(Number(e.target.value))}
              >
                {[...Array(Math.min(product.stock, 10)).keys()].map(i => (
                  <option key={i + 1} value={i + 1}>{i + 1}</option>
                ))}
              </select>
            </div>
          )}

          <button
            className="btn btn-primary btn-lg"
            disabled={product.stock === 0}
            onClick={() => { addToCart(product, quantity); toast.success('Added to cart!') }}
          >
            {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ProductDetail