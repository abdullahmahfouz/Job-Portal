import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { ClerkProvider } from '@clerk/clerk-react'
import {  dark } from '@clerk/themes'

// Read the Clerk publishable key from the environment
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

  if (!PUBLISHABLE_KEY) {
    throw new Error('Add your Clerk Publishable Key to the .env file')
  }

  // Mount the React application into the DOM
  createRoot(document.getElementById('root')).render(
    <StrictMode>
      <ClerkProvider
      appearance={{
       baseTheme: dark,
        
      }}
      publishableKey={PUBLISHABLE_KEY}
      
      >
        
        <App />
      </ClerkProvider>
    </StrictMode>,
  )