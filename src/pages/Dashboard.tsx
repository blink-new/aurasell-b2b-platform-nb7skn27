import React, { useState, useEffect } from 'react'
import { Crown, Package, TrendingUp, Clock, Eye } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Badge } from '../components/ui/badge'
import { Button } from '../components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs'
import { useAuth } from '../contexts/AuthContext'
import { Order, RANK_DISCOUNTS } from '../types'
import { blink } from '../blink/client'

// Mock orders data
const mockOrders: Order[] = [
  {
    id: 'ORD-001',
    userId: 'user1',
    items: [],
    subtotal: 245.00,
    discountPercentage: 35,
    discountAmount: 85.75,
    total: 159.25,
    status: 'Delivered',
    createdAt: '2024-01-15T10:30:00Z',
    vtexOrderId: 'VTEX-12345'
  },
  {
    id: 'ORD-002',
    userId: 'user1',
    items: [],
    subtotal: 180.00,
    discountPercentage: 35,
    discountAmount: 63.00,
    total: 117.00,
    status: 'Shipped',
    createdAt: '2024-01-10T14:20:00Z',
    vtexOrderId: 'VTEX-12346'
  },
  {
    id: 'ORD-003',
    userId: 'user1',
    items: [],
    subtotal: 320.00,
    discountPercentage: 35,
    discountAmount: 112.00,
    total: 208.00,
    status: 'Processing',
    createdAt: '2024-01-08T09:15:00Z',
    vtexOrderId: 'VTEX-12347'
  }
]

const getRankColor = (rank: string) => {
  switch (rank) {
    case 'Bronze': return 'from-amber-500 to-amber-600'
    case 'Silver': return 'from-gray-400 to-gray-500'
    case 'Gold': return 'from-yellow-400 to-yellow-500'
    case 'Platinum': return 'from-purple-500 to-purple-600'
    default: return 'from-gray-400 to-gray-500'
  }
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Delivered': return 'bg-green-100 text-green-800'
    case 'Shipped': return 'bg-blue-100 text-blue-800'
    case 'Processing': return 'bg-yellow-100 text-yellow-800'
    case 'Pending': return 'bg-gray-100 text-gray-800'
    case 'Cancelled': return 'bg-red-100 text-red-800'
    default: return 'bg-gray-100 text-gray-800'
  }
}

export const Dashboard: React.FC = () => {
  const { user } = useAuth()
  const [orders, setOrders] = useState<Order[]>(mockOrders)
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalSaved: 0,
    averageOrderValue: 0
  })

  useEffect(() => {
    if (orders.length > 0) {
      const totalOrders = orders.length
      const totalSaved = orders.reduce((sum, order) => sum + order.discountAmount, 0)
      const averageOrderValue = orders.reduce((sum, order) => sum + order.total, 0) / totalOrders

      setStats({
        totalOrders,
        totalSaved,
        averageOrderValue
      })
    }
  }, [orders])

  if (!user) {
    return <div>Loading...</div>
  }

  const userDiscount = RANK_DISCOUNTS.find(d => d.rank === user.rank)

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome back, {user.name}!</h1>
          <p className="text-gray-600">Manage your orders and track your savings</p>
        </div>

        {/* Rank Card */}
        <Card className="mb-8 overflow-hidden">
          <div className={`bg-gradient-to-r ${getRankColor(user.rank)} p-6 text-white`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                  <Crown className="w-8 h-8" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">{user.rank} Member</h2>
                  <p className="text-white/90">Exclusive {userDiscount?.percentage}% discount on all orders</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold">{userDiscount?.percentage}%</div>
                <div className="text-white/90">Your Discount</div>
              </div>
            </div>
          </div>
        </Card>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalOrders}</div>
              <p className="text-xs text-muted-foreground">Lifetime orders placed</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Saved</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">${stats.totalSaved.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">With your {user.rank} discount</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Order</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${stats.averageOrderValue.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">Per order value</p>
            </CardContent>
          </Card>
        </div>

        {/* Orders Section */}
        <Card>
          <CardHeader>
            <CardTitle>Order History</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="all" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="all">All Orders</TabsTrigger>
                <TabsTrigger value="processing">Processing</TabsTrigger>
                <TabsTrigger value="shipped">Shipped</TabsTrigger>
                <TabsTrigger value="delivered">Delivered</TabsTrigger>
              </TabsList>

              <TabsContent value="all" className="space-y-4 mt-6">
                {orders.map((order) => (
                  <div key={order.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-4">
                        <div>
                          <h3 className="font-semibold text-gray-900">Order {order.id}</h3>
                          <p className="text-sm text-gray-500">
                            {new Date(order.createdAt).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </p>
                        </div>
                      </div>
                      <Badge className={getStatusColor(order.status)}>
                        {order.status}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Subtotal:</span>
                        <div className="font-medium">${order.subtotal.toFixed(2)}</div>
                      </div>
                      <div>
                        <span className="text-gray-500">Discount:</span>
                        <div className="font-medium text-green-600">-${order.discountAmount.toFixed(2)}</div>
                      </div>
                      <div>
                        <span className="text-gray-500">Total:</span>
                        <div className="font-bold">${order.total.toFixed(2)}</div>
                      </div>
                      <div className="flex justify-end">
                        <Button variant="outline" size="sm">
                          <Eye className="w-4 h-4 mr-2" />
                          View Details
                        </Button>
                      </div>
                    </div>

                    {order.vtexOrderId && (
                      <div className="mt-3 pt-3 border-t">
                        <span className="text-xs text-gray-500">VTEX Order ID: {order.vtexOrderId}</span>
                      </div>
                    )}
                  </div>
                ))}
              </TabsContent>

              <TabsContent value="processing" className="space-y-4 mt-6">
                {orders.filter(order => order.status === 'Processing').map((order) => (
                  <div key={order.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold">Order {order.id}</h3>
                        <p className="text-sm text-gray-500">Processing since {new Date(order.createdAt).toLocaleDateString()}</p>
                      </div>
                      <Badge className={getStatusColor(order.status)}>
                        {order.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </TabsContent>

              <TabsContent value="shipped" className="space-y-4 mt-6">
                {orders.filter(order => order.status === 'Shipped').map((order) => (
                  <div key={order.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold">Order {order.id}</h3>
                        <p className="text-sm text-gray-500">Shipped on {new Date(order.createdAt).toLocaleDateString()}</p>
                      </div>
                      <Badge className={getStatusColor(order.status)}>
                        {order.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </TabsContent>

              <TabsContent value="delivered" className="space-y-4 mt-6">
                {orders.filter(order => order.status === 'Delivered').map((order) => (
                  <div key={order.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold">Order {order.id}</h3>
                        <p className="text-sm text-gray-500">Delivered on {new Date(order.createdAt).toLocaleDateString()}</p>
                      </div>
                      <Badge className={getStatusColor(order.status)}>
                        {order.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}