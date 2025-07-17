import React, { useState } from 'react'
import { Crown, Users, Settings, TrendingUp, Package } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Badge } from '../components/ui/badge'
import { Button } from '../components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import { RANK_DISCOUNTS } from '../types'

// Mock admin data
const mockUsers = [
  { id: '1', name: 'Sarah Johnson', email: 'sarah@example.com', rank: 'Gold', totalOrders: 15, totalSpent: 2450.00 },
  { id: '2', name: 'Michael Chen', email: 'michael@example.com', rank: 'Platinum', totalOrders: 28, totalSpent: 4200.00 },
  { id: '3', name: 'Emma Davis', email: 'emma@example.com', rank: 'Silver', totalOrders: 8, totalSpent: 1200.00 },
  { id: '4', name: 'James Wilson', email: 'james@example.com', rank: 'Bronze', totalOrders: 3, totalSpent: 450.00 },
  { id: '5', name: 'Lisa Anderson', email: 'lisa@example.com', rank: 'Gold', totalOrders: 12, totalSpent: 1890.00 },
]

const getRankColor = (rank: string) => {
  switch (rank) {
    case 'Bronze': return 'bg-amber-600'
    case 'Silver': return 'bg-gray-400'
    case 'Gold': return 'bg-yellow-500'
    case 'Platinum': return 'bg-purple-600'
    default: return 'bg-gray-400'
  }
}

export const AdminPanel: React.FC = () => {
  const [users, setUsers] = useState(mockUsers)
  const [discountSettings, setDiscountSettings] = useState(RANK_DISCOUNTS)

  const updateUserRank = (userId: string, newRank: string) => {
    setUsers(prevUsers =>
      prevUsers.map(user =>
        user.id === userId ? { ...user, rank: newRank } : user
      )
    )
  }

  const updateDiscountPercentage = (rank: string, percentage: number) => {
    setDiscountSettings(prevSettings =>
      prevSettings.map(setting =>
        setting.rank === rank ? { ...setting, percentage } : setting
      )
    )
  }

  const stats = {
    totalUsers: users.length,
    totalRevenue: users.reduce((sum, user) => sum + user.totalSpent, 0),
    averageOrderValue: users.reduce((sum, user) => sum + user.totalSpent, 0) / users.reduce((sum, user) => sum + user.totalOrders, 0),
    rankDistribution: {
      Bronze: users.filter(u => u.rank === 'Bronze').length,
      Silver: users.filter(u => u.rank === 'Silver').length,
      Gold: users.filter(u => u.rank === 'Gold').length,
      Platinum: users.filter(u => u.rank === 'Platinum').length,
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-2">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <Crown className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Admin Panel</h1>
          </div>
          <p className="text-gray-600">Manage Beauty Business Owners and system settings</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total BBOs</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalUsers}</div>
              <p className="text-xs text-muted-foreground">Active Beauty Business Owners</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${stats.totalRevenue.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">Lifetime platform revenue</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Order Value</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${stats.averageOrderValue.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">Per order average</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Rank Distribution</CardTitle>
              <Crown className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span>Platinum: {stats.rankDistribution.Platinum}</span>
                  <span>Gold: {stats.rankDistribution.Gold}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span>Silver: {stats.rankDistribution.Silver}</span>
                  <span>Bronze: {stats.rankDistribution.Bronze}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="users" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="users">User Management</TabsTrigger>
            <TabsTrigger value="settings">Discount Settings</TabsTrigger>
          </TabsList>

          {/* User Management Tab */}
          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle>Beauty Business Owner Management</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {users.map((user) => (
                    <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="font-semibold text-gray-900">{user.name}</h3>
                          <Badge className={`${getRankColor(user.rank)} text-white`}>
                            {user.rank}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-1">{user.email}</p>
                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                          <span>{user.totalOrders} orders</span>
                          <span>${user.totalSpent.toLocaleString()} total spent</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <Select
                          value={user.rank}
                          onValueChange={(newRank) => updateUserRank(user.id, newRank)}
                        >
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Bronze">Bronze</SelectItem>
                            <SelectItem value="Silver">Silver</SelectItem>
                            <SelectItem value="Gold">Gold</SelectItem>
                            <SelectItem value="Platinum">Platinum</SelectItem>
                          </SelectContent>
                        </Select>
                        
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Discount Settings Tab */}
          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>Rank-Based Discount Configuration</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <p className="text-sm text-gray-600 mb-4">
                    Configure discount percentages for each BBO rank. Changes will apply to all future orders.
                  </p>
                  
                  {discountSettings.map((setting) => (
                    <div key={setting.rank} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <Badge className={`${getRankColor(setting.rank)} text-white w-20 justify-center`}>
                          {setting.rank}
                        </Badge>
                        <div>
                          <h3 className="font-medium text-gray-900">{setting.rank} Rank</h3>
                          <p className="text-sm text-gray-600">Current discount rate</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center space-x-2">
                          <Label htmlFor={`${setting.rank}-discount`} className="text-sm">
                            Discount %:
                          </Label>
                          <Input
                            id={`${setting.rank}-discount`}
                            type="number"
                            min="0"
                            max="50"
                            value={setting.percentage}
                            onChange={(e) => updateDiscountPercentage(setting.rank, parseInt(e.target.value) || 0)}
                            className="w-20"
                          />
                        </div>
                        <Button variant="outline" size="sm">
                          Save
                        </Button>
                      </div>
                    </div>
                  ))}
                  
                  <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-medium text-blue-900 mb-2">Current Configuration Summary</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      {discountSettings.map((setting) => (
                        <div key={setting.rank} className="text-center">
                          <div className="font-medium text-blue-800">{setting.rank}</div>
                          <div className="text-blue-600">{setting.percentage}% off</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}