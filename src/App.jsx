import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import ProtectedRoute from './components/common/ProtectedRoute'

import Login from './pages/Login'
import Signup from './pages/Signup'
import GroupList from './pages/GroupList'
import CreateGroup from './pages/CreateGroup'
import GroupDetail from './pages/GroupDetail'
import JoinGroup from './pages/JoinGroup'

export default function App() {
  const { currentUser } = useAuth()

  return (
    <Routes>
      <Route path="/" element={<Navigate to={currentUser ? '/groups' : '/login'} replace />} />

      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      <Route
        path="/join/:groupId"
        element={
          <ProtectedRoute>
            <JoinGroup />
          </ProtectedRoute>
        }
      />

      <Route
        path="/groups"
        element={
          <ProtectedRoute>
            <GroupList />
          </ProtectedRoute>
        }
      />
      <Route
        path="/groups/new"
        element={
          <ProtectedRoute>
            <CreateGroup />
          </ProtectedRoute>
        }
      />
      <Route
        path="/groups/:groupId"
        element={
          <ProtectedRoute>
            <GroupDetail />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
