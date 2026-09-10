import { BrowserRouter,Routes,Route,Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { ToastProvider } from './context/ToastContext'
import { ThemeProvider } from './context/ThemeContext'
import { ProtectedRoute } from './components/ProtectedRoute'
import { Layout } from './components/Layout'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Tickets from './pages/Tickets'
import TicketForm from './pages/TicketForm'
import TicketDetails from './pages/TicketDetails'
import Users from './pages/Users'
import Categories from './pages/Categories'
import Profile from './pages/Profile'
import Reports from './pages/Reports'

export default function App(){
 return <ThemeProvider><AuthProvider><ToastProvider><BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}><Routes>
  <Route path="/login" element={<Login/>}/>
  <Route element={<ProtectedRoute/>}><Route element={<Layout/>}>
   <Route path="/dashboard" element={<Dashboard/>}/>
   <Route path="/tickets" element={<Tickets/>}/>
   <Route path="/tickets/new" element={<TicketForm/>}/>
   <Route path="/tickets/:id" element={<TicketDetails/>}/>
   <Route path="/tickets/:id/edit" element={<TicketForm/>}/>
   <Route path="/profile" element={<Profile/>}/>
   <Route element={<ProtectedRoute roles={['Admin']}/>}>
     <Route path="/users" element={<Users/>}/>
     <Route path="/categories" element={<Categories/>}/>
     <Route path="/reports" element={<Reports/>}/>
   </Route>
  </Route></Route>
  <Route path="*" element={<Navigate to="/login" replace/>}/>
 </Routes></BrowserRouter></ToastProvider></AuthProvider></ThemeProvider>
}
