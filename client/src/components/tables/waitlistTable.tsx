/**
 * Waitlist Table
 * 
 * This component is responsible for displaying the waitlist table.
 */

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

interface WaitlistEntry {
    position: number;
    user: string;
}

export default function WaitlistTable({ data, currentPage }: { data: WaitlistEntry[], currentPage: number }) {
    return (
        <div className="flex justify-center">
            <div className="border rounded-md lg:w-[90vw] md:w-[90vw] max-w-[90%] overflow-auto">
                <Table>
                    <TableHeader className="border grid grid-cols-3">
                        <TableHead className="text-center pt-3.5">S. No.</TableHead>
                        <TableHead className="text-center pt-3.5">Position</TableHead>
                        <TableHead className="text-center pt-3.5">User</TableHead>
                    </TableHeader>
                    <TableBody>
                        {data.length === 0 ? (
                            <TableRow className="border grid grid-cols-3">
                                <TableCell className="text-center" colSpan={1}></TableCell>
                                <TableCell className="text-center font-bold" colSpan={1}>No entries yet</TableCell>
                                <TableCell className="text-center" colSpan={1}></TableCell>
                            </TableRow>
                        ) : (
                            data.map((entry: WaitlistEntry, index: number) => (
                                <TableRow key={index} className="border grid grid-cols-3">
                                    <TableCell className="text-center">{((currentPage - 1) * 10) + index + 1}</TableCell>
                                    <TableCell className="text-center font-semibold">{entry.position}</TableCell>
                                    <TableCell className="text-center overflow-auto">{entry.user}</TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}