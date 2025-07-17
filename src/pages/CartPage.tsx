import React from 'react'
import { Link } from 'react-router-dom'
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Badge } from '../components/ui/badge'
import { Separator } from '../components/ui/separator'
import { useCart } from '../contexts/CartContext'
import { useAuth } from '../contexts/AuthContext'

export const CartPage: React.FC = () => {
  const { items, updateQuantity, removeFromCart, subtotal, discountPercentage, discountAmount, total } = useCart()
  const { user } = useAuth()

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-16">
            <ShoppingBag className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
            <p className="text-gray-600 mb-8">Start shopping to add products to your cart</p>
            <Link to="/catalog">
              <Button className="bg-purple-600 hover:bg-purple-700">
                Browse Products
              </Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Shopping Cart</h1>
          <p className="text-gray-600">Review your items and proceed to checkout</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Cart Items ({items.length})</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {items.map((item) => (
                  <div key={item.productId} className="flex items-center gap-4 p-4 border rounded-lg">
                    {/* Product Image */}
                    <div className="w-20 h-20 flex-shrink-0 overflow-hidden rounded-lg bg-gray-100">
                      <img
                        src={item.product.images[0]}
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Product Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900">{item.product.name}</h3>
                      <p className="text-sm text-gray-600 mb-1">{item.product.description}</p>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-500">SKU: {item.product.sku}</span>
                        <Badge className="bg-green-100 text-green-800">
                          {item.product.stockStatus}
                        </Badge>
                      </div>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                      >
                        <Minus className="w-4 h-4" />
                      </Button>
                      <span className="w-12 text-center font-medium">{item.quantity}</span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>

                    {/* Price */}
                    <div className="text-right">
                      <div className="font-semibold text-gray-900">
                        ${(item.product.basePrice * item.quantity).toFixed(2)}
                      </div>
                      <div className="text-sm text-gray-500">
                        ${item.product.basePrice.toFixed(2)} each
                      </div>
                    </div>

                    {/* Remove Button */}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFromCart(item.productId)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* User Rank */}
                {user && (
                  <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                    <span className="text-sm font-medium text-purple-900">Your Rank</span>
                    <Badge className="bg-purple-600 text-white">
                      {user.rank}
                    </Badge>
                  </div>
                )}

                {/* Subtotal */}
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">${subtotal.toFixed(2)}</span>
                </div>

                {/* Discount */}
                {discountPercentage > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Your {user?.rank} Discount ({discountPercentage}%)</span>
                    <span className="font-medium">-${discountAmount.toFixed(2)}</span>
                  </div>
                )}

                <Separator />

                {/* Total */}
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>

                {/* Savings Display */}
                {discountAmount > 0 && (
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <p className="text-sm text-green-800">
                      🎉 You're saving <span className="font-bold">${discountAmount.toFixed(2)}</span> with your {user?.rank} rank!
                    </p>
                  </div>
                )}

                {/* Checkout Button */}
                <Link to="/checkout" className="block">
                  <Button className="w-full bg-purple-600 hover:bg-purple-700 h-12">
                    Proceed to Checkout
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>

                {/* Continue Shopping */}
                <Link to="/catalog">
                  <Button variant="outline" className="w-full">
                    Continue Shopping
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}