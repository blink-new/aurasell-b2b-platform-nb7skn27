export interface User {
  id: string
  email: string
  name: string
  rank: 'Bronze' | 'Silver' | 'Gold' | 'Platinum'
  createdAt: string
  updatedAt: string
}

export interface Product {
  id: string
  name: string
  description: string
  basePrice: number
  images: string[]
  category: string
  sku: string
  variants?: ProductVariant[]
  stockStatus: 'In Stock' | 'Low Stock' | 'Out of Stock'
  stockQuantity: number
}

export interface ProductVariant {
  id: string
  name: string
  value: string
  price?: number
}

export interface CartItem {
  productId: string
  product: Product
  quantity: number
  selectedVariants?: { [key: string]: string }
}

export interface Order {
  id: string
  userId: string
  items: CartItem[]
  subtotal: number
  discountPercentage: number
  discountAmount: number
  total: number
  status: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled'
  createdAt: string
  vtexOrderId?: string
}

export interface RankDiscount {
  rank: 'Bronze' | 'Silver' | 'Gold' | 'Platinum'
  percentage: number
}

export const RANK_DISCOUNTS: RankDiscount[] = [
  { rank: 'Bronze', percentage: 15 },
  { rank: 'Silver', percentage: 25 },
  { rank: 'Gold', percentage: 35 },
  { rank: 'Platinum', percentage: 45 }
]