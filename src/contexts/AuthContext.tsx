import React, { createContext, useContext, useState, useEffect } from 'react'
import { blink } from '../blink/client'
import { User } from '../types'

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string, name: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = blink.auth.onAuthStateChanged((state) => {
      if (state.user) {
        // Fetch user profile with rank information
        fetchUserProfile(state.user.id)
      } else {
        setUser(null)
      }
      setLoading(state.isLoading)
    })

    return unsubscribe
  }, [])

  const fetchUserProfile = async (userId: string) => {
    try {
      const authUser = await blink.auth.me()
      
      // Check if user profile exists in localStorage first
      const storedProfile = localStorage.getItem(`user_profile_${userId}`)
      if (storedProfile) {
        const profile = JSON.parse(storedProfile)
        setUser(profile)
        return
      }
      
      // Try to fetch from database, but handle gracefully if it fails
      try {
        const existingUsers = await blink.db.users.list({
          where: { id: userId },
          limit: 1
        })
        
        if (existingUsers.length > 0) {
          const dbUser = existingUsers[0]
          const userProfile: User = {
            id: dbUser.id,
            email: dbUser.email,
            name: dbUser.name,
            rank: dbUser.rank as 'Bronze' | 'Silver' | 'Gold' | 'Platinum',
            createdAt: dbUser.createdAt || new Date().toISOString(),
            updatedAt: dbUser.updatedAt || new Date().toISOString()
          }
          localStorage.setItem(`user_profile_${userId}`, JSON.stringify(userProfile))
          setUser(userProfile)
          return
        }
      } catch (dbError) {
        console.log('Database not available, using demo mode:', dbError)
      }
      
      // Create demo user profile based on email (fallback)
      let demoRank = 'Gold'
      let demoName = 'Sarah Johnson'
      
      if (authUser.email?.includes('silver')) {
        demoRank = 'Silver'
        demoName = 'Mike Chen'
      } else if (authUser.email?.includes('bronze')) {
        demoRank = 'Bronze'
        demoName = 'Lisa Rodriguez'
      } else if (authUser.email?.includes('platinum') || authUser.email?.includes('admin')) {
        demoRank = 'Platinum'
        demoName = 'Admin User'
      }
      
      const sampleUser: User = {
        id: userId,
        email: authUser.email || 'demo@aurasell.com',
        name: demoName,
        rank: demoRank as 'Bronze' | 'Silver' | 'Gold' | 'Platinum',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      
      // Try to save to database, but don't fail if it doesn't work
      try {
        await blink.db.users.create({
          id: sampleUser.id,
          email: sampleUser.email,
          name: sampleUser.name,
          rank: sampleUser.rank,
          userId: sampleUser.id,
          createdAt: sampleUser.createdAt,
          updatedAt: sampleUser.updatedAt
        })
      } catch (saveError) {
        console.log('Could not save to database, continuing with local storage:', saveError)
      }
      
      // Store in localStorage for persistence
      localStorage.setItem(`user_profile_${userId}`, JSON.stringify(sampleUser))
      setUser(sampleUser)
    } catch (error) {
      console.error('Error fetching user profile:', error)
      // Set a default user to prevent app from breaking
      const defaultUser = {
        id: userId,
        email: 'demo@aurasell.com',
        name: 'Demo User',
        rank: 'Gold' as const,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      localStorage.setItem(`user_profile_${userId}`, JSON.stringify(defaultUser))
      setUser(defaultUser)
    }
  }

  const login = async (email: string, password: string) => {
    // In a real implementation, this would authenticate with your backend
    // For now, we'll simulate login and redirect to Blink auth
    blink.auth.login()
  }

  const register = async (email: string, password: string, name: string) => {
    // In production, this would create user record in database
    // For demo, redirect to Blink auth
    blink.auth.login()
  }

  const logout = () => {
    blink.auth.logout()
    setUser(null)
  }

  const value = {
    user,
    loading,
    login,
    register,
    logout
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

