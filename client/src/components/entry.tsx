/**
 * Entry component
 * 
 * This component is the entry point for the application. It displays a form for users to enter their email
 */

import EmailForm from "@/components/form/email-form";
import ShowWaitlistPosition from "@/components/showWaitlistPosition";
import VerifyEmailAlert from "@/components/verifyEmailAlert";

export default function Entry() {
  return (
    <div className="relative h-screen">
      <VerifyEmailAlert />
      <div className="flex justify-center items-center h-full">
        <div className="flex flex-col gap-3 justify-center items-center">
          <h1 className="text-3xl font-bold leading-tight tracking-tighter md:text-4xl lg:leading-[1.1]">Join the waitlist!</h1>
          <EmailForm />
        </div>
      </div>
      <div className="absolute bottom-20 w-full flex justify-center">
        <ShowWaitlistPosition />
      </div>
    </div>
  )
}