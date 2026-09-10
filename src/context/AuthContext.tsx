import { createContext, useContext, useEffect, useState } from 'react'
import type { User } from '../types'
import { userService } from '../services/userService'

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<User>
  logout: () => void
}
const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({children}:{children:React.ReactNode}) {
  const [user,setUser] = useState<User|null>(() => {
    const id = localStorage.getItem('userId')
    return id ? JSON.parse(localStorage.getItem('userData') || 'null') : null
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const id = localStorage.getItem('userId')
    if (id) {
      userService.list().then(users => {
        const found = users.find(u => u.id === id) || null
        // If the account was deactivated or removed since last login, force logout
        if (!found || found.status !== 'Active') {
          setUser(null)
          localStorage.removeItem('userId')
          localStorage.removeItem('userData')
        } else {
          setUser(found)
          localStorage.setItem('userData', JSON.stringify(found))
        }
      }).catch(()=>{}).finally(()=>setLoading(false))
    } else {
      setLoading(false)
    }
  }, [])

  const login = async (email:string, password:string) => {
    const users = await userService.list()
    const found = users.find(u => u.email.toLowerCase() === email.trim().toLowerCase())
    if (!found) throw new Error('No account found with this email.')
    if (found.status !== 'Active') throw new Error('This account has been deactivated. Contact your Admin.')
    if (found.password !== password) throw new Error('Incorrect password.')
    setUser(found); localStorage.setItem('userId',found.id); localStorage.setItem('userData',JSON.stringify(found))
    return found
  }
  const logout = () => { setUser(null); localStorage.removeItem('userId'); localStorage.removeItem('userData') }
  return <AuthContext.Provider value={{user,loading,login,logout}}>{children}</AuthContext.Provider>
}
export const useAuth = () => {
  const c = useContext(AuthContext)
  if (!c) throw new Error('useAuth must be inside AuthProvider')
  return c
}
