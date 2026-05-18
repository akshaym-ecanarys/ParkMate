import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
<<<<<<< HEAD
import { GoogleOAuthProvider } from '@react-oauth/google'
import { AuthProvider } from './auth/AuthContext'
import AppRoot from './AppRoot.jsx'

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || ""

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <AuthProvider>
        <AppRoot />
      </AuthProvider>
    </GoogleOAuthProvider>
  </StrictMode>,
)
=======
import ParkMate from './ParkMate.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ParkMate />
  </StrictMode>,
)
>>>>>>> b1a7636b57ab7aaed2ed59403a57d995ecda691b
