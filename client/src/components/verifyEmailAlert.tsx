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
                    console.log(error);
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
        <div className="absolute top-36 left-1/2 -translate-x-1/2 lg:w-[40%] md:w-[60%] w-[90%]">
            <Alert className="flex flex-row justify-center">
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
    );
}