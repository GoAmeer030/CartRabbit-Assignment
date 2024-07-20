import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'

import { ThemeProvider } from "@/components/themeProvider"
import App from '@/App'
import VerifyEmail from '@/VerifyEmail'
import '@/styles/index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <Router>
        <Routes>
          <Route path="/" element={
            <App />
          } />
          <Route path="/verify/" element={
            <VerifyEmail />
          } />
        </Routes>
      </Router>
    </ThemeProvider>
  </React.StrictMode>,
)
