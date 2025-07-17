import { useState, useEffect } from 'react'
import { Product } from '../types'

// Enhanced mock data with more beauty products for a complete catalog
const mockProducts: Product[] = [
  {
    id: 'prod_1',
    name: 'Radiant Glow Foundation',
    description: 'Full coverage foundation with SPF 30 for all-day radiance',
    basePrice: 45.00,
    images: ['https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400'],
    category: 'Makeup',
    sku: 'RGF-001',
    stockStatus: 'In Stock',
    stockQuantity: 150
  },
  {
    id: 'prod_2',
    name: 'Hydrating Serum Essence',
    description: 'Intensive hydrating serum with hyaluronic acid',
    basePrice: 65.00,
    images: ['https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400'],
    category: 'Skincare',
    sku: 'HSE-002',
    stockStatus: 'In Stock',
    stockQuantity: 89
  },
  {
    id: 'prod_3',
    name: 'Velvet Matte Lipstick',
    description: 'Long-lasting matte lipstick in 12 stunning shades',
    basePrice: 28.00,
    images: ['https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=400'],
    category: 'Makeup',
    sku: 'VML-003',
    stockStatus: 'Low Stock',
    stockQuantity: 12
  },
  {
    id: 'prod_4',
    name: 'Luxury Face Cream',
    description: 'Anti-aging face cream with peptides and retinol',
    basePrice: 89.00,
    images: ['https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400'],
    category: 'Skincare',
    sku: 'LFC-004',
    stockStatus: 'In Stock',
    stockQuantity: 67
  },
  {
    id: 'prod_5',
    name: 'Enchanted Perfume',
    description: 'Floral fragrance with notes of jasmine and rose',
    basePrice: 120.00,
    images: ['https://images.unsplash.com/photo-1541643600914-78b084683601?w=400'],
    category: 'Fragrance',
    sku: 'EP-005',
    stockStatus: 'In Stock',
    stockQuantity: 34
  },
  {
    id: 'prod_6',
    name: 'Brightening Eye Cream',
    description: 'Reduces dark circles and puffiness around eyes',
    basePrice: 52.00,
    images: ['https://images.unsplash.com/photo-1570194065650-d99fb4bedf0a?w=400'],
    category: 'Skincare',
    sku: 'BEC-006',
    stockStatus: 'Out of Stock',
    stockQuantity: 0
  },
  {
    id: 'prod_7',
    name: 'Volumizing Mascara',
    description: 'Waterproof mascara for dramatic volume and length',
    basePrice: 32.00,
    images: ['https://images.unsplash.com/photo-1631214540242-6b5b8d6b6c3c?w=400'],
    category: 'Makeup',
    sku: 'VM-007',
    stockStatus: 'In Stock',
    stockQuantity: 95
  },
  {
    id: 'prod_8',
    name: 'Gentle Cleansing Oil',
    description: 'Deep cleansing oil that removes makeup and impurities',
    basePrice: 38.00,
    images: ['https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400'],
    category: 'Skincare',
    sku: 'GCO-008',
    stockStatus: 'In Stock',
    stockQuantity: 78
  },
  {
    id: 'prod_9',
    name: 'Rose Gold Highlighter',
    description: 'Luminous highlighter for a natural glow',
    basePrice: 35.00,
    images: ['https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=400'],
    category: 'Makeup',
    sku: 'RGH-009',
    stockStatus: 'In Stock',
    stockQuantity: 42
  },
  {
    id: 'prod_10',
    name: 'Vitamin C Serum',
    description: 'Brightening serum with 20% vitamin C',
    basePrice: 58.00,
    images: ['https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=400'],
    category: 'Skincare',
    sku: 'VCS-010',
    stockStatus: 'In Stock',
    stockQuantity: 73
  },
  {
    id: 'prod_11',
    name: 'Luxury Eyeshadow Palette',
    description: '12-shade eyeshadow palette with matte and shimmer finishes',
    basePrice: 68.00,
    images: ['https://images.unsplash.com/photo-1583241800698-9c2e0c8e4b8e?w=400'],
    category: 'Makeup',
    sku: 'LEP-011',
    stockStatus: 'In Stock',
    stockQuantity: 56
  },
  {
    id: 'prod_12',
    name: 'Nourishing Night Cream',
    description: 'Rich night cream with ceramides and peptides',
    basePrice: 75.00,
    images: ['https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400'],
    category: 'Skincare',
    sku: 'NNC-012',
    stockStatus: 'In Stock',
    stockQuantity: 38
  },
  {
    id: 'prod_13',
    name: 'Citrus Body Mist',
    description: 'Refreshing body mist with citrus and bergamot',
    basePrice: 42.00,
    images: ['https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=400'],
    category: 'Fragrance',
    sku: 'CBM-013',
    stockStatus: 'Low Stock',
    stockQuantity: 8
  },
  {
    id: 'prod_14',
    name: 'Precision Eyeliner',
    description: 'Waterproof liquid eyeliner with ultra-fine tip',
    basePrice: 24.00,
    images: ['https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400'],
    category: 'Makeup',
    sku: 'PE-014',
    stockStatus: 'In Stock',
    stockQuantity: 112
  },
  {
    id: 'prod_15',
    name: 'Exfoliating Face Scrub',
    description: 'Gentle exfoliating scrub with natural bamboo particles',
    basePrice: 36.00,
    images: ['https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400'],
    category: 'Skincare',
    sku: 'EFS-015',
    stockStatus: 'In Stock',
    stockQuantity: 64
  }
]

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true)
        // Simulate API call delay for realistic loading experience
        await new Promise(resolve => setTimeout(resolve, 800))
        
        // In a real implementation, this would fetch from VTEX API via backend
        // For now, we'll use enhanced mock data
        setProducts(mockProducts)
        setError(null)
      } catch (err) {
        setError('Failed to fetch products from VTEX catalog')
        console.error('Error fetching products:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  const refetchProducts = async () => {
    await fetchProducts()
  }

  return { products, loading, error, refetch: refetchProducts }
}