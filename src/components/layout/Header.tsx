import React from 'react'
import { Link } from 'react-router-dom'
import { ShoppingCart, User, LogOut, Crown } from 'lucide-react'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'
import { useAuth } from '../../contexts/AuthContext'
import { useCart } from '../../contexts/CartContext'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu'

const getRankColor = (rank: string) => {
  switch (rank) {
    case 'Bronze': return 'bg-amber-600'
    case 'Silver': return 'bg-gray-400'
    case 'Gold': return 'bg-yellow-500'
    case 'Platinum': return 'bg-purple-600'
    default: return 'bg-gray-400'
  }
}

export const Header: React.FC = () => {
  const { user, logout } = useAuth()
  const { itemCount } = useCart()

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <Crown className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              AuraSell
            </span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/catalog" className="text-gray-700 hover:text-purple-600 font-medium transition-colors">
              Products
            </Link>
            <Link to="/dashboard" className="text-gray-700 hover:text-purple-600 font-medium transition-colors">
              Dashboard
            </Link>
            <Link to="/admin" className="text-gray-700 hover:text-purple-600 font-medium transition-colors">
              Admin
            </Link>
          </nav>

          {/* Right side */}
          <div className="flex items-center space-x-4">
            {user && (
              <>
                {/* Rank Badge */}
                <Badge className={`${getRankColor(user.rank)} text-white font-medium`}>
                  {user.rank}
                </Badge>

                {/* Cart */}
                <Link to="/cart">
                  <Button variant="ghost" size="sm" className="relative">
                    <ShoppingCart className="w-5 h-5" />
                    {itemCount > 0 && (
                      <Badge className="absolute -top-2 -right-2 bg-purple-600 text-white text-xs min-w-[20px] h-5 flex items-center justify-center rounded-full">
                        {itemCount}
                      </Badge>
                    )}
                  </Button>
                </Link>

                {/* User Menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="flex items-center space-x-2">
                      <User className="w-5 h-5" />
                      <span className="hidden md:inline">{user.name}</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <div className="px-2 py-1.5">
                      <p className="text-sm font-medium">{user.name}</p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link to="/dashboard" className="flex items-center">
                        <User className="w-4 h-4 mr-2" />
                        Dashboard
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={logout} className="text-red-600">
                      <LogOut className="w-4 h-4 mr-2" />
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}