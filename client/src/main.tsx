import React from 'react'
import ReactDOM from 'react-dom/client'
import App from '@/App'
import '@/styles/index.css'
import { ThemeProvider } from "@/components/themeProvider"


ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <App />
    </ThemeProvider>
  </React.StrictMode>,
)
