import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from '../api/axios'
import toast, { Toaster } from 'react-hot-toast'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'

const BackIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" />
  </svg>
)

const StarIcon = ({ filled }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
)

const StarRating = ({ value, onChange }) => (
  <div className="star-rating">
    {[1, 2, 3, 4, 5].map(star => (
      <button
        key={star}
        type="button"
        className={`star-btn ${star <= value ? 'star-btn--active' : ''}`}
        onClick={() => onChange && onChange(star)}
      >
        <StarIcon filled={star <= value} />
      </button>
    ))}
  </div>
)

const ProductDetail = () => {
  const { id } = useParams()
  const [product, setProduct] = useState(null)
  const [quantity, setQuantity] = useState(1)
  const [loading, setLoading] = useState(true)
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const { addToCart } = useCart()
  const { user } = useAuth()
  const navigate = useNavigate()

  const fetchProduct = async () => {
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

  useEffect(() => { fetchProduct() }, [id])

  const submitReview = async (e) => {
    e.preventDefault()
    if (rating === 0) return toast.error('Please select a star rating')
    if (!comment.trim()) return toast.error('Please write a comment')
    setSubmitting(true)
    try {
      await axios.post(`/products/${id}/reviews`, { rating, comment })
      toast.success('Review submitted!')
      setRating(0)
      setComment('')
      fetchProduct() // refresh to show new review + updated avg
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit review')
    } finally {
      setSubmitting(false)
    }
  }

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

  const alreadyReviewed = user && product.reviews?.some(r => r.user === user._id)

  return (
    <div className="detail-page">
      <Toaster position="bottom-right" toastOptions={{ style: { fontFamily: 'DM Sans, sans-serif', fontSize: '0.9rem' } }} />

      <button onClick={() => navigate('/')} className="detail-back">
        <BackIcon /> Back to store
      </button>

      <div className="detail-layout">
        <img
          src={
            product.image
              ? `http://localhost:5000${product.image}`
              : 'https://placehold.co/520x400/f5f0ea/c4a882?text=No+Image'
          }
          alt={product.name}
          className="detail-image"
        />

        <div className="detail-info">
          <span className="product-card__category">{product.category}</span>
          <h1 className="detail-name">{product.name}</h1>

          <div className="detail-rating-row">
            <StarRating value={Math.round(product.rating)} />
            <span className="detail-rating-text">
              {product.rating > 0 ? product.rating.toFixed(1) : 'No ratings'} · {product.numReviews} {product.numReviews === 1 ? 'review' : 'reviews'}
            </span>
          </div>

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

      {/* ── Reviews Section ── */}
      <div className="reviews-section">
        <h2 className="reviews-heading">Customer Reviews</h2>
        <hr className="divider" />

        {product.reviews?.length === 0 && (
          <p className="reviews-empty">No reviews yet. Be the first!</p>
        )}

        <div className="reviews-list">
          {product.reviews?.map(review => (
            <div key={review._id} className="review-card">
              <div className="review-card__header">
                <span className="review-card__author">{review.name}</span>
                <StarRating value={review.rating} />
                <span className="review-card__date">
                  {new Date(review.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                </span>
              </div>
              <p className="review-card__comment">{review.comment}</p>
            </div>
          ))}
        </div>

        {/* Submit form — only for logged-in users who haven't reviewed yet */}
        {user ? (
          alreadyReviewed ? (
            <p className="reviews-already-done">You have already reviewed this product.</p>
          ) : (
            <div className="review-form-wrapper">
              <h3 className="review-form__title">Write a Review</h3>
              <form onSubmit={submitReview} className="review-form">
                <div className="form-group">
                  <label className="form-label">Your Rating</label>
                  <StarRating value={rating} onChange={setRating} />
                </div>
                <div className="form-group">
                  <label className="form-label">Comment</label>
                  <textarea
                    className="input-field"
                    rows={4}
                    placeholder="Share your experience with this product..."
                    value={comment}
                    onChange={e => setComment(e.target.value)}
                  />
                </div>
                <button className="btn btn-primary" type="submit" disabled={submitting}>
                  {submitting ? 'Submitting...' : 'Submit Review'}
                </button>
              </form>
            </div>
          )
        ) : (
          <p className="reviews-login-prompt">
            <button className="btn-link" onClick={() => navigate('/login')}>Log in</button> to leave a review.
          </p>
        )}
      </div>
    </div>
  )
}

export default ProductDetail