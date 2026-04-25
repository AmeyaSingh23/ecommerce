import { createContext, useContext, useState } from 'react'

const CartContext = createContext()

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    const stored = localStorage.getItem('cart')
    return stored ? JSON.parse(stored) : []
  })

  const saveCart = (items) => {
    setCartItems(items)
    localStorage.setItem('cart', JSON.stringify(items))
  }

  const addToCart = (product, quantity = 1) => {
    setCartItems(prev => {
      const exists = prev.find(item => item.product === product._id)
      let updated
      if (exists) {
        updated = prev.map(item =>
          item.product === product._id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
      } else {
        updated = [...prev, {
          product: product._id,
          name: product.name,
          image: product.image,
          price: product.price,
          stock: product.stock,
          quantity,
        }]
      }
      localStorage.setItem('cart', JSON.stringify(updated))
      return updated
    })
  }

  const removeFromCart = (productId) => {
    const updated = cartItems.filter(item => item.product !== productId)
    saveCart(updated)
  }

  const updateQuantity = (productId, quantity) => {
    const updated = cartItems.map(item =>
      item.product === productId ? { ...item, quantity } : item
    )
    saveCart(updated)
  }

  const clearCart = () => saveCart([])

  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0)
  const totalPrice = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0)

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, updateQuantity, clearCart, totalItems, totalPrice }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => useContext(CartContext)