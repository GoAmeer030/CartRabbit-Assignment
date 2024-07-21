/**
 * Referrer Component
 * 
 * This component is responsible for rendering the referral section.
 * It includes the referral link and a button to copy the link along with the number of referrals.
 */

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

import { useUserStore } from "@/stores/userStore";

export default function ReferComponent() {
    const { user } = useUserStore();
    const { toast } = useToast();

    const handleCopy = () => {
        navigator.clipboard.writeText(`${import.meta.env.VITE_CLIENT_URL}/?refCd=${user.referralCode}`);

        toast({
            description: "Referral Link Copied!!"
        });
    }

    return (
        <div className="flex flex-col items-center gap-3 mt-10 mb-10">
            <div>
                <h1 className="text-2xl font-bold tracking-tight text-center">You Have <span className="text-primary inline">{user.referralCount}</span> Refferals</h1>
                <p className="text-center">Invite More People To Increase The Global Position!!</p>
            </div>
            <div className="flex w-full max-w-sm items-center space-x-2 mt-2">
                <Input className="font-semibold" value={`${import.meta.env.VITE_CLIENT_URL}/?refCd=${user.referralCode}`} onClick={handleCopy} readOnly />
                <Button onClick={handleCopy}>Copy</Button>
            </div>
        </div>
    )
}