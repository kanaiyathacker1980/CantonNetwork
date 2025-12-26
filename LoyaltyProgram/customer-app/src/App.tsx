import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from './store/authStore'
import LoginPage from './pages/LoginPage'
import WalletPage from './pages/WalletPage'
import ScanPage from './pages/ScanPage'
import RewardsPage from './pages/RewardsPage'
import ProfilePage from './pages/ProfilePage'
import BottomNav from './components/BottomNav'

function App() {
  const { isAuthenticated } = useAuthStore()

  if (!isAuthenticated) {
    return <LoginPage />
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <Routes>
        <Route path="/" element={<Navigate to="/wallet" replace />} />
        <Route path="/wallet" element={<WalletPage />} />
        <Route path="/scan" element={<ScanPage />} />
        <Route path="/rewards" element={<RewardsPage />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Routes>
      <BottomNav />
    </div>
  )
}

export default App
