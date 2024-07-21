/**
 * ReferalsPage component
 * 
 * This component is responsible for rendering the referals page of the application.
 * It includes the ReferComponent and ReferalsTable components.
 */

import axios from "axios"
import { useEffect, useState } from "react"

import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination"
import { useToast } from "@/components/ui/use-toast";

import ReferComponent from "@/components/referComponent";
import ReferalsTable from "@/components/tables/referalsTable";

import { useUserStore } from "@/stores/userStore";

export default function ReferalsPage() {
    const { user } = useUserStore();
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [totalPage, setTotalPage] = useState<number>(0);
    const [data, setData] = useState<any>(null);
    const { toast } = useToast();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/referrals/${user.id}/?page=${currentPage}`);
                setTotalPage(response.data.total_pages);
                setData(response.data.results);
            } catch (error) {
                toast({
                    description: "An error occurred while getting referrals list! Please try again!",
                    variant: "destructive"
                });
            }
        }
        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user.id, currentPage]);

    return (
        <div className="flex flex-col h-[70vh] items-center">
            <div>
                <ReferComponent />
            </div>
            <div className="mb-auto">
                {data && <ReferalsTable data={data} currentPage={currentPage} />}
            </div>
            <Pagination className="bottom-10 right-1.5">
                <PaginationContent>
                    <PaginationItem className="cursor-pointer">
                        <PaginationPrevious
                            onClick={() => setCurrentPage(currentPage > 1 ? currentPage - 1 : 1)}
                        />
                    </PaginationItem>
                    {totalPage > 0 && Array.from({ length: Math.min(3, totalPage) }, (_, i) => {
                        let startPage;
                        if (totalPage <= 3) {
                            startPage = 1;
                        } else if (currentPage === 3) {
                            startPage = 2;
                        } else if (currentPage > 3 && currentPage < totalPage) {
                            startPage = currentPage - 1;
                        } else if (currentPage === totalPage) {
                            startPage = totalPage - 2;
                        } else {
                            startPage = 1;
                        }
                        const pageNumber = startPage + i;
                        if (pageNumber > totalPage) return null;
                        return (
                            <PaginationItem key={i} className="cursor-pointer">
                                <PaginationLink
                                    className={currentPage === pageNumber ? 'border-primary' : ''}
                                    isActive={currentPage === pageNumber}
                                    onClick={() => setCurrentPage(pageNumber)}
                                >
                                    {pageNumber}
                                </PaginationLink>
                            </PaginationItem>
                        );
                    }).filter(Boolean)}
                    <PaginationItem className="cursor-pointer">
                        <PaginationNext
                            onClick={() => setCurrentPage(currentPage < totalPage ? currentPage + 1 : totalPage)}
                        />
                    </PaginationItem>
                </PaginationContent>
            </Pagination>
        </div>
    )
}