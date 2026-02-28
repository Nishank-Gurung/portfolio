import { Skeleton } from "@/components/ui/skeleton";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

export default function PageSkeleton() {
    return (
        <div className="container mx-auto">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <Skeleton className="h-9 w-48 mb-2" />
                    <Skeleton className="h-4 w-32" />
                </div>
                <Skeleton className="h-10 w-32" /> 
            </div>

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>
                                <Skeleton className="h-4 w-20" />
                            </TableHead>
                            <TableHead>
                                <Skeleton className="h-4 w-20" />
                            </TableHead>
                            <TableHead>
                                <Skeleton className="h-4 w-16" />
                            </TableHead>
                            <TableHead>
                                <Skeleton className="h-4 w-24" />
                            </TableHead>
                            <TableHead>
                                <Skeleton className="h-4 w-24" />
                            </TableHead>
                            <TableHead className="w-[100px]">
                                <Skeleton className="h-4 w-12" />
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {/* Generating 5 skeleton rows */}
                        {Array.from({ length: 5 }).map((_, i) => (
                            <TableRow key={i}>
                                <TableCell>
                                    <Skeleton className="h-5 w-32" />
                                </TableCell>
                                <TableCell>
                                    <Skeleton className="h-5 w-40" />
                                </TableCell>
                                <TableCell>
                                    <Skeleton className="h-5 w-20" />
                                </TableCell>
                                <TableCell>
                                    <Skeleton className="h-5 w-24" />
                                </TableCell>
                                <TableCell>
                                    <Skeleton className="h-5 w-24" />
                                </TableCell>
                                <TableCell>
                                    <Skeleton className="h-8 w-8 rounded-full" />{" "}
                                    {/* Action Icon */}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
