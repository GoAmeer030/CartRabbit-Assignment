import { Toaster } from "@/components/ui/toaster"

import Navbar from "@/components/navbar"
import Landing from "@/components/landing"
import UserRegisterDialog from "@/components/userRegisterDialog";
import { VerifyEmailAlert } from "@/components/verifyEmailAlert";

export default function App() {
  return (
    <>
      <Toaster />
      <UserRegisterDialog />
      <VerifyEmailAlert />

      <Navbar />
      <Landing />
    </>
  )
}