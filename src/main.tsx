import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { EffectsProvider } from './shared/effects/effects.provider.tsx'
import { EffectsOverlay } from './shared/effects/EffectsOverlay.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <EffectsProvider>
        <App />
        <EffectsOverlay />
    </EffectsProvider>
  </StrictMode>,
)
