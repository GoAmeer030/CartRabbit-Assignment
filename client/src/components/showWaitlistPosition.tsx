import { useEffect } from "react";

import { CircleArrowDown } from 'lucide-react';
import { Card } from "@/components/ui/card"

import { useToast } from "@/components/ui/use-toast";

import { useWaitlistPositionStore, useUserStore } from "@/stores/userStore";

export default function ShowWaitlistPosition() {
    const { toast } = useToast();

    const { user } = useUserStore();
    const { waitlistPosition, fetchWaitlistPosition } = useWaitlistPositionStore();

    useEffect(() => {
        if (user.id === 0 || user.isVerified === false) {
            return;
        }

        const fetchData = async () => {
            try {
                await fetchWaitlistPosition(user.id);
            } catch (error) {
                toast({
                    description: "An error occurred! When fetching waitlist position! Please try again!",
                    variant: "destructive"
                });
            }
        };

        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user.id, user.isVerified]);

    if (user.id === 0 || user.isVerified === false) {
        return null;
    }

    return (
        <Card className="flex flex-col justify-center items-center lg:w-[70%] md:w-[70%] w-[90%] popup-from-bottom-animation">
            <h1 className="text-3xl font-bold leading-tight tracking-tighter md:text-4xl lg:leading-[1.1] mt-5">🎉🎉 Hurray 🎉🎉<br />You are at position <span className="text-primary inline">{waitlistPosition.position}</span></h1>
            <div className="flex flex-col justify-center items-center mb-5">
                <p className="mt-2 text-muted-foreground">scroll down for more</p>
                <CircleArrowDown className="h-8 w-8 animate-bounce mt-4" color="#a8a29f" />
            </div>
        </Card>
    );
}