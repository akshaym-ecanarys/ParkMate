import { useAuth } from './auth/AuthContext'
import AuthFlow from './auth/AuthFlow'
import ParkMate from './ParkMate'

function LoadingScreen() {
  return (
    <div style={{
      minHeight: '100vh', background: '#0f1117',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <div style={{
        width: 36, height: 36,
        border: '3px solid rgba(250,199,117,0.2)',
        borderTopColor: '#FAC775', borderRadius: '50%',
        animation: 'spin 0.7s linear infinite',
      }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}

export default function AppRoot() {
  const { user, loading } = useAuth()
  if (loading) return <LoadingScreen />
  if (!user) return <AuthFlow />
  return <ParkMate />
}