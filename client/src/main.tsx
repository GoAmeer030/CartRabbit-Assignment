/**
 * main.tsx
 * Entry point for the React application, setting up routing and theme context.
 * Utilizes React Router for navigation and ThemeProvider for theme management.
 */

import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'

import { ThemeProvider } from "@/components/themeProvider"
import App from '@/App'
import VerifyEmail from '@/VerifyEmail'
import AdminRedirect from '@/AdminRedirect'
import { BackgroundBeams } from '@/components/ui/background-beams'
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
          <Route path="/admin/" element={
            <AdminRedirect />
          } />
        </Routes>
      </Router>
      <div>
        <BackgroundBeams />
      </div>
    </ThemeProvider>
  </React.StrictMode>,
)
