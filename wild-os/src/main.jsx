import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3500,
          style: {
            background: '#161920',
            color: '#e8eaf0',
            border: '1px solid #2a2f3d',
            borderRadius: '12px',
            fontSize: '14px',
          },
          success: {
            iconTheme: { primary: '#4ade80', secondary: '#161920' },
          },
          error: {
            iconTheme: { primary: '#f87171', secondary: '#161920' },
          },
        }}
      />
    </BrowserRouter>
  </StrictMode>,
)
