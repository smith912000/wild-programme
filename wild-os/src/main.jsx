import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter basename="/wild-os">
      <App />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3500,
          style: {
            background: '#0A0612',
            color: '#F4F1ED',
            border: '1px solid #231838',
            borderRadius: '12px',
            fontSize: '14px',
          },
          success: {
            iconTheme: { primary: '#86B894', secondary: '#0A0612' },
          },
          error: {
            iconTheme: { primary: '#E07A85', secondary: '#0A0612' },
          },
        }}
      />
    </BrowserRouter>
  </StrictMode>,
)
