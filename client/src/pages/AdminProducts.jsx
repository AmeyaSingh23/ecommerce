import { useEffect, useState } from 'react'
import axios from '../api/axios'
import toast, { Toaster } from 'react-hot-toast'

const initialForm = { name: '', description: '', price: '', category: '', stock: '', image: '' }
const CATEGORIES = ['Electronics', 'Clothing', 'Books', 'Home', 'Sports', 'Other']

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
    if (newStock < 0) { toast.error('Stock cannot be negative'); return }
    try {
      const { data } = await axios.put(`/products/${id}`, { stock: newStock })
      setProducts(prev => prev.map(p => p._id === id ? { ...p, stock: data.stock } : p))
    } catch {
      toast.error('Failed to update stock')
    }
  }

  return (
    <div className="page-wrapper">
      <Toaster position="bottom-right" toastOptions={{ style: { fontFamily: 'DM Sans, sans-serif', fontSize: '0.9rem' } }} />

      <div className="page-header">
        <p className="page-header__eyebrow">Admin</p>
        <h1 className="page-header__title">Manage Products</h1>
      </div>

      {/* Add Product Form */}
      <form onSubmit={submitHandler} className="admin-form">
        <h2 className="heading-sm">Add New Product</h2>
        <hr className="divider" />
        <div className="admin-form__grid">
          <div className="form-group">
            <label className="form-label">Name</label>
            <input className="input-field" type="text" placeholder="Product name" value={form.name}
              onChange={e => setForm(prev => ({ ...prev, name: e.target.value }))} required />
          </div>
          <div className="form-group">
            <label className="form-label">Category</label>
            <select className="select-field" value={form.category}
              onChange={e => setForm(prev => ({ ...prev, category: e.target.value }))} required>
              <option value="">Select category</option>
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Price (₹)</label>
            <input className="input-field" type="number" min="0" placeholder="0" value={form.price}
              onChange={e => setForm(prev => ({ ...prev, price: e.target.value }))} required />
          </div>
          <div className="form-group">
            <label className="form-label">Stock</label>
            <input className="input-field" type="number" min="0" placeholder="0" value={form.stock}
              onChange={e => setForm(prev => ({ ...prev, stock: e.target.value }))} required />
          </div>
          <div className="form-group" style={{ gridColumn: '1 / -1' }}>
            <label className="form-label">Image URL <span className="text-muted">(optional)</span></label>
            <input className="input-field" type="text" placeholder="https://..." value={form.image}
              onChange={e => setForm(prev => ({ ...prev, image: e.target.value }))} />
          </div>
        </div>
        <div className="form-group">
          <label className="form-label">Description</label>
          <textarea className="input-field" placeholder="Product description…" value={form.description}
            onChange={e => setForm(prev => ({ ...prev, description: e.target.value }))} required />
        </div>
        <div>
          <button className="btn btn-primary" type="submit" disabled={submitting}>
            {submitting ? 'Adding…' : 'Add Product'}
          </button>
        </div>
      </form>

      {/* Products Table */}
      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="skeleton" style={{ height: '52px', borderRadius: 'var(--radius-md)' }} />
          ))}
        </div>
      ) : (
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {products.map(product => (
                <tr key={product._id}>
                  <td style={{ fontWeight: 500 }}>{product.name}</td>
                  <td><span className="badge badge-neutral">{product.category}</span></td>
                  <td style={{ fontVariantNumeric: 'tabular-nums' }}>₹{product.price.toLocaleString('en-IN')}</td>
                  <td>
                    <div className="stock-control">
                      <button className="stock-btn" onClick={() => updateStock(product._id, product.stock, -1)}>−</button>
                      <span className="stock-num">{product.stock}</span>
                      <button className="stock-btn" onClick={() => updateStock(product._id, product.stock, 1)}>+</button>
                    </div>
                  </td>
                  <td>
                    <button className="btn btn-danger btn-sm" onClick={() => deleteHandler(product._id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default AdminProducts