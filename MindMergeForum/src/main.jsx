import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

/**
 * Application entry point
 * 
 * Renders the App component to the DOM using React 18's createRoot API
 * Wraps the application in StrictMode for development checks
 */
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
