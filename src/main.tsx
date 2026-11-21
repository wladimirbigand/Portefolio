import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { App } from './App'
import { redirigerAnciennesAncres } from './lib/anciennesAncres'
import './styles.css'

// Avant le premier rendu : la page lit l'ancre de l'URL en se montant.
redirigerAnciennesAncres()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
