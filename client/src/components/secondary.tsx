/**
 * Secondary component
 * 
 * This component is responsible for rendering the secondary page of the application.
 * It includes the GlobalTable and ReferalsPage components.
 */

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import GlobalTable from "@/components/globalTable"
import ReferalsPage from "@/components/referalsPage"

import { useUserStore } from "@/stores/userStore"

export default function Secondary() {
    const { user } = useUserStore();

    return (
        <Tabs defaultValue="global-list">
            <div className="flex justify-center">
                <TabsList className={`grid lg:w-[30vw] md:w-[30vw] w-[90%] ${user.id !== 0 ? 'grid-cols-2' : 'grid-cols-1'}`} >
                    <TabsTrigger value="global-list">Global List</TabsTrigger>
                    {user.id !== 0 && <TabsTrigger value="my-referrals">My Referrals</TabsTrigger>}
                </TabsList>
            </div>
            <TabsContent value="global-list">
                <div>
                    <GlobalTable />
                </div>
            </TabsContent>
            {user.id !== 0 && <TabsContent value="my-referrals">
                <div>
                    <ReferalsPage />
                </div>
            </TabsContent>}
        </Tabs>
    )
}