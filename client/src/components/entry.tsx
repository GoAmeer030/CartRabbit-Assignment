import EmailForm from "@/components/form/email-form";
import ShowWaitlistPosition from "@/components/showWaitlistPosition";
import VerifyEmailAlert from "@/components/verifyEmailAlert";

export default function Entry() {
  return (
    <div className="relative">
      <VerifyEmailAlert />
      <div className="flex justify-center items-center h-screen">
        <div className="flex flex-col gap-3 w-screen justify-center items-center">
          <h1 className="text-3xl font-bold leading-tight tracking-tighter md:text-4xl lg:leading-[1.1]">Join the waitlist!</h1>
          <EmailForm />
          <div className="mt-10">
            <ShowWaitlistPosition />
          </div>
        </div>
      </div>
    </div>
  )
}