import { MailWarning } from 'lucide-react'

import {
    Alert,
    AlertDescription,
    AlertTitle,
} from "@/components/ui/alert"
import { useToast } from '@/components/ui/use-toast';
import { useEffect } from 'react';

import { useUserStore } from '@/stores/userStore'

export default function VerifyEmailAlert() {
    const { toast } = useToast();
    const { user, fetchUser, resetUser } = useUserStore();

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

    return (
        <div className="text-center">
            <div className="inline-block w-[90%] md:w-[60%] lg:w-[40%]">
                <Alert className="flex flex-row justify-center top-32 popup-from-top-animation">
                    <div>
                        <MailWarning className="h-6 w-6 mt-1" />
                    </div>
                    <div className="ml-3">
                        <AlertTitle>Verify Email!</AlertTitle>
                        <AlertDescription>
                            Please verify your email to continue.
                        </AlertDescription>
                    </div>
                </Alert>
            </div>
        </div>
    );
}