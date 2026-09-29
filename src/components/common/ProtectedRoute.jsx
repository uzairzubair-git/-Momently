import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

export default function ProtectedRoute({ children }) {
  const { currentUser } = useAuth()
  const location = useLocation()

  if (!currentUser) {
    // Send them to login, but remember where they wanted to go
    // (used so /join/:groupId links work before signup/login).
    return <Navigate to="/login" state={{ from: location.pathname }} replace />
  }

  return children
}
