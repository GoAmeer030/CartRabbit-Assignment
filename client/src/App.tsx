/**
 * App.tsx
 * 
 * Main application component integrating global components and main UI.
 */

import { Toaster } from "@/components/ui/toaster"
import Navbar from "@/components/navbar"
import Landing from "@/components/landing"
import UserRegisterDialog from "@/components/userRegisterDialog";

export default function App() {
  return (
    <>
      <Toaster />
      <UserRegisterDialog />

      <Navbar />
      <Landing />
    </>
  )
}