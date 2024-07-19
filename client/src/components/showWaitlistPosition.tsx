import { useEffect } from "react";

import { CircleArrowDown } from 'lucide-react';

import { useToast } from "@/components/ui/use-toast";

import { useWaitlistPositionStore, useUserStore } from "@/stores/userStore";

export default function ShowWaitlistPosition() {
    const { toast } = useToast();

    const { user } = useUserStore();
    const { waitlistPosition, fetchWaitlistPosition } = useWaitlistPositionStore();

    if (user.email === "") {
        return;
    }

    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {
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
    }, []);

    return (
        <div className="flex flex-col justify-center items-center">
            <h1 className="text-3xl font-bold leading-tight tracking-tighter md:text-4xl lg:leading-[1.1]">🎉🎉 Hurray 🎉🎉<br />You are at position <span className="text-primary inline">{waitlistPosition.position}</span></h1>
            <div className="flex flex-col justify-center items-center">
                <p className="mt-2 text-slate-600">scroll down for more</p>
                <CircleArrowDown className="h-8 w-8 animate-bounce mt-4" color="#475569" />
            </div>
        </div>
    );
}