import React, { createContext, useContext, useState, useEffect } from 'react'
import { CartItem, Product, RANK_DISCOUNTS } from '../types'
import { useAuth } from './AuthContext'

interface CartContextType {
  items: CartItem[]
  addToCart: (product: Product, quantity?: number) => void
  removeFromCart: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  subtotal: number
  discountPercentage: number
  discountAmount: number
  total: number
  itemCount: number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export const useCart = () => {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([])
  const { user } = useAuth()

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('aurasell-cart')
    if (savedCart) {
      try {
        setItems(JSON.parse(savedCart))
      } catch (error) {
        console.error('Error loading cart from localStorage:', error)
      }
    }
  }, [])

  // Save cart to localStorage whenever items change
  useEffect(() => {
    localStorage.setItem('aurasell-cart', JSON.stringify(items))
  }, [items])

  const addToCart = (product: Product, quantity = 1) => {
    setItems(prevItems => {
      const existingItem = prevItems.find(item => item.productId === product.id)
      
      if (existingItem) {
        return prevItems.map(item =>
          item.productId === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
      } else {
        return [...prevItems, { productId: product.id, product, quantity }]
      }
    })
  }

  const removeFromCart = (productId: string) => {
    setItems(prevItems => prevItems.filter(item => item.productId !== productId))
  }

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId)
      return
    }

    setItems(prevItems =>
      prevItems.map(item =>
        item.productId === productId ? { ...item, quantity } : item
      )
    )
  }

  const clearCart = () => {
    setItems([])
  }

  // Calculate totals
  const subtotal = items.reduce((sum, item) => sum + (item.product.basePrice * item.quantity), 0)
  
  const discountPercentage = user 
    ? RANK_DISCOUNTS.find(d => d.rank === user.rank)?.percentage || 0
    : 0
  
  const discountAmount = subtotal * (discountPercentage / 100)
  const total = subtotal - discountAmount
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0)

  const value = {
    items,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    subtotal,
    discountPercentage,
    discountAmount,
    total,
    itemCount
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}