import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from '../api/axios'
import toast, { Toaster } from 'react-hot-toast'
import { useCart } from '../context/CartContext'

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

  if (loading) return <p style={styles.center}>Loading...</p>
  if (!product) return null

  return (
    <div style={styles.page}>
      <Toaster />
      <button onClick={() => navigate('/')} style={styles.back}>← Back</button>
      <div style={styles.container}>
        <img
          src={product.image || 'https://placehold.co/500x400'}
          alt={product.name}
          style={styles.image}
        />
        <div style={styles.info}>
          <h1 style={styles.name}>{product.name}</h1>
          <p style={styles.category}>{product.category}</p>
          <p style={styles.price}>₹{product.price.toLocaleString()}</p>
          <p style={styles.description}>{product.description}</p>
          <p style={styles.stock}>
            {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
          </p>
          {product.stock > 0 && (
            <div style={styles.qtyRow}>
              <label style={styles.label}>Quantity:</label>
              <select
                style={styles.select}
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
            style={{ ...styles.button, opacity: product.stock === 0 ? 0.5 : 1 }}
            disabled={product.stock === 0}
            onClick={() => { addToCart(product, quantity); toast.success('Added to cart') }}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  )
}

const styles = {
  page: { padding: 'clamp(1rem, 3vw, 2rem) clamp(1rem, 4vw, 2rem)' },
  back: { background: 'none', border: 'none', cursor: 'pointer', fontSize: 'clamp(0.85rem, 2vw, 1rem)', marginBottom: '1rem', padding: 0 },
  container: { display: 'flex', gap: 'clamp(1.5rem, 4vw, 3rem)', flexWrap: 'wrap' },
  image: { width: 'clamp(280px, 45vw, 500px)', height: 'clamp(220px, 35vw, 400px)', objectFit: 'cover', borderRadius: '8px' },
  info: { flex: 1, minWidth: '250px', display: 'flex', flexDirection: 'column', gap: '0.75rem' },
  name: { margin: 0, fontSize: 'clamp(1.3rem, 3vw, 2rem)' },
  category: { margin: 0, color: '#888', fontSize: 'clamp(0.8rem, 2vw, 0.95rem)' },
  price: { margin: 0, fontSize: 'clamp(1.2rem, 3vw, 1.6rem)', fontWeight: 'bold', color: '#222' },
  description: { margin: 0, fontSize: 'clamp(0.85rem, 2vw, 1rem)', color: '#444', lineHeight: 1.6 },
  stock: { margin: 0, color: '#27ae60', fontSize: 'clamp(0.8rem, 2vw, 0.95rem)' },
  qtyRow: { display: 'flex', alignItems: 'center', gap: '1rem' },
  label: { fontSize: 'clamp(0.85rem, 2vw, 1rem)' },
  select: { padding: '0.4rem 0.6rem', fontSize: 'clamp(0.85rem, 2vw, 1rem)', borderRadius: '4px', border: '1px solid #ddd' },
  button: { padding: 'clamp(0.6rem, 1.5vw, 0.75rem) clamp(1rem, 3vw, 1.5rem)', backgroundColor: '#222', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: 'clamp(0.85rem, 2vw, 1rem)', width: 'fit-content' },
  center: { textAlign: 'center', marginTop: '2rem' },
}

export default ProductDetail