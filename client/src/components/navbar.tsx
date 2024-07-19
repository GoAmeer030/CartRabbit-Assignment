import { Flame } from 'lucide-react';

import { ModeToggle } from "@/components/modeToggle";

export default function Navbar() {
    return (
        <nav className="h-[4rem] w-[90%] lg:w-[75%] md:w-[90%] m-auto flex justify-around border rounded-lg mt-8 fixed top-0 left-0 right-0 z-2 bg-foreground">
            <div className="w-[50%] h-full flex items-center justify-start pl-3">
                <Flame className="h-8 w-8 " color="#ff0000" />
                <p className="text-2xl font-bold bg-gradient-to-r from-red-800 via-red-500 to-orange-500 bg-clip-text text-transparent pb-1 pl-2">
                    SpotHot
                </p>
            </div>

            <div className="w-[50%] h-full flex items-center justify-end pr-5">
                <ModeToggle />
            </div>
        </nav>
    );
}