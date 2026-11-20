import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from '@/App.jsx'
import logoUrl from '../Logo NanoFile bleu et cyan.png'
import '@/styles/global.css'

const favicon = document.createElement('link')
favicon.rel = 'icon'
favicon.href = logoUrl
document.head.appendChild(favicon)

// Point d'entrée React : monte l'application dans le div #root du HTML.
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
