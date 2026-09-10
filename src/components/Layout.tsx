import { useEffect, useState } from 'react'
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import {
  LayoutDashboard,
  Ticket,
  PlusCircle,
  Users,
  FolderTree,
  BarChart3,
  User,
  LogOut,
  Headphones,
  Mail,
  ShieldCheck,
  LifeBuoy,
  Menu,
  X,
  Sun,
  Moon
} from 'lucide-react'

export function Layout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const { theme, toggleTheme } = useTheme()
  const [menuOpen, setMenuOpen] = useState(false)

  // Close the mobile menu whenever the route changes.
  useEffect(() => {
    setMenuOpen(false)
  }, [location.pathname])

  const links =
    user?.role === 'Admin'
      ? [
          ['/dashboard', 'Dashboard'],
          ['/tickets', 'Tickets'],
          ['/users', 'Users'],
          ['/categories', 'Categories'],
          ['/reports', 'Reports'],
          ['/profile', 'Profile'],
        ]
      : user?.role === 'Support Agent'
      ? [
          ['/dashboard', 'Dashboard'],
          ['/tickets', 'My Tickets'],
          ['/profile', 'Profile'],
        ]
      : [
          ['/dashboard', 'Dashboard'],
          ['/tickets/new', 'Create Ticket'],
          ['/tickets', 'My Tickets'],
          ['/profile', 'Profile'],
        ]

  const getNavIcon = (to: string) => {
    switch (to) {
      case '/dashboard':
        return <LayoutDashboard size={18} />
      case '/tickets':
        return <Ticket size={18} />
      case '/tickets/new':
        return <PlusCircle size={18} />
      case '/users':
        return <Users size={18} />
      case '/categories':
        return <FolderTree size={18} />
      case '/reports':
        return <BarChart3 size={18} />
      case '/profile':
        return <User size={18} />
      default:
        return <Ticket size={18} />
    }
  }

  return (
    <div className="app">
      {menuOpen && (
        <div className="sidebar-backdrop" onClick={() => setMenuOpen(false)} />
      )}

      <aside className={`sidebar ${menuOpen ? 'open' : ''}`}>
        <div className="sidebar-top">
          <Link className="brand" to="/dashboard">
            <div className="brand-badge">
              <Headphones size={20} />
            </div>
            <span>IT Service Desk</span>
          </Link>
          <button
            className="sidebar-close"
            onClick={() => setMenuOpen(false)}
            aria-label="Close menu"
          >
            <X size={20} />
          </button>
        </div>

        <div className="userbox">
          <div className="userbox-top">
            <div className="user-icon">
              {user?.role === 'Admin' ? (
                <ShieldCheck size={16} />
              ) : user?.role === 'Support Agent' ? (
                <LifeBuoy size={16} />
              ) : (
                <User size={16} />
              )}
            </div>
            <div>
              <strong>{user?.name}</strong>
              <span>{user?.role}</span>
            </div>
          </div>
        </div>

        <nav>
          {links.map(([to, label]) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/tickets'}
              className={({ isActive }) => (isActive ? 'active' : '')}
            >
              {getNavIcon(to)}
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        <button
          className="logout"
          onClick={() => {
            logout()
            navigate('/login')
          }}
        >
          <LogOut size={16} />
          <span>Logout</span>
        </button>
      </aside>

      <main className="main">
        <header>
          <div className="header-left">
            <button
              className="menu-toggle"
              onClick={() => setMenuOpen(true)}
              aria-label="Open menu"
            >
              <Menu size={20} />
            </button>
            <Headphones size={18} className="header-icon" />
            <h2>IT Service Desk & Ticket Management</h2>
          </div>
          <div className="header-right">
            <button
              className="theme-toggle"
              onClick={toggleTheme}
              aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
            </button>
            <span className="header-email">
              <Mail size={15} />
              {user?.email}
            </span>
          </div>
        </header>
        <section className="content">
          <Outlet />
        </section>
      </main>
    </div>
  )
}

