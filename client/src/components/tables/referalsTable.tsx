import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

interface WaitlistEntry {
    referee: {
        name: string;
        is_verified: boolean;
    }
}

function getVerificationStatus(isVerified: boolean): string {
    return isVerified ? "Verified" : "Not Verified";
}

export default function ReferalsTable({ data, currentPage }: { data: WaitlistEntry[], currentPage: number }) {
    return (
        <div>
            <p className="text-sm text-muted-foreground text-center w-80 lg:w-full md:w-full mb-2">ONLY VERIFIED USERS WILL BE COUNTED TOWARDS GLOBAL POSITION</p>
            <div className="border rounded-md lg:w-[60vw] md:w-[60vw] w-[100%]">
                <Table>
                    <TableHeader className="border grid grid-cols-3">
                        <TableHead className="text-center pt-3.5">S. No.</TableHead>
                        <TableHead className="text-center pt-3.5">User</TableHead>
                        <TableHead className="text-center pt-3.5">Verification</TableHead>
                    </TableHeader>
                    <TableBody>
                        {data.map((entry: WaitlistEntry, index: number) => (
                            <TableRow key={index} className="border grid grid-cols-3">
                                <TableCell className="text-center">{((currentPage - 1) * 10) + index + 1}</TableCell>
                                <TableCell className="text-center">{entry.referee.name}</TableCell>
                                <TableCell className="text-center font-semibold">{getVerificationStatus(entry.referee.is_verified)}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}