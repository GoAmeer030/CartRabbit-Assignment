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
        <div className="border rounded-md lg:w-[60vw] md:w-[60vw] w-[100%] mt-5">
            <Table>
                <TableHeader className="border grid grid-cols-3">
                    <TableHead className="text-center pt-3.5">S. No.</TableHead>
                    <TableHead className="text-center pt-3.5">Position</TableHead>
                    <TableHead className="text-center pt-3.5">User</TableHead>
                </TableHeader>
                <TableBody>
                    {data.map((entry: WaitlistEntry, index: number) => (
                        <TableRow key={index} className="border grid grid-cols-3">
                            <TableCell className="text-center">{((currentPage - 1) * 10) + index + 1}</TableCell>
                            <TableCell className="text-center font-semibold">{entry.position}</TableCell>
                            <TableCell className="text-center">{entry.user}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}