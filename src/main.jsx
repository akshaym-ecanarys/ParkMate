import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import ParkMate from './ParkMate.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ParkMate />
  </StrictMode>,
)
