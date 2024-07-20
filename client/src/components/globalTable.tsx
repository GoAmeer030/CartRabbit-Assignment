import axios from "axios"
import { useEffect, useState } from "react"

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

import WaitlistTable from "@/components/waitlistTable";
import { useUserStore } from "@/stores/userStore";

export default function GlobalTable() {
  const { user } = useUserStore();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPage, setTotalPage] = useState<number>(0);
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/global-waitlist/?page=${currentPage}`);
        setTotalPage(response.data.total_pages);
        setData(response.data.results);
        console.log(response.data);
      } catch (error) {
        console.error(error);
      }
    }
    fetchData();
  }, [user.email, currentPage]);

  return (
    <div className="flex flex-col h-[70vh]">
      <div className="mb-auto">
        {data && <WaitlistTable data={data} currentPage={currentPage} />}
      </div>
      <Pagination className="bottom-10 right-1.5">
        <PaginationContent>
          <PaginationItem className="cursor-pointer">
            <PaginationPrevious
              onClick={() => setCurrentPage(currentPage > 1 ? currentPage - 1 : 1)}
            />
          </PaginationItem>
          {totalPage > 0 && Array.from({ length: Math.min(3, totalPage) }, (_, i) => {
            const startPage = Math.max(1, currentPage - 2);
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