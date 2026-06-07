import { useEffect, useState } from 'react'
import axios from '../api/axios'
import toast, { Toaster } from 'react-hot-toast'

const SearchIcon = () => (
  <svg className="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
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
      <button className="pagination__btn" onClick={() => onPageChange(page - 1)} disabled={page === 1}><ChevronLeft /></button>
      {getPageNumbers().map((num, i) =>
        num === '...' ? <span key={`ellipsis-${i}`} className="pagination__ellipsis">…</span> :
        <button key={num} className={`pagination__btn ${page === num ? 'pagination__btn--active' : ''}`} onClick={() => onPageChange(num)}>{num}</button>
      )}
      <button className="pagination__btn" onClick={() => onPageChange(page + 1)} disabled={page === pages}><ChevronRight /></button>
    </div>
  )
}

const initialForm = { name: '', description: '', price: '', category: '', stock: '', imageFile: null }
const CATEGORIES = ['Electronics', 'Clothing', 'Books', 'Home', 'Sports', 'Other']

const AdminProducts = () => {
  const [products, setProducts] = useState([])
  const [form, setForm] = useState(initialForm)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [pages, setPages] = useState(1)
  const [total, setTotal] = useState(0)

  useEffect(() => {
    setPage(1)
  }, [search])

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true)
      try {
        const { data } = await axios.get('/products', {
          params: { search, page }
        })
        setProducts(data.products || data)
        setPages(data.pages || 1)
        setTotal(data.total || 0)
      } catch {
        toast.error('Failed to load products')
      } finally {
        setLoading(false)
      }
    }
    const debounce = setTimeout(fetchProducts, 400)
    return () => clearTimeout(debounce)
  }, [search, page])

  const handlePageChange = (newPage) => {
    setPage(newPage)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const submitHandler = async (e) => {
    e.preventDefault()
    const duplicate = products.find(p => p.name.toLowerCase() === form.name.toLowerCase())
    if (duplicate) {
      toast.error(`"${form.name}" already exists. Update its stock instead.`)
      return
    }
    setSubmitting(true)
    try {
      let imageUrl = ''

      if (form.imageFile) {
        const formData = new FormData()
        formData.append('image', form.imageFile)
        const { data: uploadData } = await axios.post('/products/upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        })
        imageUrl = uploadData.imageUrl
      }

      await axios.post('/products', {
        name: form.name,
        description: form.description,
        price: Number(form.price),
        stock: Number(form.stock),
        category: form.category,
        image: imageUrl,
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
            <label className="form-label">Product Image <span className="text-muted">(optional, max 5MB)</span></label>
            <input
              className="input-field"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={e => setForm(prev => ({ ...prev, imageFile: e.target.files[0] || null }))}
            />
            {form.imageFile && (
              <img
                src={URL.createObjectURL(form.imageFile)}
                alt="preview"
                className="upload-preview"
              />
            )}
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

      <hr className="divider" style={{ margin: 'var(--space-8) 0' }} />

      {/* Products Table Area */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)' }}>
        <h2 className="heading-sm">Existing Products ({total})</h2>
        <div className="input-with-icon" style={{ width: '300px' }}>
          <SearchIcon />
          <input
            className="input-field"
            type="text"
            placeholder="Search products…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="skeleton" style={{ height: '52px', borderRadius: 'var(--radius-md)' }} />
          ))}
        </div>
      ) : (
        <>
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
        <Pagination page={page} pages={pages} onPageChange={handlePageChange} />
        </>
      )}
    </div>
  )
}

export default AdminProducts
