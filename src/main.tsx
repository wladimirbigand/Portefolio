import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@/styles/index.css'
import App from '@/App'

const racine = createRoot(document.getElementById('root')!)

// Explorations de DA : serveur de dev uniquement (?explorations). En production,
// import.meta.env.DEV vaut false : la branche et l'import dynamique sont éliminés du bundle.
if (import.meta.env.DEV && new URLSearchParams(window.location.search).has('explorations')) {
  void import('../explorations/main').then(({ ExplorationsApp }) => {
    racine.render(
      <StrictMode>
        <ExplorationsApp />
      </StrictMode>,
    )
  })
} else {
  racine.render(
    <StrictMode>
      <App />
    </StrictMode>,
  )
}
