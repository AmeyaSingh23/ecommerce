import { useEffect, useState } from 'react'
import axios from '../api/axios'
import toast, { Toaster } from 'react-hot-toast'

const initialForm = { name: '', description: '', price: '', category: '', stock: '', image: '' }

const AdminProducts = () => {
  const [products, setProducts] = useState([])
  const [form, setForm] = useState(initialForm)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  const fetchProducts = async () => {
    try {
      const { data } = await axios.get('/products')
      setProducts(data)
    } catch {
      toast.error('Failed to load products')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchProducts() }, [])

  const submitHandler = async (e) => {
    e.preventDefault()
    const duplicate = products.find(p => p.name.toLowerCase() === form.name.toLowerCase())
    if (duplicate) {
      toast.error(`"${form.name}" already exists. Update its stock instead.`)
      return
    }
    setSubmitting(true)
    try {
      await axios.post('/products', {
        ...form,
        price: Number(form.price),
        stock: Number(form.stock),
      })
      toast.success('Product created')
      setForm(initialForm)
      fetchProducts()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create product')
    } finally {
      setSubmitting(false)
    }
  }

  const deleteHandler = async (id) => {
    if (!window.confirm('Delete this product?')) return
    try {
      await axios.delete(`/products/${id}`)
      toast.success('Product deleted')
      setProducts(prev => prev.filter(p => p._id !== id))
    } catch {
      toast.error('Failed to delete product')
    }
  }

  const updateStock = async (id, currentStock, delta) => {
    const newStock = currentStock + delta
    if (newStock < 0) {
      toast.error('Stock cannot be negative')
      return
    }
    try {
      const { data } = await axios.put(`/products/${id}`, { stock: newStock })
      setProducts(prev => prev.map(p => p._id === id ? { ...p, stock: data.stock } : p))
    } catch {
      toast.error('Failed to update stock')
    }
  }

  if (loading) return <p style={styles.center}>Loading...</p>

  return (
    <div style={styles.page}>
      <Toaster />
      <h1 style={styles.heading}>Manage Products</h1>

      <form onSubmit={submitHandler} style={styles.form}>
        <h2 style={styles.subheading}>Add New Product</h2>
        <div style={styles.grid}>
          {[
            { placeholder: 'Name', key: 'name', type: 'text' },
            { placeholder: 'Category', key: 'category', type: 'text' },
            { placeholder: 'Price', key: 'price', type: 'number' },
            { placeholder: 'Stock', key: 'stock', type: 'number' },
            { placeholder: 'Image URL (optional)', key: 'image', type: 'text' },
          ].map(field => (
            <input
              key={field.key}
              style={styles.input}
              type={field.type}
              placeholder={field.placeholder}
              value={form[field.key]}
              onChange={e => setForm(prev => ({ ...prev, [field.key]: e.target.value }))}
              required={field.key !== 'image'}
            />
          ))}
        </div>
        <textarea
          style={styles.textarea}
          placeholder="Description"
          value={form.description}
          onChange={e => setForm(prev => ({ ...prev, description: e.target.value }))}
          required
        />
        <button style={styles.button} type="submit" disabled={submitting}>
          {submitting ? 'Adding...' : 'Add Product'}
        </button>
      </form>

      <div style={styles.tableWrapper}>
        <table style={styles.table}>
          <thead>
            <tr>
              {['Name', 'Category', 'Price', 'Stock', 'Action'].map(h => (
                <th key={h} style={styles.th}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {products.map(product => (
              <tr key={product._id} style={styles.row}>
                <td style={styles.td}>{product.name}</td>
                <td style={styles.td}>{product.category}</td>
                <td style={styles.td}>₹{product.price.toLocaleString()}</td>
                <td style={styles.td}>
                  <div style={styles.stockControl}>
                    <button style={styles.stockBtn} onClick={() => updateStock(product._id, product.stock, -1)}>−</button>
                    <span style={styles.stockNum}>{product.stock}</span>
                    <button style={styles.stockBtn} onClick={() => updateStock(product._id, product.stock, 1)}>+</button>
                  </div>
                </td>
                <td style={styles.td}>
                  <button style={styles.deleteBtn} onClick={() => deleteHandler(product._id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

const styles = {
  page: { padding: 'clamp(1rem, 3vw, 2rem) clamp(1rem, 4vw, 2rem)' },
  heading: { fontSize: 'clamp(1.3rem, 3vw, 2rem)', marginBottom: '1.5rem' },
  form: { backgroundColor: '#fff', padding: 'clamp(1rem, 3vw, 1.5rem)', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.07)', marginBottom: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' },
  subheading: { margin: 0, fontSize: 'clamp(1rem, 2.5vw, 1.2rem)' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(clamp(160px, 20vw, 220px), 1fr))', gap: '0.75rem' },
  input: { padding: 'clamp(0.5rem, 1.5vw, 0.7rem)', fontSize: 'clamp(0.82rem, 2vw, 0.95rem)', border: '1px solid #ddd', borderRadius: '4px', outline: 'none' },
  textarea: { padding: 'clamp(0.5rem, 1.5vw, 0.7rem)', fontSize: 'clamp(0.82rem, 2vw, 0.95rem)', border: '1px solid #ddd', borderRadius: '4px', outline: 'none', minHeight: '80px', resize: 'vertical' },
  button: { padding: 'clamp(0.6rem, 1.5vw, 0.75rem)', backgroundColor: '#222', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: 'clamp(0.85rem, 2vw, 1rem)', alignSelf: 'flex-start' },
  tableWrapper: { overflowX: 'auto' },
  table: { width: '100%', borderCollapse: 'collapse', backgroundColor: '#fff', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.07)' },
  th: { textAlign: 'left', padding: 'clamp(0.6rem, 1.5vw, 0.85rem) clamp(0.75rem, 2vw, 1rem)', backgroundColor: '#222', color: '#fff', fontSize: 'clamp(0.8rem, 1.8vw, 0.9rem)', whiteSpace: 'nowrap' },
  row: { borderBottom: '1px solid #f0f0f0' },
  td: { padding: 'clamp(0.6rem, 1.5vw, 0.85rem) clamp(0.75rem, 2vw, 1rem)', fontSize: 'clamp(0.78rem, 1.8vw, 0.9rem)', color: '#333' },
  stockControl: { display: 'flex', alignItems: 'center', gap: '0.5rem' },
  stockBtn: { width: '28px', height: '28px', border: '1px solid #ddd', borderRadius: '4px', backgroundColor: '#f5f5f5', cursor: 'pointer', fontSize: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  stockNum: { minWidth: '30px', textAlign: 'center', fontWeight: '600' },
  deleteBtn: { backgroundColor: '#e74c3c', color: '#fff', border: 'none', padding: '0.3rem 0.75rem', borderRadius: '4px', cursor: 'pointer', fontSize: 'clamp(0.75rem, 1.8vw, 0.85rem)' },
  center: { textAlign: 'center', marginTop: '2rem' },
}

export default AdminProducts