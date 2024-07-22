/**
 * Verify Email Alert Component
 * 
 * This component is responsible for displaying an alert to the user to verify their email.
 */

import { useEffect } from 'react';
import { AxiosError } from 'axios';

import { MailWarning } from 'lucide-react'
import {
    Alert,
    AlertDescription,
    AlertTitle,
} from "@/components/ui/alert"
import { Button } from "@/components/ui/button";
import { useToast } from '@/components/ui/use-toast';

import { useUserStore } from '@/stores/userStore'

export default function VerifyEmailAlert() {
    const { toast } = useToast();
    const { user, fetchUser, resendVerificationEmail, resetUser } = useUserStore();

    useEffect(() => {
        const fetchData = async () => {
            if (user.id !== 0) {
                try {
                    await fetchUser(user.email);
                } catch (error) {
                    toast({
                        description: "An error occurred! When fetching user data! Please try again!",
                        variant: "destructive"
                    });
                    resetUser();
                }
            }
        };

        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user.id, user.isVerified]);

    if (user.isVerified || user.id === 0) {
        return null;
    }

    const handleResendMail = async () => {
        try {
            await resendVerificationEmail(user.email);
            toast({
                description: "Verification email sent successfully!",
            });
        } catch (error) {
            if (error instanceof AxiosError && error.response?.status === 400) {
                toast({
                    description: error.response.data["message"],
                    variant: 'destructive'
                });
            } else {
                toast({
                    description: "An error occurred! When sending verification email! Please try again!",
                    variant: "destructive"
                });
            }
        }
    }

    return (
        <div className="text-center">
            <div className="inline-block w-[90%] md:w-[60%] lg:w-[40%]">
                <Alert className="flex flex-row justify-evenly items-center gap-2 top-32 popup-from-top-animation">
                    <div className='flex flex-row items-center'>
                        <div>
                            <MailWarning className="h-6 w-6 mt-1" />
                        </div>
                        <div className="ml-3">
                            <AlertTitle>Verify Email!</AlertTitle>
                            <AlertDescription>
                                Please verify your email to continue.
                            </AlertDescription>
                        </div>
                    </div>
                    <div>
                        <Button onClick={handleResendMail} variant="outline">Resend Mail</Button>
                    </div>
                </Alert>
            </div>
        </div>
    );
}