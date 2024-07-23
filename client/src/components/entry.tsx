/**
 * Entry component
 * 
 * This component is the entry point for the application. It displays a form for users to enter their email
 */

import { FlipWords } from "@/components/ui/filp-words";

import EmailForm from "@/components/form/email-form";
import ShowWaitlistPosition from "@/components/showWaitlistPosition";
import VerifyEmailAlert from "@/components/verifyEmailAlert";

export default function Entry() {
  const words = ["Join The Waitlist!", "Get Early Access!", "Enter Fast! Win Fast!", "Get Ahead!", "Wait No More!"];

  return (
    <div className="relative h-screen">
      <VerifyEmailAlert />
      <div className="flex justify-center items-center h-full">
        <div className="flex flex-col gap-3 justify-center items-center">
          <h1 className="relative z-10 text-3xl md:text-7xl text-center font-sans font-bold"><FlipWords words={words} duration={5000} /></h1>
          <EmailForm />
        </div>
      </div>
      <div className="absolute bottom-20 w-full flex justify-center">
        <ShowWaitlistPosition />
      </div>
    </div>
  )
}