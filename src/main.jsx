import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from '@/App.jsx'
import '@/styles/global.css'

// Point d'entrée React : monte l'application dans le div #root du HTML.
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
