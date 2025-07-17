import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CreditCard, Lock, CheckCircle, ArrowLeft } from 'lucide-react'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Badge } from '../components/ui/badge'
import { Separator } from '../components/ui/separator'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import { useCart } from '../contexts/CartContext'
import { useAuth } from '../contexts/AuthContext'
import { blink } from '../blink/client'

export const CheckoutPage: React.FC = () => {
  const navigate = useNavigate()
  const { items, subtotal, discountPercentage, discountAmount, total, clearCart } = useCart()
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [orderPlaced, setOrderPlaced] = useState(false)
  const [orderId, setOrderId] = useState<string>('')

  const [billingInfo, setBillingInfo] = useState({
    firstName: '',
    lastName: '',
    email: user?.email || '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States'
  })

  const handleInputChange = (field: string, value: string) => {
    setBillingInfo(prev => ({ ...prev, [field]: value }))
  }

  const handlePlaceOrder = async () => {
    if (!user) return

    setLoading(true)
    try {
      // Simulate order processing
      await new Promise(resolve => setTimeout(resolve, 2000))

      // In a real implementation, this would:
      // 1. Validate billing information
      // 2. Process payment
      // 3. Create order in VTEX via backend API
      // 4. Send order confirmation email

      const newOrderId = `ORD-${Date.now()}`
      
      // Create order record (in real app, this would be done via backend)
      const orderData = {
        id: newOrderId,
        userId: user.id,
        items: JSON.stringify(items),
        subtotal,
        discountPercentage,
        discountAmount,
        total,
        status: 'Processing' as const,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        vtexOrderId: `VTEX-${Date.now()}`
      }

      setOrderId(newOrderId)
      setOrderPlaced(true)
      clearCart()
    } catch (error) {
      console.error('Error placing order:', error)
    } finally {
      setLoading(false)
    }
  }

  if (items.length === 0 && !orderPlaced) {
    navigate('/catalog')
    return null
  }

  if (orderPlaced) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card className="text-center">
            <CardContent className="pt-8 pb-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Order Confirmed!</h1>
              <p className="text-gray-600 mb-6">
                Thank you for your order. We'll send you a confirmation email shortly.
              </p>
              
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <p className="text-sm text-gray-600 mb-1">Order Number</p>
                <p className="font-mono text-lg font-semibold">{orderId}</p>
              </div>

              <div className="space-y-3 mb-8">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal:</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm text-green-600">
                  <span>Your {user?.rank} Discount ({discountPercentage}%):</span>
                  <span>-${discountAmount.toFixed(2)}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-semibold">
                  <span>Total Paid:</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button onClick={() => navigate('/dashboard')} className="bg-purple-600 hover:bg-purple-700">
                  View Order Status
                </Button>
                <Button variant="outline" onClick={() => navigate('/catalog')}>
                  Continue Shopping
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/cart')}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Cart
          </Button>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Checkout</h1>
          <p className="text-gray-600">Complete your order with exclusive {user?.rank} pricing</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Billing Information */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CreditCard className="w-5 h-5 mr-2" />
                  Billing Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      value={billingInfo.firstName}
                      onChange={(e) => handleInputChange('firstName', e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      value={billingInfo.lastName}
                      onChange={(e) => handleInputChange('lastName', e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={billingInfo.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={billingInfo.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    value={billingInfo.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      value={billingInfo.city}
                      onChange={(e) => handleInputChange('city', e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="state">State</Label>
                    <Input
                      id="state"
                      value={billingInfo.state}
                      onChange={(e) => handleInputChange('state', e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="zipCode">ZIP Code</Label>
                  <Input
                    id="zipCode"
                    value={billingInfo.zipCode}
                    onChange={(e) => handleInputChange('zipCode', e.target.value)}
                    required
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div>
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

                {/* Order Items */}
                <div className="space-y-3">
                  <h4 className="font-medium text-gray-900">Items ({items.length})</h4>
                  {items.map((item) => (
                    <div key={item.productId} className="flex items-center gap-3 p-2 border rounded">
                      <img
                        src={item.product.images[0]}
                        alt={item.product.name}
                        className="w-12 h-12 object-cover rounded"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {item.product.name}
                        </p>
                        <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                      </div>
                      <p className="text-sm font-medium">
                        ${(item.product.basePrice * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>

                <Separator />

                {/* Pricing */}
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium">${subtotal.toFixed(2)}</span>
                  </div>

                  {discountPercentage > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Your {user?.rank} Discount ({discountPercentage}%)</span>
                      <span className="font-medium">-${discountAmount.toFixed(2)}</span>
                    </div>
                  )}

                  <Separator />

                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>

                {/* Savings Display */}
                {discountAmount > 0 && (
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <p className="text-sm text-green-800">
                      🎉 You're saving <span className="font-bold">${discountAmount.toFixed(2)}</span> with your {user?.rank} rank!
                    </p>
                  </div>
                )}

                {/* Place Order Button */}
                <Button
                  onClick={handlePlaceOrder}
                  disabled={loading}
                  className="w-full bg-purple-600 hover:bg-purple-700 h-12"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Processing Order...
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4 mr-2" />
                      Place Order - ${total.toFixed(2)}
                    </>
                  )}
                </Button>

                <div className="text-center">
                  <p className="text-xs text-gray-500 flex items-center justify-center">
                    <Lock className="w-3 h-3 mr-1" />
                    Secure checkout powered by VTEX
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}